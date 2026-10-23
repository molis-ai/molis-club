'use client';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { ArrowDown } from 'lucide-react';
import {
  enterprise,
  type QuestionId,
  type StationId,
} from '../../../content/site/enterprise';
import { ContactForm } from '../../_site/contact-form';
import type { Vars } from '../../_site/ui';
import { Symptom } from './symptoms';

// 企业合作页的一条线：在「你们卡在哪」选一张纸条，页面围着这个选择回应——
// 纸条下面回一句「你们希望……」和建议起点，路线上那一站标出「建议起点」，末尾的表单替你写好第一句；
// 主线上往下读时，选过的那张纸条留在左下角（Carry）。
// 鼠标停在纸条上就预览它的回应，点一下才算选定（选定的才传给路线和表单）。
// 纸条不靠 JS 也能用：每张是原生单选框，回应用 :has() 跟着显出来（enterprise.css）；
// JS 负责悬停预览、把选择传给路线和表单，以及「看看这条路怎么走」在钉住的路线里滚到对的位置。

const { hook, questions, path, talk } = enterprise;

type Pick = {
  pick: QuestionId | null;
  setPick: (id: QuestionId | null) => void;
  /** 路线登记自己的「滚到某一站」；没登记时退回普通的锚点跳转 */
  register: (fn: ((id: StationId) => void) | null) => void;
  goto: (id: StationId) => void;
};

const PickContext = createContext<Pick | null>(null);

export function usePick() {
  return useContext(PickContext);
}

export function PickProvider({ children }: { children: ReactNode }) {
  const [pick, setPick] = useState<QuestionId | null>(null);
  const route = useRef<((id: StationId) => void) | null>(null);
  const register = useCallback((fn: ((id: StationId) => void) | null) => {
    route.current = fn;
  }, []);
  const goto = useCallback((id: StationId) => {
    if (route.current) route.current(id);
    else
      document
        .getElementById(`station-${id}`)
        ?.scrollIntoView({ block: 'start' });
  }, []);
  const value = useMemo(
    () => ({ pick, setPick, register, goto }),
    [pick, register, goto],
  );
  return <PickContext value={value}>{children}</PickContext>;
}

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * 五张纸条 + 回应。鼠标停在一张上就显出它的回应（预览），点一下选定；
 * 鼠标往下移到回应上，预览留着（能点「看看这条路怎么走」，点了也算选定）；
 * 离开纸条和回应这一整块，回到选定的那张，没选过就回到那句提示。触屏上点一下就是选定。
 * 回应叠在同一格里，高度按最长的那条留好，换来换去下面的内容不跳。
 */
export function Slips({ lean = false }: { lean?: boolean }) {
  const context = usePick();
  const pick = context?.pick ?? null;
  const [hover, setHover] = useState<QuestionId | null>(null);
  const shown = hover ?? pick;
  const advice = pick ? path.advice[pick] : null;

  const jump = (event: MouseEvent<HTMLAnchorElement>, id: StationId) => {
    if (!context) return;
    event.preventDefault();
    context.goto(id);
  };

  return (
    <form
      className="m-ent-pick"
      data-show={shown ?? undefined}
      onSubmit={(event) => event.preventDefault()}
      onReset={() => context?.setPick(null)}
      onPointerLeave={() => setHover(null)}
    >
      <fieldset className="m-ent-slips" data-any={shown ? '' : undefined}>
        <legend className="sr-only">{hook.ask}</legend>
        {questions.items.map((question, index) => (
          <label
            key={question.id}
            className="m-ent-slip"
            data-reveal
            data-on={shown === question.id || undefined}
            data-picked={pick === question.id || undefined}
            style={{ '--i': index, '--delay': `${index * 70}ms` } as Vars}
            onPointerEnter={(event) => {
              if (event.pointerType === 'mouse') setHover(question.id);
            }}
          >
            <input
              type="radio"
              name="ent-question"
              id={`pick-${question.id}`}
              value={question.id}
              checked={context ? pick === question.id : undefined}
              onChange={() => context?.setPick(question.id)}
            />
            <Symptom
              id={question.id}
              words={question.words}
              axes={question.axes}
            />
            <span className="m-ent-slip-text">
              <span className="m-ent-slip-no num" lang="en" aria-hidden="true">
                {pad(index + 1)}
              </span>
              <span className="m-ent-slip-name">{question.short}</span>
            </span>
          </label>
        ))}
      </fieldset>

      <div className="m-ent-replies" data-lean={lean || undefined}>
        <p className="m-ent-reply-idle">{hook.idle}</p>
        {questions.items.map((question) => {
          const item = path.advice[question.id];
          // 样张（D1，lean）：选过的只带进末尾的表单，不配对路线（负责人 2026-10-19：照原文）。
          // 路线就在下面一屏，不再放「看看这条路怎么走」；「都看看」也去掉了，换一张直接点另一张（负责人 2026-10-19）。
          // 回应不再重复纸条上的问题（2026-10-22）：回 5.1 第二段那句「你们希望……」，
          // 再说清选了有什么用——停着时是「点一下，带进最后的表单」，选定后是「已写进最后的表单」和一条去表单的近路
          if (lean) {
            const picked = pick === question.id;
            return (
              <div
                key={question.id}
                className="m-ent-reply"
                data-for={question.id}
                data-lean
              >
                <p className="m-ent-reply-wish">{question.wish}</p>
                <p
                  className="m-ent-reply-carry"
                  data-done={picked || undefined}
                >
                  {picked ? (
                    <>
                      <span className="m-ent-reply-carried">
                        {hook.carried}
                      </span>
                      <a className="m-link" href="#talk" data-dir="down">
                        {hook.go}
                        <ArrowDown size={13} aria-hidden="true" />
                      </a>
                    </>
                  ) : (
                    hook.carry
                  )}
                </p>
              </div>
            );
          }
          return (
            <div
              key={question.id}
              className="m-ent-reply"
              data-for={question.id}
            >
              <div className="m-ent-reply-heard">
                <p className="m-ent-reply-title">{question.title}</p>
                <p className="m-ent-reply-wish">{question.wish}</p>
              </div>
              <div className="m-ent-reply-start">
                <p className="m-ent-reply-label">{hook.start}</p>
                <p className="m-ent-reply-station">
                  {path.stations[item.start].name}
                  {item.next ? (
                    <>
                      <span className="m-ent-reply-then">{hook.next}</span>
                      {path.stations[item.next].name}
                    </>
                  ) : null}
                </p>
                <p className="m-ent-reply-why">
                  {item.reason}
                  {hook.caveat}
                </p>
                <p className="m-actions">
                  <a
                    className="m-link"
                    href={`#station-${item.start}`}
                    data-dir="down"
                    onClick={(event) => {
                      context?.setPick(question.id);
                      jump(event, item.start);
                    }}
                  >
                    {hook.jump}
                    <ArrowDown size={13} aria-hidden="true" />
                  </a>
                  <button type="reset" className="m-link">
                    {hook.reset}
                  </button>
                </p>
              </div>
            </div>
          );
        })}
        {/* 读屏：选定了什么，念一遍回应（画面上的那几块不是 live 区，免得重复） */}
        <p className="sr-only" aria-live="polite">
          {advice && pick && lean
            ? `${questions.items.find((item) => item.id === pick)?.wish ?? ''}${hook.carried}。`
            : advice && pick
              ? `${questions.items.find((item) => item.id === pick)?.wish ?? ''}${hook.start}：${path.stations[advice.start].name}${
                  advice.next
                    ? `，${hook.next}：${path.stations[advice.next].name}`
                    : ''
                }。${advice.reason}${hook.caveat}`
              : ''}
        </p>
      </div>
    </form>
  );
}

/** 读到这几节时，选过的纸条留在左下角（钉住的路线、「为什么我们可以」、内部探索） */
const ALONG = ['path', 'people', 'explore'];
/** 纸条在屏幕底边占的高（line.css 里钉住的两节底下也留这么多） */
const ROOM = 64;

/** 「为什么我们可以」钉住时一屏放不下（矮屏），左下角的收尾会被纸条盖住：这一节里先收起 */
function crowded(section: Element) {
  const stick = section.querySelector('.m-why-stick');
  const end = section.querySelector('.m-why-end');
  if (!section.hasAttribute('data-live') || !stick || !end) return false;
  const bottom =
    end.getBoundingClientRect().bottom - stick.getBoundingClientRect().top;
  return bottom > window.innerHeight - ROOM;
}

/**
 * 选过的纸条一路跟着（负责人 2026-10-24）：选定以后往下读，左下角留一张小纸条——
 * 选的是哪一张、已写进最后的表单、一条去表单的近路。只回指表单，不配对路线（负责人 2026-10-19：原文没有这层对应）。
 * 屏幕底边落在上面那几节里才显出来；回到「你们卡在哪」、满幅那张图上、表单进屏时收起。没选过就没有。
 */
export function Carry() {
  const context = usePick();
  const pick = context?.pick ?? null;
  const [along, setAlong] = useState(false);

  useEffect(() => {
    const sections = ALONG.flatMap((id) => {
      const section = document.getElementById(id);
      return section ? [section] : [];
    });
    const inside = new Set<Element>();
    const settle = () =>
      setAlong(
        Array.from(inside).some(
          (section) => section.id !== 'people' || !crowded(section),
        ),
      );
    // 只看屏幕最底下那一条：纸条就停在那里
    const watch = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) inside.add(entry.target);
          else inside.delete(entry.target);
        }
        settle();
      },
      { rootMargin: '-88% 0px 0px 0px' },
    );
    for (const section of sections) watch.observe(section);
    window.addEventListener('resize', settle);
    return () => {
      watch.disconnect();
      window.removeEventListener('resize', settle);
    };
  }, []);

  const question = pick
    ? questions.items.find((item) => item.id === pick)
    : undefined;
  if (!question) return null;
  return (
    <p className="m-ent-carry" data-on={along || undefined}>
      <span className="m-ent-carry-pick">{question.short}</span>
      <span className="m-ent-carry-done">{hook.carried}</span>
      <a className="m-ent-carry-go" href="#talk">
        {hook.go}
        <ArrowDown size={13} aria-hidden="true" />
      </a>
    </p>
  );
}

/** 末尾的表单：来意固定为企业合作；选过的问题替访客写成第一句 */
export function EnterpriseForm() {
  const context = usePick();
  const pick = context?.pick ?? null;
  const question = pick
    ? questions.items.find((item) => item.id === pick)
    : undefined;
  return (
    <>
      {question ? <p className="m-ent-seeded">{talk.seeded}</p> : null}
      <ContactForm
        fixed="enterprise"
        titleAs="h3"
        idPrefix="ent"
        seed={question ? talk.seed(question.title) : undefined}
      />
    </>
  );
}
