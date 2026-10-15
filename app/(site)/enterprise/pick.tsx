'use client';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from 'react';
import {
  enterprise,
  type QuestionId,
  type StationId,
} from '../../../content/site/enterprise';
import { ContactForm } from '../../_site/contact-form';

// 企业合作页的勾子：「你们卡在哪？」选一个问题，首屏的四站小路线亮出建议起点；
// 同一个选择也点亮下面的合作路线，并带进末尾的表单。
// 首屏那一块不靠 JS 也能用：选项是原生单选框，小路线与建议用 :has() 跟着亮（enterprise.css）；
// JS 只负责把选择传给路线和表单，以及「看这一站」在钉住的路线里滚到对的位置。

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
const stationIds = Object.keys(path.stations) as StationId[];

/** 首屏：五个问题（单选）+ 四站小路线 + 建议 */
export function HookPicker() {
  const context = usePick();
  const pick = context?.pick ?? null;
  const advice = pick ? path.advice[pick] : null;

  const jump = (event: MouseEvent<HTMLAnchorElement>, id: StationId) => {
    if (!context) return;
    event.preventDefault();
    context.goto(id);
  };

  return (
    <form
      className="m-ent-hook"
      onSubmit={(event) => event.preventDefault()}
      onReset={() => context?.setPick(null)}
    >
      <fieldset className="m-ent-hook-set">
        <legend className="m-ent-hook-ask">
          <span>{hook.ask}</span>
        </legend>
        <div className="m-ent-hook-list">
          {questions.items.map((question, index) => (
            <label key={question.id} className="m-ent-chip">
              <input
                type="radio"
                name="ent-question"
                id={`pick-${question.id}`}
                value={question.id}
                checked={context ? pick === question.id : undefined}
                onChange={() => context?.setPick(question.id)}
              />
              <span>
                <span className="m-ent-chip-no num" aria-hidden="true">
                  {pad(index + 1)}
                </span>
                {question.short}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <ol className="m-ent-mini" aria-label={path.title}>
        {stationIds.map((id) => {
          const station = path.stations[id];
          return (
            <li key={id} className="m-ent-mini-stop" data-id={id}>
              <span className="m-ent-mini-dot" aria-hidden="true" />
              <span className="m-ent-mini-where">{station.stop}</span>
              <span className="m-ent-mini-name">{station.name}</span>
              <span className="m-ent-mini-flag" data-flag="start">
                {hook.start}
              </span>
              <span className="m-ent-mini-flag" data-flag="next">
                {hook.next}
              </span>
            </li>
          );
        })}
      </ol>

      <div className="m-ent-advice">
        <p className="m-ent-advice-idle">
          {hook.idle}
          <span className="m-note">{hook.note}</span>
        </p>
        {questions.items.map((question) => {
          const item = path.advice[question.id];
          return (
            <div
              key={question.id}
              className="m-ent-advice-item"
              data-for={question.id}
            >
              <p className="m-ent-advice-line">
                <span className="m-ent-advice-label">{hook.start}</span>
                <b>{path.stations[item.start].name}</b>
                {item.next ? (
                  <>
                    <span className="m-ent-advice-label">{hook.next}</span>
                    <b>{path.stations[item.next].name}</b>
                  </>
                ) : null}
              </p>
              <p className="m-ent-advice-why">
                {item.reason}
                {hook.caveat}
              </p>
              <p className="m-actions">
                <a
                  className="m-link"
                  href={`#station-${item.start}`}
                  data-dir="down"
                  onClick={(event) => jump(event, item.start)}
                >
                  {hook.jump}
                </a>
                <button type="reset" className="m-link">
                  {hook.reset}
                </button>
              </p>
            </div>
          );
        })}
        {/* 读屏：选了什么，念一遍建议（画面上的那几块不是 live 区，免得重复） */}
        <p className="sr-only" aria-live="polite">
          {advice
            ? `${hook.start}：${path.stations[advice.start].name}${
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

/**
 * 症状卡上的「从这里开始」：没有 JS 时是回到首屏那一题的链接（在那里选）；
 * 有 JS 时就地选中这一题，直接滚到路线上的建议起点。
 */
export function StartFrom({ id }: { id: QuestionId }) {
  const context = usePick();
  return (
    <a
      href={`#pick-${id}`}
      className="m-link m-ent-start"
      data-dir="right"
      onClick={(event) => {
        if (!context) return;
        event.preventDefault();
        context.setPick(id);
        context.goto(path.advice[id].start);
      }}
    >
      {questions.start}
    </a>
  );
}

/** 末尾的表单：来意固定为企业合作；首屏选过的问题带进「想说的事」 */
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
