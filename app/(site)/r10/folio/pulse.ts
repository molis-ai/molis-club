// Molis Work 公开仓库（github.com/molis-ai/molis-work）的真实活动：近七天每天的提交数、最近一次改动、main 上最近一次构建。
// 只在服务端取，走 GitHub 公开接口；结果在内存里留 15 分钟，取不到时 3 分钟后再试。
// 不带凭据时每个出口 IP 每小时只有 60 次（同一出口的别的程序也在用），所以尽量省：
// 每个地址记下 ETag 做条件请求（没变化时 GitHub 回 304，不算次数）；过去六天的数一天里几乎不变，6 小时才重取一次。
// 刷新失败时，上一次取到的真数据最多再用 2 小时，页面上写明「截至几点」；再旧就不显示。
// 部署时可以在服务端环境变量里放一个只读的 GITHUB_TOKEN 提高额度（可选，不放也能跑，限流时就不显示）。
// 任何一块取不到（限流、超时、接口变了）就是 null，页面上那一块什么都不显示；不补假数，不留占位。
// 「一天」按工作室所在的北京时间切，所以过去六天的地址一整天不变，几乎都是 304。

const REPO = 'molis-ai/molis-work';
const API = `https://api.github.com/repos/${REPO}`;
export const REPO_URL = `https://github.com/${REPO}`;

const TTL = 15 * 60_000;
const RETRY = 3 * 60_000;
const STALE = 2 * 3_600_000;
const SETTLED = 6 * 3_600_000;
const DAY = 86_400_000;
const CST = 8 * 3_600_000;

export type PulseDay = {
  /** 北京时间的日期，YYYY-MM-DD */
  date: string;
  count: number;
};

export type Pulse = {
  /** 这份数据是什么时候取到的 */
  fetchedAt: string;
  /** 近七天（含今天），从六天前到今天 */
  days: PulseDay[] | null;
  /** 近七天提交合计 */
  week: number | null;
  /** 最近一次改动（不算合并提交） */
  last: { at: string; title: string; url: string } | null;
  /** main 上最近一次 CI */
  build: {
    at: string;
    /** completed / in_progress / queued … */
    status: string;
    /** success / failure / cancelled …；没跑完时为 null */
    conclusion: string | null;
    url: string;
  } | null;
};

type Saved = { etag: string; link: string | null; body: unknown; at: number };

type Store = {
  value?: Pulse | null;
  at?: number;
  ttl?: number;
  pending?: Promise<Pulse | null>;
  /** 每个地址上一次的 ETag 与内容 */
  saved?: Map<string, Saved>;
  /** 最近一次完整取到的数据 */
  good?: Pulse;
};

// 开发时改代码会重新载入模块，缓存挂在 globalThis 上才留得住，不至于很快用完额度
const store: Store = ((globalThis as { __folioPulse?: Store }).__folioPulse ??=
  {});

const saved = (store.saved ??= new Map());

function headers(etag?: string) {
  const token =
    typeof process !== 'undefined' ? process.env.GITHUB_TOKEN : undefined;
  return {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'molis-ai-site',
    ...(token ? { Authorization: `Bearer ${token}` } : null),
    ...(etag ? { 'If-None-Match': etag } : null),
  };
}

/** 取一个地址：内容没变（304）时用上一次的；settled 毫秒内取过的直接用 */
async function get(
  url: string,
  settled = 0,
): Promise<{ body: unknown; link: string | null }> {
  const last = saved.get(url);
  if (last && Date.now() - last.at < settled) return last;
  const response = await fetch(url, {
    headers: headers(last?.etag),
    signal: AbortSignal.timeout(4000),
  });
  if (response.status === 304 && last) {
    last.at = Date.now();
    return last;
  }
  if (!response.ok) throw new Error(`GitHub ${response.status}`);
  const body = (await response.json()) as unknown;
  const link = response.headers.get('link');
  const etag = response.headers.get('etag');
  if (etag) saved.set(url, { etag, link, body, at: Date.now() });
  return { body, link };
}

/** 一个时间段里的提交数：每页一条，最后一页的页码就是条数 */
async function countBetween(since: number, until?: number) {
  // 有 until 的是过去的某一天，一天里几乎不变
  const params = new URLSearchParams({
    since: new Date(since).toISOString(),
    per_page: '1',
  });
  if (until) params.set('until', new Date(until).toISOString());
  const { body, link } = await get(
    `${API}/commits?${params}`,
    until ? SETTLED : 0,
  );
  const last = link?.match(/[?&]page=(\d+)>;\s*rel="last"/);
  if (last) return Number(last[1]);
  if (!Array.isArray(body)) throw new Error('unexpected');
  return body.length;
}

async function readDays(now: number): Promise<PulseDay[]> {
  // 北京时间今天零点
  const today = Math.floor((now + CST) / DAY) * DAY - CST;
  const starts = Array.from({ length: 7 }, (_, i) => today - (6 - i) * DAY);
  const counts = await Promise.all(
    starts.map((start, i) =>
      countBetween(start, i === 6 ? undefined : start + DAY),
    ),
  );
  return starts.map((start, i) => ({
    date: new Date(start + CST).toISOString().slice(0, 10),
    count: counts[i],
  }));
}

type Commit = {
  html_url: string;
  parents: unknown[];
  commit: { message: string; committer: { date: string } };
};

async function readLast(): Promise<Pulse['last']> {
  const list = (await get(`${API}/commits?per_page=10`)).body as Commit[];
  const commit = list.find((item) => item.parents.length < 2) ?? list[0];
  if (!commit) return null;
  return {
    at: commit.commit.committer.date,
    title: commit.commit.message.split('\n')[0].trim(),
    url: commit.html_url,
  };
}

type Runs = {
  workflow_runs: {
    status: string;
    conclusion: string | null;
    updated_at: string;
    html_url: string;
  }[];
};

async function readBuild(): Promise<Pulse['build']> {
  const { workflow_runs: runs } = (
    await get(`${API}/actions/runs?branch=main&per_page=1`)
  ).body as Runs;
  const run = runs?.[0];
  if (!run) return null;
  return {
    at: run.updated_at,
    status: run.status,
    conclusion: run.conclusion,
    url: run.html_url,
  };
}

async function read(): Promise<Pulse | null> {
  const [days, last, build] = await Promise.allSettled([
    readDays(Date.now()),
    readLast(),
    readBuild(),
  ]);
  const pulse: Pulse = {
    fetchedAt: new Date().toISOString(),
    days: days.status === 'fulfilled' ? days.value : null,
    week:
      days.status === 'fulfilled'
        ? days.value.reduce((sum, day) => sum + day.count, 0)
        : null,
    last: last.status === 'fulfilled' ? last.value : null,
    build: build.status === 'fulfilled' ? build.value : null,
  };
  const complete = Boolean(pulse.days && pulse.last && pulse.build);
  store.ttl = complete ? TTL : RETRY;
  if (complete) {
    store.good = pulse;
    return pulse;
  }
  // 这次没取全：两小时内取全过的那一份更完整，就用那一份（页面写着截至几点）
  const good = store.good;
  if (good && Date.now() - Date.parse(good.fetchedAt) < STALE) return good;
  return pulse.days || pulse.last || pulse.build ? pulse : null;
}

/** 取一次仓库的状态；同一时刻的多处调用共用一个请求 */
export function getPulse(): Promise<Pulse | null> {
  const now = Date.now();
  if (store.at !== undefined && now - store.at < (store.ttl ?? TTL))
    return Promise.resolve(store.value ?? null);
  store.pending ??= read()
    .catch(() => {
      store.ttl = RETRY;
      return null as Pulse | null;
    })
    .then((value) => {
      store.value = value;
      store.at = Date.now();
      store.pending = undefined;
      return value;
    });
  return store.pending;
}
