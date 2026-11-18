# Club 登录与环境配置

本仓库读取 `config/<env>.properties` 和 `secrets/<env>.properties`。从 `secrets.example/` 复制对应模板，在忽略的文件中设置本环境稳定的 `MOLIS_CLUB_ACCOUNT_KEY`。使用 32 字节随机值的无填充 base64url 编码。邮件、短信、Google 和 GitHub 的供应商配置由 Auth 持有。

| 环境 | Club | Auth | D1 |
| --- | --- | --- | --- |
| dev | `http://127.0.0.1:3000` | `http://127.0.0.1:8787` | `.wrangler/state` |
| test，本地 | `http://127.0.0.1:3000` | `https://auth.test.molis.ai` | 测试 D1 |
| test，远程 | `https://test.molis.ai` | `https://auth.test.molis.ai` | 测试 D1 |
| prod | 由平台核对正式地址及登记 | 正式 Auth | 正式 D1 |

每个访问入口使用自己的已登记客户端，允许来源为表中的 Club origin，回调是该 origin 的 `/account/callback`。登录成功回到发起页面。Google 和 GitHub 回调需要登记在 Auth 的供应商应用中。

新 dev 库的显式准备步骤如下。先核对目标是当前检出的本地库。如已有数据，先核对已有迁移记录。

```sh
node --input-type=module -e 'import {mkdirSync,writeFileSync} from "node:fs"; import {clubEnvironment} from "./scripts/club-environment.mjs"; const {worker}=clubEnvironment("dev",true); worker.d1_databases[0].migrations_dir="../drizzle"; mkdirSync(".wrangler",{recursive:true}); writeFileSync(".wrangler/dev-db.json",JSON.stringify(worker));'
npx wrangler d1 migrations apply DB --config .wrangler/dev-db.json --local --persist-to .wrangler/state
npm start -- --env dev
```

测试部署构建使用 `npm run deploy -- --env test --dry-run`。当域名、D1 和客户端登记都已就绪，部署人员可以去掉 `--dry-run`。正式部署将 `--env` 设为 `prod`，先核实既有正式站点和 Auth 登记。保留部署前的 Worker 版本、路由和登记记录供恢复。

`config/platform-targets.json` 是部署目标的独立登记。启动和部署以该文件核对 properties 中的账户、Worker、域名和 D1，部署器还会核对构建产物使用同一目标。正式 Club 域名核准后，在目标登记与 properties 填入同一正式来源，并核对对应的账户客户端。
