# molis-club：社区网站整理与统一命名

## 目标与现状
统一项目、GitHub 仓库和本地路径为 `molis-club`，将当前社区网站作为唯一实现。起点为已提交的现行网站与多轮旧静态原型并存；应用在 community/，package 名仍为 sites-project；模板 components/ui、hooks 和 utils 未被应用引用。当前 GitHub 是 molis-ai/roast-pear，用户明确授权重命名，保留历史。

## 范围与边界
- 现行应用提升到仓库根，删除旧 design/、homepages/、过时商业/技术方案、多轮设计缓存、被替代的需求书，以及未使用的 UI 模板及其直接依赖。
- 页面、包名、文档、元数据与认证应用名统一为 molis-club；定位为连接 AI 创作者、作品与使用者的社区网站。沿用原 Logo、暖纸手绘视觉、Products/Solutions 分类与原文。
- 保留三张产品线配图、作品/方案原生展开、产品浮动入口及滚动动效。保留已有账号、留言、联系功能，不把论坛、发布后台或 OAuth 配置描述为已完成。
- 保留 .git 全部历史、数据库迁移、.openai/hosting.json 项目绑定、本地 .dev.vars 与 .wrangler/state 数据；不删除账号/生产数据、不改变网站访问权限。
- GitHub 重命名为 molis-ai/molis-club；本地目录迁至 /Users/yijunwang/code/molis-club。更新 origin。网站显示名与 slug 同步为 molis-club，认证 base URL 与 canonical 跟随实际新 URL，继续私有发布。

## 实现与依赖
根目录为 React / Vinext / Workers / D1 / Better Auth 应用；app 为页面/API，content 为真实内容，lib 为认证与持久化规则，db/drizzle 为数据结构及迁移。docs 保留配置、部署、发现与产品分类说明；PRODUCT.md/DESIGN.md 为现行产品与设计事实。
只删除在入口调用链中无引用的模板，不对已使用模块做猜测性重构。旧设计从 Git 历史恢复，工作树不再留 archive 副本。数据库 binding 和迁移语义不随项目名字机械改写。

## 验收
1. 新目录能安装、检查、构建、启动；根目录即唯一应用，无旧社区子目录和旧原型。
2. 本地目录、package、GitHub 仓库和 origin 为 molis-club；Git 历史连续，GitHub 仍保持私有。
3. 现行源码/入口文档不含旧项目名或失效目录；原始文章与图像来源不做内容伪造。
4. 核心业务测试、真实本地 HTTP 认证/持久化及发现测试通过；页面配图、原生开合、卡片滚动/减少动态与移动显示验证。
5. 旧版页面和模板不再进入构建；当前私有站部署成功，OAuth 等待凭据、邮箱验证/找回、社区发布/治理后台仍为明确缺口。

## 验证命令
npm ci
npm run check
npm test
npm run build
npm run dev
npm run test:http

## 完成等级
可运行并部署的社区网站私有试用版本，不等于公开运营完整社区。目录重命名不升级功能承诺。

## 代码规范整理
规范检查发现旧表单事件类型、FormData直接字符串化、同步effect派生状态及模板专属图片规则。更新SubmitEvent类型、文本字段边界和语义化输出；OAuth错误从URL派生，留言重试状态由用户操作设置并按作品重新挂载。原生img继续服务已压缩的静态资源，仅关闭不适用于当前部署的Next图片优化规则。首页本身无客户端状态，移除多余的use client；交互仍由原生details/CSS和独立账号组件承担。

## 验收结果（2026-09-08）
- 通过：新目录 /Users/yijunwang/code/molis-club；GitHub molis-ai/molis-club 保持私有，origin已更新；包名、页面名称、元数据与文档一致。
- 通过：lint、check、8项业务测试、build，以及真实本地HTTP认证与发现验证。删除14个未引用的直接依赖，npm移除348个依赖包；原文、图片、数据库迁移与本地状态保留。
- 通过：1280/390px页面无横向溢出，手机首屏Products起点844px；卡片随滚动改变位置，减少动态下animation:none；原生展开支持键盘，收起后Tab跳过隐藏内容。OAuth错误提示及切注册后的清除已验证。
- 独立复核：ship，无Blocker/P1；六张截图覆盖桌面首屏/首组产品、手机首屏/首组产品/方案上半部/注册，不代表所有长页区域全面视觉验收。
- Codex侧栏项目名已为molis-club，但保存的项目路径仍指向旧目录；没有可调用的路径修改接口，且计算机操作工具不允许操作Codex自身。用户需在Codex重新关联新目录；真实文件路径与GitHub更名不受影响。
