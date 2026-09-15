export type ArtistSkill = {
  slug: string;
  name: string;
  english: string;
  description: string;
  medium: string;
  image?: string;
  width?: number;
  height?: number;
  imageAlt?: string;
  method: { title: string; body: string }[];
  use: string;
  prompt: string;
};
export const artistSkills: ArtistSkill[] = [
  {
    slug: 'monet-impressionism',
    name: '莫奈 · 光与色',
    english: 'Claude Monet',
    description: '让同一时刻的空气、光和颜色变化，在相邻的笔触之间相遇。',
    medium: '印象派绘画',
    image: '/images/artists/monet-pond.jpg',
    width: 1440,
    height: 960,
    imageAlt: '雨后池塘、垂柳、睡莲与白椅的莫奈风格 AI 创作试样',
    method: [
      {
        title: '先决定哪一刻的光',
        body: '从天气、季节和受光方向出发，让亮部、阴影与反射共享一种环境。',
      },
      {
        title: '用笔触构造景物',
        body: '水面的横向色带、植被的簇状笔触、建筑的稳定方向，各自承担形体与空间。',
      },
      {
        title: '保留可读的关系',
        body: '近看有绘画动作，退远仍能辨认景物；根据题材区分早期风景与晚期睡莲。',
      },
    ],
    use: '适合风景、城市光影、水园与照片转绘画。可以从简短主题开始，也可以带上需要保留人物、建筑或构图的源图。',
    prompt:
      '使用 $monet-impressionism 创作一幅雨后的池塘。午后的光从垂柳间落下来，岸边有一把白色木椅，水面映出天空和树叶。采用可辨认景物的风景方向，保留交织的笔触与有色阴影。横幅，无文字。请交付成图和实际提示词。',
  },
  {
    slug: 'dali-surrealism',
    name: '达利 · 梦的形状',
    english: 'Salvador Dalí',
    description: '改变物体的形态与关系，让荒诞拥有可以看见的结构、重量和空间。',
    medium: '超现实绘画',
    image: '/images/artists/dali-forest.jpg',
    width: 1280,
    height: 720,
    imageAlt: '湖边树木转化为柔软形体、倒影与荒漠交织的达利风格 AI 创作试样',
    method: [
      {
        title: '找到真正的变形',
        body: '从软化、双重图像、共享轮廓或尺度反差中，选择适合主题的视觉机制。',
      },
      {
        title: '让荒诞有体积',
        body: '用受力、接触、投影和雕塑式明暗，让转化后的形体仍有物质感。',
      },
      {
        title: '为梦留下空间',
        body: '安排疏密、远近与主次；精细描绘服务于关键关系，不把奇异物件堆在一起。',
      },
    ],
    use: '适合观念绘画、梦境场景与具有象征关系的题材。指定主体、数量与关系后，Skill 会围绕它们组织变形。',
    prompt:
      '使用 $dali-surrealism 创作一幅关于「记忆里的森林」的超现实绘画。一棵树的树冠像有厚度的柔软织物，垂向湖面；倒影保留树木原本的形状。让两种形态共享结构，周围是开阔而安静的空间。保留雕塑式体积和清楚的投影。横幅，无文字。请交付成图和实际提示词。',
  },
  {
    slug: 'wes-anderson-poster',
    name: '韦斯 · 画面里的秩序',
    english: 'Wes Anderson',
    description:
      '用端正的机位、电影色板与经过编排的人物道具，导演一个有情境的小世界。',
    medium: '电影场景与海报',
    image: '/images/artists/wes-lake.jpg',
    width: 960,
    height: 1440,
    imageAlt:
      '林中泊主题海报：两人坐在湖面小船上阅读地图的韦斯风格 AI 创作试样',
    method: [
      {
        title: '先导演，再拍摄',
        body: '决定人物在什么地方、做什么、看向哪里。秩序与情绪来自场面关系。',
      },
      {
        title: '让颜色落在实体上',
        body: '把电影色板分配给墙面、服装、器物与环境，保留真实材料和统一影调。',
      },
      {
        title: '把标题当作设计',
        body: '海报的字形、阅读路径与画面共同构图；场景创作也可以选择完全无字。',
      },
    ],
    use: '适合主题海报、场景肖像、建筑与多人叙事。默认海报为 2:3 竖幅，电影场景可以无字；支持用户指定语言与画幅。',
    prompt:
      '使用 $wes-anderson-poster 创作一张关于「没有时刻表的航行」的海报。两位旅客坐在森林湖泊中的小船上，郑重地研究一张地图。端正机位，复古服装，让船、人物和水面形成有秩序的关系。采用适合这个场景的电影色板。2:3 竖版，中文主标题「林中泊」，副标题「一次没有时刻表的航行」。请交付成图和实际提示词。',
  },
  {
    slug: 'art-style-skill-builder',
    name: '构建你自己的风格 Skill',
    english: 'Art style skill builder',
    description:
      '从原作观察、可信来源与图像反馈中，建立可以独立使用和继续修正的艺术风格 Skill。',
    medium: '风格研究与构建',
    method: [
      {
        title: '观察与研究',
        body: '从艺术家的原作、时期与可信来源出发，理解构图、色彩、材料和形态。',
      },
      {
        title: '写成创作方法',
        body: '把研究结论转成具体、可执行的选择，而不是一串风格形容词。',
      },
      {
        title: '用新题材验证',
        body: '比较实际成图与目标，记录成立的关系和不足，再修改 Skill。',
      },
    ],
    use: '适合希望把风格研究沉淀成工具的人。提供艺术家、目标媒介与研究范围；可以先研究，也可以在有图像工具时制作试样。',
    prompt:
      '使用 $art-style-skill-builder，为我研究并建立一个独立的艺术风格 Skill。\n艺术家：[填写艺术家]\n目标时期或作品范围：[填写范围]\n希望创作的媒介与题材：[填写用途]\n先从可信原作和资料建立视觉方法，区分来源事实与制作选择，再用一个新题材验证。保留来源、实际提示与评审记录。',
  },
];
