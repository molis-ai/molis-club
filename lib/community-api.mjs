const headers = {
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
};
const json = (body, status = 200) => Response.json(body, { status, headers });
const validString = (v, min, max) =>
  typeof v === 'string' && v.trim().length >= min && v.trim().length <= max;
const validId = (v) =>
  typeof v === 'string' &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    v,
  );
async function payload(request) {
  if (request.headers.get('origin') !== new URL(request.url).origin)
    throw new Error('origin');
  if (!request.headers.get('content-type')?.startsWith('application/json'))
    throw new Error('content');
  const text = await request.text();
  if (text.length > 10000) throw new Error('size');
  const data = JSON.parse(text);
  if (!data || typeof data !== 'object' || Array.isArray(data))
    throw new Error('data');
  return data;
}
export async function listNotes(request, db, slugs) {
  const work = new URL(request.url).searchParams.get('work');
  if (!slugs.includes(work)) return json({ error: '找不到这个作品。' }, 400);
  try {
    const r = await db
      .prepare(
        'SELECT id, work, name, body, user_id IS NOT NULL AS registered, created_at AS createdAt FROM notes WHERE work = ? ORDER BY created_at DESC, id DESC LIMIT 50',
      )
      .bind(work)
      .all();
    return json({ notes: r.results });
  } catch {
    return json({ error: '留言暂时没能加载，请稍后重试。' }, 503);
  }
}
export async function saveNote(request, db, slugs, user, beforeSave) {
  if (!user) return json({ error: '请先登录，再留下反馈。' }, 401);
  let d;
  try {
    d = await payload(request);
  } catch {
    return json({ error: '提交格式有误，请刷新后重试。' }, 400);
  }
  if (
    !validId(d.id) ||
    !slugs.includes(d.work) ||
    !validString(d.body, 5, 1200)
  )
    return json({ error: '请填写具体想法（5–1200 字）。' }, 400);
  await beforeSave?.();
  try {
    const createdAt = new Date().toISOString();
    await db
      .prepare(
        'INSERT INTO notes (id, work, name, body, created_at, user_id) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO NOTHING',
      )
      .bind(d.id, d.work, user.name, d.body.trim(), createdAt, user.id)
      .run();
    const note = await db
      .prepare(
        'SELECT id, work, name, body, user_id AS userId, user_id IS NOT NULL AS registered, created_at AS createdAt FROM notes WHERE id = ?',
      )
      .bind(d.id)
      .first();
    if (
      note.work !== d.work ||
      note.userId !== user.id ||
      note.body !== d.body.trim()
    )
      return json({ error: '这次提交与先前内容不同，请刷新后重试。' }, 409);
    delete note.userId;
    return json({ note }, 201);
  } catch {
    return json({ error: '这次没能保存，你写的内容还在。请稍后重试。' }, 503);
  }
}
export async function saveApplication(request, db) {
  let d;
  try {
    d = await payload(request);
  } catch {
    return json({ error: '提交格式有误，请刷新后重试。' }, 400);
  }
  if (
    !validString(d.name, 1, 40) ||
    !validString(d.email, 3, 254) ||
    !/^\S+@[^\s@]+\.[^\s@]+$/.test(d.email.trim()) ||
    !['创造者', '早期体验者', '开发者', '企业合作'].includes(d.role) ||
    !validString(d.idea, 5, 1200) ||
    d.consent !== true ||
    (d.id !== undefined && !validId(d.id))
  )
    return json(
      { error: '请检查称呼、邮箱和想法，并同意将这些资料交给团队。' },
      400,
    );
  // 一次提交一行：表单打开时生成 id，同一次提交重试不会多存；旧客户端不带 id 时由这里生成。
  // topic 只记从哪个入口来，地址栏里不规范的值直接不记，不拦下这次提交。
  const topic =
    typeof d.topic === 'string' && /^[a-z0-9][a-z0-9-]{0,39}$/.test(d.topic)
      ? d.topic
      : null;
  try {
    await db
      .prepare(
        'INSERT INTO applications (id, email, name, role, idea, topic, allow_display, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO NOTHING',
      )
      .bind(
        d.id ?? crypto.randomUUID(),
        d.email.trim().toLowerCase(),
        d.name.trim(),
        d.role,
        d.idea.trim(),
        topic,
        d.allowDisplay === true ? 1 : 0,
        new Date().toISOString(),
      )
      .run();
    return json({ status: 'received', message: '你的留言已收下。' }, 201);
  } catch {
    return json({ error: '申请暂时没能保存，内容还在。请稍后再试。' }, 503);
  }
}
