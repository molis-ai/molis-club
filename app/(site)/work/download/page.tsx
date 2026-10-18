import { pageMetadata } from '../../../../lib/site';
import { WORK_GITHUB } from '../../../../content/site/products';
import { workDownload } from '../../../../content/site/work';
import { contactHref, productHref, WORK_DOWNLOAD } from '../../../_site/routes';
import { Btn, More, Note, Phrases, type Vars } from '../../../_site/ui';
import './download.css';

const copy = workDownload;

export const metadata = pageMetadata(copy.title, copy.lead, WORK_DOWNLOAD);

// 在 Mac 上用 Molis Work：还没到给人下载的时候，只留一个口子。
// 新版标「开发中」，按钮是「报名首批试用」；能下载的时候，这张卡换成安装包。
// 不列任何内部包，不写「免费」。版式跟隐私页一样：左两栏放小标题，正文从第 3 栏起。
export default function WorkDownloadPage() {
  return (
    <article className="wdl">
      <header className="m-wrap m-top wdl-head">
        <p className="m-head-meta m-rise">
          <span className="m-kicker">{copy.kicker}</span>
        </p>
        <h1 className="m-rise" style={{ '--delay': '80ms' } as Vars}>
          <Phrases text={copy.title} />
        </h1>
        <p className="wdl-lead m-rise" style={{ '--delay': '160ms' } as Vars}>
          {copy.lead}
        </p>
        <p className="wdl-meta m-rise" style={{ '--delay': '220ms' } as Vars}>
          {copy.meta}
        </p>
      </header>

      <div className="m-wrap wdl-body">
        <section className="wdl-card wdl-next" aria-labelledby="wdl-next" data-reveal>
          <div className="wdl-next-text">
            <Note>{copy.next.label}</Note>
            <h2 id="wdl-next">{copy.next.title}</h2>
            <p>{copy.next.text}</p>
          </div>
          <div className="wdl-next-go">
            <Btn href={contactHref('work-trial')}>{copy.next.go}</Btn>
            <p className="wdl-note">{copy.next.note}</p>
          </div>
        </section>

        <p className="wdl-code" data-reveal>
          {copy.code.text}
          <More href={WORK_GITHUB} external>
            {copy.code.link}
          </More>
        </p>

        <section className="wdl-sec" aria-labelledby="wdl-faq" data-reveal>
          <h2 id="wdl-faq" className="wdl-sec-title">
            {copy.faq.title}
          </h2>
          <div className="wdl-sec-body wdl-faq">
            {copy.faq.items.map((item) => (
              <details key={item.q}>
                <summary>{item.q}</summary>
                <div className="wdl-faq-a">
                  {item.a.map((text) => (
                    <p key={text}>{text}</p>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </section>

        <nav className="wdl-back m-actions" aria-label="去处">
          <More href={productHref.work}>{copy.back}</More>
        </nav>
      </div>
    </article>
  );
}
