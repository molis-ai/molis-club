# 12-写代码-厂商Agent平台

> 2026-10-16 本会话的调研代理原始报告（英文原文，未改动）。结论汇总见上一级的《同类调研》。下面先是交给它的任务，再是它的报告。

## 任务

```text
Read-only web research task (today is 2026-10-16). Use WebSearch and WebFetch (load them via ToolSearch "select:WebSearch,WebFetch"). Do NOT sign up, log in, submit forms, or download/run anything. Do not write any files. Return your findings as your final report text.

Goal: rigorous, current (2026) competitive facts about vendor coding-agent platforms' multi-agent / background-agent / task-management features, for a developer audience who use Claude Code / Codex daily. Every fact needs a source URL; note dates (doc dates, changelog entries, release dates). Prefer official docs/changelogs; for complaints use GitHub issues, HN, Reddit, official forums.

Products to cover (verify current 2026 state; things change fast):
1. Warp — agent management / "Agents 3.0"/Warp Code, ability to run Claude Code/Codex/Gemini CLI inside Warp, agent task list, Warp Drive shared state
2. Cursor — background agents / cloud agents, the Agent window / "Agents" layout (Cursor 2.x), multi-agent parallel, plans, Bugbot; Cursor CLI
3. Zed — agent panel, Agent Client Protocol (ACP) letting Claude Code / Codex / Gemini CLI run inside Zed; threads
4. Amp (Sourcegraph/ampcode) — threads, thread sharing, handoff/"handoff" command, subagents, Amp leaving Sourcegraph?
5. OpenAI Codex — Codex app (desktop?), Codex cloud tasks, Codex CLI, AGENTS.md, plans, best-of-N, PR review
6. Google Jules — async agent, plan approval, pricing, Jules tools/API
7. Devin (Cognition) — sessions, Devin's planning, playbooks, knowledge, Windsurf acquisition integration, any "done" verification / test evidence
8. Factory (factory.ai) — Droids, specs mode, any closure/verification behavior
9. GitHub Copilot coding agent + Agent HQ (GitHub Universe 2025 announced "Agent HQ" letting Claude/Codex/etc agents work from GitHub with mission control) — verify what shipped by 2026
10. Claude Code itself: background tasks, subagents, agent teams / "Claude Code on the web", Claude Code desktop, plan mode, todo list (TodoWrite / Tasks), hooks — what's the cross-session task persistence story in 2026? (e.g. "Tasks" feature that persists across sessions, shared task lists across subagents)

For EACH: problem targeted; how it works; whether it can host/coordinate agents from OTHER vendors and whether they share any common state (task, plan, memory) — be precise; where state lives (cloud vs local vs repo); human approval model (plan approval, PR review, permissions); any notion of acceptance criteria / evidence / verification before a task counts as done; pricing/status; notable gaps/complaints with citations.

End with a blunt synthesis: which of these already provide (a) cross-vendor agent hosting, (b) a shared persistent task/goal record, (c) human-gated structural changes, (d) evidence-checked completion, (e) session handoff between different runtimes. Distinguish verified facts from inference. Dense report ~2000-3000 words, URLs inline.
```

## 报告

# Vendor coding-agent platforms: multi-agent, background agents and task state (as of 2026-10-16)

**Method and caveats.** I used official docs, changelogs and blogs wherever I could. The shared WebSearch budget ran out after about 14 searches, so the rest of the facts come from fetching official URLs directly. That means user complaints come mostly from official forums, docs "limitations" sections and launch-day reviews, not a full sweep of GitHub, HN and Reddit. "Not documented" means the page I fetched doesn't say it; it doesn't prove the feature is absent. Anything marked **[inference]** is my reading, not a stated fact.

---

## 1. Warp

- **Problem it targets.** Warp wants to be the terminal or "control plane" you use to run and watch many agents, its own and other vendors'.
- **Hosting other vendors' CLI agents (verified).** Warp calls this "universal agent support" for third-party CLI agents. It covers Claude Code, Codex, OpenCode, Amp, Auggie, Copilot CLI, Cursor CLI, Gemini CLI, Droid, Pi, Goose, Antigravity, Hermes, Mistral Vibe, Grok Build and Kiro CLI ([overview, updated Oct 12 2026](https://docs.warp.dev/agent-platform/third-party-agents/overview)).
  - Warp adds a rich input editor, code-review comments, vertical-tab status and Remote Control (publish a running session to steer it from another device).
  - Notifications work only for Claude Code, Codex and OpenCode, through a plugin or config change ([feature table](https://docs.warp.dev/agent-platform/cli-agents/overview/)).
  - Third-party sessions don't appear in the Agent Management Panel, and the docs describe no task, plan or memory shared with them.
- **Oz / Automation Platform (cloud).** Launched Feb 10 2026 ([blog](https://warp.dev/blog/oz-orchestration-platform-cloud-agents)): CLI, API and SDK, Docker environments, schedules, and every run gets a link and audit trail.
  - Multi-harness support (Claude Code, Codex and Warp Agent "side by side") was announced May 20 2026. It is in beta, and cross-harness Agent Memory is a research preview ([SD Times](https://sdtimes.com/ai/warp-updates-oz-to-help-enterprises-orchestrate-coding-agents-across-any-model-or-harness/)).
  - Only Warp Agent can act as a parent that spawns Claude Code children ([Claude Code harness doc](https://docs.warp.dev/platform/harnesses/claude-code.md)).
  - Claude Code runs with the team's own Anthropic or Bedrock credentials. Warp bills compute and platform usage.
- **Shared state.**
  - `/plan` plans are saved to a *Plans* folder in Warp Drive, versioned, and exportable as Markdown. There is no formal approval gate: execution starts when you tell the agent to run the plan ([planning](https://docs.warp.dev/agents/capabilities/planning/)).
  - Task lists are generated by the agent per conversation, with no documented persistence or sharing ([task lists](https://docs.warp.dev/agents/capabilities/task-lists/)).
  - Agent Memory runs server-side with user, agent and team stores. It is readable by Claude Code and Codex **only when they run as cloud agents**. "Running third-party harnesses locally isn't supported during the research preview" ([Agent Memory](https://docs.warp.dev/agents/agent-memory/)).
- **Newest layer: Warp Factories (Early Access since Aug 27 2026, per the [2026 changelog](https://docs.warp.dev/changelog/2026/)).**
  - A "foreman" agent moves work from Slack, GitHub, Linear or Jira through Triage, Planning, Building and Reviewing.
  - Spec approval lives in the foreman's editable instructions. "The factory never merges on your behalf."
  - Evaluation uses scorers and benchmarks. The docs don't specify what a verify step checks ([Factories](https://docs.warp.dev/factories/)).
  - The Factory MCP lets a local agent send work to a factory, take it over and hand it back. Claude Code and Codex runs get Factory MCP automatically (Sep 9 2026).
- **Handoff.** "Local continuation for Codex and Claude Code cloud runs" (Jun 24 2026). Cloud runs save handoff snapshots when interrupted (Sep 23 2026).
- **Gaps.** On Oct 15 2026 Warp shipped a fix so "Claude Code harness runs stop reporting completion on every turn". So "done" detection for third-party harnesses was noisy. I could not verify the 2025 "Agents 3.0" post (the URL I tried returned 404).

## 2. Cursor

- **Cursor 2.0 (Oct 29 2025).** An agent-centred layout, with parallel agents isolated by git worktrees or remote machines ([blog](https://cursor.com/blog/2-0)).
- **Cloud Agents (formerly Background Agents).** These run in isolated VMs.
  - Starting points: desktop, web, iOS, Slack, Linear, `@cursor` on GitHub or Bitbucket, or the API.
  - They work on a branch and produce merge-ready PRs, with "screenshots, videos, and logs" as artifacts. You can take over the remote desktop.
  - Hooks from `.cursor/hooks.json` run in the cloud.
  - Billed at API pricing on paid plans ([docs](https://cursor.com/docs/cloud-agent)).
  - There is no explicit pre-execution approval. The gate is the PR.
- **Cursor Projects (beta, Sep 10 2026).** This is the multi-agent answer ([blog](https://cursor.com/blog/projects)).
  - A coordinator "doesn't write code itself but directs other agents", across parallel cloud and local agents.
  - It keeps "a set of files that sync across cloud and local machines". Where those files live is not specified.
  - Triggers: Slack, schedules, PRs.
  - No formal verification is described. Human review is PR review, loosened over time.
  - The coordinator can delegate only to Cursor agents. Nothing indicates Claude Code or Codex.
- **Other recent changes.**
  - Bugbot reviews PRs; Bugbot Autofix spawns a Cloud Agent, limited to 3 attempts per PR ([Bugbot](https://cursor.com/docs/bugbot)).
  - Rollouts and Security Review (Sep 23 2026).
  - Local-agent remote control from iOS (Oct 6 2026) ([changelog](https://cursor.com/changelog)).
- **Cross-vendor.** Cursor does **not** run Claude Code or Codex. Instead it **loads their config**: CLAUDE.md, `.claude/agents|skills|commands`, hooks from `.claude/settings.json`, and `.codex/skills`.
  - The CLI cannot opt out. Cursor staff confirmed this on Jul 29 2026 ([forum](https://forum.cursor.com/t/no-way-to-opt-out-of-third-party-claude-code-codex-config-loading-the-flag-is-hardcoded/166558)).
- **Complaints.**
  - Worktree "Apply All" bug in 2.0.34, acknowledged by staff ([forum](https://forum.cursor.com/t/cursor-multi-agent-worktree-unable-to-copy/139606)).
  - Projects: about 5× tokens for 5 subagents; subagents start from scratch; Slack triggers see public channels only; launch-day replies asked Cursor to "merge the subscriptions" ([eesel review](https://www.eesel.ai/blog/cursor-projects-review)).

## 3. Zed

- **External agents through ACP.** These run "as separate processes that communicate with Zed over ACP". Zed hosts the thread; the agent owns its runtime, auth, tools and model ([docs](https://zed.dev/docs/ai/external-agents)).
  - Curated agents: Claude Agent (Claude Agent SDK through an adapter Zed installs), Codex, OpenCode, Copilot, Cursor, Pi, Gemini CLI.
  - Zed profiles and skills don't apply to these agents. MCP "may be forwarded".
  - Zed doesn't charge for external agents.
- **Milestones.**
  - ACP Registry, Jan 28 2026 ([blog](https://zed.dev/blog/acp-registry)).
  - Parallel Agents, Apr 22 2026: "mix and match agents on a per-thread basis", a threads sidebar, optional per-thread worktrees ([blog](https://zed.dev/blog/parallel-agents)).
  - Terminal Threads, May 20 2026: any CLI (`claude`, `amp`, `pi`) as a managed sidebar thread; Amp has no ACP adapter ([blog](https://zed.dev/blog/terminal-threads)).
- **What ACP itself carries.** The protocol has a "plan" (entries with `content`, `priority`, `status`). The agent owns it and sends full replacements over `session/update`. There is no acceptance-criteria field and no persistence semantics ([spec](https://agentclientprotocol.com/protocol/agent-plan)). The ACP agent list includes Claude Agent and Codex CLI (via adapters), Cursor, Factory Droid, Gemini CLI, Copilot, Goose, Kiro and others ([list](https://agentclientprotocol.com/overview/agents)).
- **Gaps.** No shared task or plan across threads is documented. Thread storage location is not documented. Approval or review controls in parallel-agents mode are not described.

## 4. Amp (now Amp Frontier Corporation)

- **Company.** Spun out of Sourcegraph on Dec 2 2025: "We're spinning out of Sourcegraph to become an independent research lab… Amp is profitable" ([news](https://ampcode.com/news/amp-frontier-corporation)).
- **Threads and handoff.**
  - Handoff (Oct 23 2025) replaced compaction. It builds a draft prompt plus a file list for a new thread, which you review and edit ([news](https://ampcode.com/news/handoff)).
  - Public discoverable threads ended Jun 2 2026, because reviewing threads for sensitive snippets became "too hard". Threads are now shared at workspace level or as unlisted links ([news](https://ampcode.com/news/end-of-public-threads)).
- **Agents and remote machines.**
  - Agents can spawn, message and exchange files with other agents (Jul 17 2026) ([news](https://ampcode.com/news/from-agent-to-agent)).
  - Orbs are per-thread cloud machines (from Jun 30 2026). The Mac app can act as a runner (Sep 24 2026) ([news index](https://ampcode.com/news)).
- **Task lists removed.** TODOs were **removed** Jan 12 2026: "The agent tracks its own work in a single thread just fine without TODOs" ([news](https://ampcode.com/news/todos-are-done)).
- **Cross-vendor (verified, narrow).** "Claude Code mode" (Oct 10 2026) "uses the Claude Agent SDK instead of Amp's own agent". It runs on your Claude Pro or Max plan and supports orbs, runners, thread sharing, multiplayer and thread-to-thread orchestration ([news](https://ampcode.com/news/use-your-claude-plan)). Whether subagents, handoff and review work in this mode is not stated.
- **Evidence.** The Fable 5.1 post (Sep 1 2026) shows the model producing videos and screenshots as "proof of work". This is model behaviour, not a gate ([news](https://ampcode.com/news/fable-5.1)).

## 5. OpenAI Codex

- **Surfaces.**
  - Codex app on macOS launched Feb 2 2026. Codex joined the ChatGPT desktop app Jul 9 2026.
  - Plan mode exists (Feb–Mar 2026 entries).
  - Best-of-N since 2025-06-13. PR review that "can run code to validate changes" since 2025-08-27.
  - Handoff: local↔cloud since 2025 (renamed from Sync to Handoff Feb 3 2026), local↔worktree Mar 3 2026, thread handoff between hosts Jun 18 2026.
  - Memories Apr 16 2026. Codex Remote GA Jun 25 2026. GitLab cloud reviews beta Aug 19 2026.
  - Source: [changelog](https://learn.chatgpt.com/docs/changelog).
- **Goals.** Goal mode became GA May 21 2026. A Goal is "a completion condition: what should be true, how success should be checked, and what constraints must stay intact". It "should not be marked complete because the model believes it is probably done", only after checking "files, tests, logs, benchmark output…".
  - Budgets stop work, and "reaching a budget limit is not the same as completing the objective".
  - "Goals are implemented as persisted thread state, not as global memory and not as project-level instructions" ([cookbook, May 9 2026](https://learn.chatgpt.com/cookbook/examples/codex/using_goals_in_codex)).
  - **[inference]** The model checks evidence against its own goal. The cookbook describes no external verifier.
- **Cross-vendor.** Codex does not host other agents. On Aug 11 2026 it added `/import` and desktop import of "instructions, settings, skills, plugins, projects, and recent work from Claude Code, Claude Cowork, and Cursor, with optional automatic sync". That is a migration path, not live interop.
- **Pricing.** Codex is included in ChatGPT Free, Go, Plus, Pro, Business, Edu and Enterprise. Cloud tasks share and can consume more of the plan's allowance ([pricing](https://learn.chatgpt.com/docs/pricing)).
- **AGENTS.md.** Now stewarded by the Agentic AI Foundation under the Linux Foundation. Supported by Codex, Jules, Factory, Zed, Warp, Devin, Amp, Cursor, Copilot coding agent and others ([agents.md](https://agents.md/)).

## 6. Google Jules

- **How it works.** An async agent in a Google Cloud VM.
  - In the UI you "review and approve [the plan] before any code changes are made" ([docs](https://jules.google/docs/)).
  - In the API (v1alpha), `requirePlanApproval` defaults off: "if unset, plans are auto-approved". `AUTO_CREATE_PR` mode exists, and there is an `AWAITING_PLAN_APPROVAL` state ([API ref](https://developers.google.com/jules/api/reference/rest/v1alpha/sessions)).
- **Changelog items** ([changelog](https://jules.google/docs/changelog/)):
  - A Planning Critic reviews "all plans that do not require human intervention", with a claimed 9.5% drop in failures (Jan 26 2026).
  - CI Fixer auto-fixes failed GitHub Actions on Jules PRs (Feb 19 2026).
  - MCP support (Feb 2 2026).
  - Per-repo memory under "Knowledge" (Sep 2025).
  - Jules Tools CLI and API (Oct 2025).
- **Pricing.** Base plan 15 tasks a day and 3 concurrent; Pro 100/15; Ultra 300/60. Paid tiers are only for individual @gmail.com accounts ([limits](https://jules.google/docs/usage-limits/)).
- **Status flag.** The newest changelog entry is **Mar 9 2026**, and the product is still labelled "experimental". **[inference]** Jules looks under-invested, since Google's agent work appears to have moved to Antigravity. That rests on secondary sources only.

## 7. Devin (Cognition)

- **Windsurf became Devin Desktop on Jun 2 2026.** The Agent Command Center (Spaces, Kanban, multi-agent) is now the primary view. Cascade's agent became Devin Local. The Windsurf JetBrains plugin is in maintenance mode ([FAQ](https://docs.devin.ai/desktop/devin-desktop-faq.md)).
- **Cross-vendor (verified).** Devin Desktop runs ACP agents (Codex CLI, Claude Agent, Gemini CLI, Junie, OpenCode) in the Command Center on Pro, Max and Teams. Limits: binaries must be pre-installed, auth is separate, and billing and terms go "directly between you and the third-party agent provider". No shared tasks, plans or knowledge are documented ([ACP](https://docs.devin.ai/desktop/acp.md)).
- **Spaces.** A Space groups local and cloud Devin sessions, PRs, files and inherited project context for one task ([Spaces](https://docs.devin.ai/desktop/spaces.md)). Whether ACP agents can join a Space is not stated.
- **Orchestration.** "Devin Manages Devins" (Mar 19 2026). Child sessions in their own VMs return structured JSON (Apr 3 2026). A Tasks tab shows the task list (Jul 17 2026).
  - Child sessions auto-start by default; you can switch that to require approval ([advanced](https://docs.devin.ai/work-with-devin/advanced-capabilities.md)).
  - "Approve playbook" status (Sep 30 2026).
  - Knowledge is being migrated to Skills (Sep 18 2026) ([release notes](https://docs.devin.ai/release-notes/overview)).
- **Evidence.**
  - After CI is green, Devin sends a test plan, runs the app and returns an annotated screen recording. It asks before testing unless "Pre-approve testing" is on.
  - Testing does **not** block the PR ([testing](https://docs.devin.ai/work-with-devin/testing-and-recordings.md)).
  - Devin Review findings go back to the running session first (Sep 30 2026).
- **Handoff.** CLI `/handoff` packages conversation context and the uncommitted diff into a cloud Devin. Going back pulls the PR branch ([handoff](https://docs.devin.ai/cli/handoff)).
- **Pricing.** Free; Pro $20; Max $200; Teams from $80 ([billing](https://docs.devin.ai/admin/billing/self-serve.md)). You can link a ChatGPT plan to pay for GPT tokens.

## 8. Factory

- **Spec Mode.** Read-only planning, then `ExitSpecMode` asks for approval, then implementation at a chosen autonomy level. Saving the spec as Markdown to `.factory/docs` is **opt-in** ([spec mode](https://docs.factory.com/autonomy-and-safety/specification-mode.md)).
- **Missions.** An orchestrator breaks the work into features and milestones, and the plan must be approved first.
  - "Every milestone ends with a validation phase." Validators run tests, regression and integration checks, and can create follow-up fix features.
  - Workers get a fresh context per feature. "Git is the source of truth."
  - Median run about 2 hours; the longest ran 16 days ([news](https://factory.com/news/missions)). The fetched page showed the date as Feb 26 **2025**; **[inference]** that is likely 2026.
  - The docs say Missions "are still evolving", with open questions on correctness and parallelism. They don't say where mission state is stored ([overview](https://docs.factory.com/missions/overview.md)).
- **Automated QA.** `/qa` produces screenshots, GIFs and terminal snapshots, plus a pass/fail/blocked report posted as a PR comment. It can be configured as a **required** check ([QA](https://docs.factory.com/software-factory/automated-qa.md)).
- **Pricing.** Pro $20, Plus $100, Max $200 ([pricing](https://docs.factory.com/pricing/individuals.md)).
- **Cross-vendor.** Factory doesn't host other agents (nothing found). Droid itself runs inside Warp, Zed and other hosts through ACP.

## 9. GitHub Copilot coding agent and Agent HQ

- **Agent HQ (announced Oct 28 2025).** The announcement covered mission control, VS Code Plan Mode, AGENTS.md custom agents and a control plane, with Anthropic, Google, Cognition and xAI agents promised for "coming months" ([blog](https://github.blog/news-insights/company-news/welcome-home-agents/)).
- **What shipped.** On Feb 4 2026, Claude and Codex arrived in **public preview** for Copilot Pro+ and Enterprise. You can assign one issue to Copilot, Claude, Codex or all three; they open draft PRs ([blog](https://github.blog/news-insights/company-news/pick-your-agent-use-claude-and-codex-on-agent-hq/)).
  - Current docs still say "currently in public preview". Claude uses the Claude Agent SDK and Codex uses the Codex SDK.
  - The agent "will request a review from you". CodeQL, secret and dependency scanning run before the PR is finalized ([docs](https://docs.github.com/en/copilot/concepts/agents/about-third-party-coding-agents)).
  - I found no Google, Cognition or xAI agent in the docs.
- **Shared state.** The repo, issue and PR are the shared record. The docs mention no other shared structure.
  - Steering "is not available for third-party coding agents".
  - Cloud sessions run in Actions and are shared with anyone who has repo access. Commit messages link to session logs ([tracking](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/track-copilot-sessions)).
- **Limits.** 59-minute session cap that can't be bypassed; one repo, one branch and one PR per task; GitHub-hosted repos only ([about](https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-coding-agent)).
- **Newer.** Dynamic workflows in Copilot CLI and the Copilot app (Oct 1 2026) can "have subagents verify each other's findings" and pause at checkpoints ([changelog](https://github.blog/changelog/2026-10-01-dynamic-workflows-in-copilot-cli-and-the-copilot-app/)).

## 10. Claude Code

- **Task list.** TodoWrite is "disabled by default in favor of" TaskCreate, TaskGet, TaskList and TaskUpdate. Tasks persist across compaction.
  - `CLAUDE_CODE_TASK_LIST_ID=x` shares a list across sessions through `~/.claude/tasks/x` (local).
  - **Key 2026 change:** the task tools are provided by default **only on Opus 4.7, Sonnet 4.6, Haiku 4.5 and earlier** (v2.1.268+). On newer models "Claude keeps track of multi-step work without a written checklist", unless you set `CLAUDE_CODE_ENABLE_TODO_TOOLS=1`. Background and cloud sessions always get them ([tools ref](https://code.claude.com/docs/en/tools-reference), [interactive mode](https://code.claude.com/docs/en/interactive-mode)).
- **Agent teams (experimental, behind a flag).**
  - Shared task list in `~/.claude/tasks/{team}` with dependencies and file-lock claiming; JSON mailboxes.
  - `TaskCompleted` and `TeammateIdle` hooks can **block completion** with exit code 2.
  - Teammate plan approvals are granted by the lead "without the lead reviewing it".
  - Limitations: no `/resume` of in-process teammates, task status can lag, one team per session, the lead may stop early ([docs](https://code.claude.com/docs/en/agent-teams)).
- **Agent view (research preview).** Local background sessions under a supervisor, with state in `~/.claude/jobs/`. There is no shared task store across sessions ([docs](https://code.claude.com/docs/en/agent-view)). Cross-session messaging (plain text, local socket or through Anthropic for remote) cannot carry approval ([docs](https://code.claude.com/docs/en/cross-session-messaging)).
- **Cloud.**
  - `--cloud` starts a session and `--teleport` pulls one locally. The CLI handoff is "one-way"; the Desktop app can push a local session to the cloud.
  - Auto-fix watches PRs and "asks you before acting" on ambiguous or architecturally significant comments ([docs](https://code.claude.com/docs/en/claude-code-on-the-web)).
- **Projects (public beta, Pro and Max, rolling out).** One coordinating conversation runs parallel cloud threads, and a thread can run locally through Remote Control.
  - Optional project **Goal**; status columns including "Waiting on you", "Landing" and "Resolved".
  - Project memory is cloud-stored `MEMORY.md` files that every cloud thread reads.
  - Instructions can say how a thread checks its own work, but these are "instructions Claude keeps to, not enforced settings" ([docs](https://code.claude.com/docs/en/claude-projects)).
- **Cross-vendor.** Claude Code reads AGENTS.md natively (v2.1.277+) ([memory](https://code.claude.com/docs/en/memory)). It does not host other vendors' agents. It *is* hosted by Zed, Warp/Oz, Amp, GitHub Agent HQ and Devin Desktop.

---

## Blunt synthesis

**(a) Hosting agents from other vendors.** Verified hosts:
- Warp: about 16 CLI agents locally, plus Claude Code and Codex as Oz cloud harnesses (beta).
- Zed: ACP plus Terminal Threads.
- Devin Desktop: ACP.
- GitHub Agent HQ: Claude and Codex, still public preview after 8 months.
- Amp: Claude Code mode only.

Cursor, Codex, Jules, Factory and Claude Code don't host other vendors' agents. Cursor and Codex instead *ingest* Claude and Cursor configuration (forced config loading in Cursor; one-off import with optional sync in Codex). Hosting nearly always means "run it in a pane or sandbox and show status". **Hosts don't share task or plan state with the hosted agent.** Warp, Zed and Devin all explicitly document that the guest agent owns its own runtime, auth and config.

**(b) A shared, persistent task or goal record.** Every vendor now has one *inside its own product*: Cursor Projects context files, Claude Code Projects memory and goal, Codex Goals (one thread only), Devin Spaces and Tasks, Factory Missions, Warp Drive plans and Agent Memory, Oz run records.

Across vendors there is **none verified**. The closest are:
- Warp Agent Memory shared across Warp Agent, Claude Code and Codex, but only in Oz cloud, as a research preview for design partners.
- GitHub issues and PRs as the record in Agent HQ.
- Warp Factories routing tickets from GitHub, Linear or Jira, with Factory MCP exposed to Claude Code and Codex.

ACP, the one real cross-vendor protocol, only streams an agent-owned plan for display: no persistence and no acceptance criteria.

There is also a trend away from in-session checklists. Amp removed TODOs (Jan 2026), and Claude Code turns task tools off by default on models newer than Opus 4.7. **[inference]** Durable task state is moving up into vendor-specific "project" layers, which works against portability.

**(c) Human-gated structural changes.** The universal gates are plan approval up front and PR review at the end.
- Plan gates exist in Jules (the API defaults to *auto-approve*), Factory Spec Mode and Missions, Claude Code, Cursor and Copilot plan modes, and Devin playbook and child-session approval (child sessions auto-start by default).
- Several gates are quietly automated: Jules' Planning Critic for auto-approved plans, Claude Code team leads auto-approving teammate plans, and Claude Code Projects threads running in auto mode.
- No product has a typed rule like "this change is structural (schema, API, dependency, architecture), so stop for a human". The closest is Claude Code auto-fix choosing on its own to ask about "architecturally significant" review comments, which is model judgment.

**(d) Evidence-checked completion.**
- Strongest verified: Factory (milestone validators, plus QA reports that can be a **required** PR check).
- Codex Goals: evidence-based completion rule, but the model judges itself **[inference]**.
- Claude Code: `TaskCompleted` hooks can block completion, but you have to write them.
- Evidence without gating: Cursor cloud artifacts, Devin test recordings, Jules CI Fixer and screenshots, Copilot security scans and logs ("do not replace your own review"), Amp proof-of-work videos.
- No product records acceptance criteria next to their evidence in a form that travels across vendors. Warp's Oct 2026 fix for Claude Code harness runs "reporting completion on every turn" shows that hosts can't reliably tell when a guest agent is done.

**(e) Session handoff between runtimes.** Within one vendor this is solved:
- Codex: local↔cloud↔worktree↔host.
- Claude Code: teleport cloud→local; Desktop pushes local→cloud.
- Devin CLI `/handoff`.
- Amp handoff and runners.
- Warp: local continuation of Claude Code and Codex cloud runs.
- Cursor Projects: the coordinator starts local agents.

Across vendors there is **no live handoff with context carried over**. Codex `/import` (config plus recent chats) and Warp's Factory MCP (send work to a factory and take it back) are the nearest. Switching agents per thread in Zed or Devin Desktop starts a fresh context.

**Bottom line [inference].** Cross-vendor *hosting* is common now. A cross-vendor *shared, persistent task, goal and evidence record* with human gates on structural changes is not offered by any product I could verify. The pieces exist only inside single-vendor products: Factory's validation, Codex's evidence-based goals, Claude Code's completion hooks, and the "project" layers from Cursor and Anthropic.
