// 两种语言的文案登记在这里：copy[locale].<模块>.<导出名>。
// 中文模块是 content/site/<名字>.ts（底稿原句，tests/site-copy.test.mjs 逐句核对）；
// 英文模块是 content/site/en/<名字>.ts，导出同名、同形状的对象（类型从中文模块引，少一项就报错）。
// 新翻一个模块：建英文文件，在下面两边各登记一行。做法见 docs/i18n.md。
import type { Locale } from '../../app/_site/locale';
import * as zhHome from './home';
import * as zhNav from './nav';
import * as zhNotFound from './not-found';
import * as zhProducts from './products';
import * as zhScenes from './scenes';
import * as zhStudio from './studio';
import * as zhUi from './ui';
import * as zhWork from './work';
import * as enHome from './en/home';
import * as enNav from './en/nav';
import * as enNotFound from './en/not-found';
import * as enProducts from './en/products';
import * as enScenes from './en/scenes';
import * as enStudio from './en/studio';
import * as enUi from './en/ui';
import * as enWork from './en/work';

export const copy = {
  zh: {
    home: zhHome,
    nav: zhNav,
    notFound: zhNotFound,
    products: zhProducts,
    scenes: zhScenes,
    studio: zhStudio,
    ui: zhUi,
    work: zhWork,
  },
  en: {
    home: enHome,
    nav: enNav,
    notFound: enNotFound,
    products: enProducts,
    scenes: enScenes,
    studio: enStudio,
    ui: enUi,
    work: enWork,
  },
} satisfies Record<Locale, Record<string, object>>;

