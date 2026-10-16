# 11-写代码-并行Agent桌面

> 2026-10-16 本会话的调研代理原始报告（英文原文，未改动）。结论汇总见上一级的《同类调研》。下面先是交给它的任务，再是它的报告。

## 任务

```text
Read-only web research task (today is 2026-10-16). Use WebSearch and WebFetch (load them via ToolSearch "select:WebSearch,WebFetch"). Do NOT sign up, log in, submit forms, or download/run anything. Do not write any files. Return your findings as your final report text.

Goal: rigorous, current (2026) competitive facts about "parallel coding-agent orchestration desktops/CLIs" for a developer audience who use Claude Code / Codex daily. Claims must survive scrutiny: every fact needs a source URL, and note the date of the page/release/commit where visible. Prefer official docs, GitHub READMEs, changelogs, release pages; for complaints use GitHub issues, HN, Reddit threads.

Products to cover (check each one is still live in 2026; flag if sunset, acquired, archived, renamed):
1. Conductor (conductor.build, Melty Labs) — Mac app running parallel Claude Code/Codex in git worktrees
2. Superset (superset.sh or similar — terminal for running many coding agents in parallel)
3. Vibe Kanban (BloopAI) — reported sunsetting? verify
4. Sculptor (Imbue)
5. Crystal (stravu/crystal) — maybe renamed to Nimbalyst? verify
6. Claude Squad (smtg-ai/claude-squad)
7. Terragon (terragonlabs) — reported shutdown? verify
8. Any other notable ones you find in 2026 (e.g. Claude Code desktop / Claude Code on the web parallel sessions, "agent-of-empires", "Mux" by Coder, Jean, Emdash, Sidequest, Omnara, Happy, etc.) — pick the 3-5 most relevant.

For EACH product report:
- Problem targeted and how it solves it (worktrees? containers? kanban? cloud VMs?)
- Which agent vendors are supported (Claude Code, Codex, Gemini CLI, Amp, OpenCode, Cursor CLI...) and crucially: do multiple different vendors' agents share any common state/record (a task, plan, goal, memory) or is each session isolated?
- Where state lives (local SQLite/files, repo files, cloud)
- Human approval/review model (diff review, PR creation, merge button, permission prompts)
- Does it have any notion of a goal/task with acceptance criteria or evidence before "done"? Any closure check?
- Status/pricing/open-source license, latest version + date
- Gaps & user complaints with citations (GitHub issues, HN, Reddit)

End with: a short synthesis of what this category solves well (parallelism, isolation, review of diffs) and what it does NOT solve (shared cross-vendor intent/requirements, long-lived goal record, evidence-checked completion, handoff between runtimes) — with evidence. Be blunt and precise; distinguish verified facts from your inference. Keep the report dense (aim ~1500-2500 words), with URLs inline.
```

## 报告

# Parallel coding-agent orchestrators: competitive facts as of 2026-10-16

**How this was gathered.** All facts come from pages I fetched on 2026-10-16, with dates given where the page shows them. Three limits on coverage:
- The shared WebSearch budget ran out partway through. After that I could only fetch URLs I already knew.
- I did not cover Jean, Omnara, Happy or Sidequest.
- Reddit could not be fetched, so the complaints for Conductor rest on few sources.

"Inference" marks my own reading; everything else is sourced.

## Status at a glance

| Product | Status (Oct 2026) | Latest version | License / price |
|---|---|---|---|
| Conductor | Live, actively shipping | 0.91.0, Oct 15 2026 ([changelog](https://www.conductor.build/changelog)) | Proprietary. Free (local); Pro $50/mo; Teams $60/user/mo ([pricing](https://www.conductor.build/pricing)) |
| Superset | Live, actively shipping | desktop-v1.38.0, Oct 14 2026 ([releases](https://github.com/superset-sh/superset/releases)) | Elastic License 2.0, which is not OSI open source ([LICENSE](https://github.com/superset-sh/superset/blob/main/LICENSE.md)). Free tier plus Pro |
| Vibe Kanban | The company (bloop) shut down Apr 10 2026; the project is "community maintained" | v0.1.44 on Apr 24 2026; version bump to 0.1.45 on Sep 19 2026 | Apache-2.0 |
| Sculptor (Imbue) | Live, "experimental research preview" | Release branch v0.48.0 cut Sep 18 2026 ([PR #438](https://github.com/imbue-ai/sculptor/pull/438)) | MIT |
| Crystal | **Deprecated Feb 2026**, replaced by Nimbalyst | Final release v0.3.5, Feb 26 2026 | MIT |
| Nimbalyst | Live | v0.81.6, Oct 15 2026 (pre-release) | MIT; free for individuals |
| Claude Squad | Live, slow release cadence | v1.0.20, Aug 20 2026 | AGPL-3.0 |
| Terragon | **Shut down**; service ended Feb 9 2026 | Frozen open-source snapshot dated Jan 16 2026 | Apache-2.0 |

## 1. Conductor (Melty Labs, conductor.build)

- **Mechanism.** A Mac app. Each workspace gets "its own branch and working tree" ([workflow docs](https://www.conductor.build/docs/concepts/workflow)). Workspaces live in `~/conductor/workspaces/`; older repos kept them in `.conductor/` inside the repo ([docs](https://www.conductor.build/docs/tips/nesting-issues)).
- **Cloud.** Conductor Cloud shipped in 0.78.0 on Jul 30 2026, running on "isolated microVMs" ([changelog](https://www.conductor.build/changelog/0.78.0-introducing-conductor-cloud)).
  - The pricing page says these are Vercel sandboxes (8 cores, 16 GB, us-east-1), available on paid plans only.
  - "chat messages in cloud workspaces are stored on Conductor's servers", unlike local sessions.
  - Usage-based compute pricing is "planned".
- **Agents.** Claude Code, Codex, Cursor and OpenCode ([workflow](https://www.conductor.build/docs/concepts/workflow)). OpenCode 2.0 arrived in 0.87.0 (Sep 18 2026). "Sign in with ChatGPT" arrived in 0.89.0 (Sep 29 2026).
- **Shared state across vendors.** Since 0.28.1 (Dec 23 2025), every workspace has a `.context` directory: "Attachments, plans, and notes are automatically stored here" ([changelog](https://www.conductor.build/changelog/0.28.1-context-directory-set-working-directories)).
  - According to a search-result snippet of Conductor's blog, plans can be written by one agent and pulled into another agent's chat with `@`, and the directory is gitignored. The blog page itself returned 404 when I fetched it.
  - This sharing is **per workspace**. Longer-lived guidance lives in repository settings or checked-in instruction files.
- **Review.**
  - Diff viewer with line comments that are sent to the agent.
  - "Create PR", where the agent drafts the description.
  - Checks tab showing git status, PR metadata, CI, deployments, GitHub review threads and todos.
  - Merge, then archive ([review-and-merge](https://conductor.build/docs/guides/review-and-merge), [checks](https://www.conductor.build/docs/reference/checks)).
- **Closure check.** Todos: "Workspaces are blocked until todos are checked off" ([todos](https://www.conductor.build/docs/core/todos)).
  - Both humans and agents can add todos.
  - No evidence is required. The only rule is to clear a todo "only when the work is complete or no longer applies".
  - The checks page softens this: Conductor "may block or discourage merge actions".
- **Gaps and complaints.**
  - Documented known issues: undo is broken in the composer, and terminal output gets corrupted when switching terminals ([docs](https://www.conductor.build/docs/troubleshooting/issues)).
  - Nested worktrees confuse some IDEs.
  - Justin Duke (Jan 11 2026) called it "a lot of very nice duct tape around Claude Code and git worktrees". He predicted Claude Code Desktop would copy its ideas within "weeks rather than months" ([post](https://www.jmduke.com/posts/failed-experiments.html)).

## 2. Superset (superset.sh)

- **Mechanism.** An Electron desktop app plus a CLI, SDK and MCP server. Each task gets its own worktree. The README warns: "Worktrees separate working files; they do not sandbox processes or prevent merge conflicts" ([repo](https://github.com/superset-sh/superset)).
- **Agents.** More than 20, including Claude Code, Codex, Cursor Agent, Gemini CLI, Copilot, OpenCode, Amp, Devin, Kiro, Grok Build and Mistral Vibe. Any CLI agent can be added ([llms.txt](https://superset.sh/llms.txt)).
- **Shared state across vendors.**
  - "Continue with another agent" (shipped [Aug 30 2026](https://superset.sh/changelog/2026-08-30-seventeen-languages-session-handoff)) starts a fresh session seeded with up to the **last 36,000 characters** of terminal or saved-conversation context ([docs](https://docs.superset.sh/llms.mdx/agent-sessions)).
  - The handoff prompt itself says "the workspace, not the transcript, is the source of truth".
  - It does no redaction: secrets that appeared in the terminal go to the new provider.
- **Tasks.** Superset-native tasks, synced Linear issues and GitHub issues. Fields are title, description, status, priority and assignee. "The task's content" becomes the agent prompt, with one workspace per task. There are no acceptance criteria and no done-check; you "review and merge it from Pull Requests" ([tasks](https://docs.superset.sh/llms.mdx/tasks)).
- **Where state lives.** "Local-first". The docs do not say where state is stored.
- **License.** The README now says ELv2. Older third-party descriptions said Apache 2.0, so the license probably changed (inference).
- **Complaints.**
  - On the [Show HN](https://news.ycombinator.com/item?id=46368739), the team conceded human review is "the /eventual/ bottleneck".
  - One user objected that it means "ten different copies of my database".
  - Another said such tools don't make merges or conflicts with main simpler.
  - There are 466 open issues. Example: #8426, "parallel CLI commands race the weekly token refresh and can log agents out" (Oct 13 2026).

## 3. Vibe Kanban (BloopAI)

- **Status.** [Shutdown post, Apr 10 2026](https://vibekanban.com/blog/shutdown):
  - "Today we're shutting down bloop".
  - The project will live on "open source and community maintained".
  - Remote services stayed up for 30 days, then the app moved to a fully local architecture.
  - The README opens with "Vibe Kanban is sunsetting."
  - Commit history shows **no commits from Apr 24 to Sep 15 2026**, then a burst of community fixes ([commits](https://github.com/BloopAI/vibe-kanban/commits/main)).
- **Mechanism.** Kanban issues lead to workspaces, each with a branch, terminal and dev server. Worktrees sit in the system temp folder by default ([docs](https://vibekanban.com/docs/workspaces/managing-workspaces)).
- **Agents.** Claude Code, Codex, Gemini CLI, Copilot, Amp, Cursor, OpenCode, Droid, CCR and Qwen Code.
- **Where state lives.** A local SQLite database (`db.v2.sqlite`, per issue #3434). Kanban issues, projects and organisations were cloud features and are gone.
- **Review.** Inline diff comments, PR creation and merge. I found no closure check.
- **Complaints.**
  - [#3444](https://github.com/BloopAI/vibe-kanban/issues/3444): a user claims the board moved to bloop's cloud from v0.1.9 onward, and later versions only show "Sign in to organise…". In other words, the kanban itself is what died. This is unverified.
  - [#3406](https://github.com/BloopAI/vibe-kanban/issues/3406): `.git/objects` was "mostly cleared out" after deleting a workspace. The reporter is unsure Vibe Kanban caused it, and no maintainer has replied.
  - #3408: "is this project dead?"
  - **[#3476](https://github.com/BloopAI/vibe-kanban/issues/3476) (Sep 29 2026): a decision made in task A doesn't reach the agent working on task B.** It was opened by a memory vendor, so it is self-interested, but it states the gap exactly.
  - On the 2025 [HN launch](https://news.ycombinator.com/item?id=44533004): telemetry was on by default (later switched to opt-in), GitHub permissions were too broad, and one commenter quipped "we now have to review 11 PRs".

## 4. Sculptor (Imbue)

- **It has pivoted.**
  - The 2025 version put every agent in a Docker container ([announcement, updated Apr 30 2026](https://imbue.com/blog/sculptor-announce)).
  - The current [README](https://github.com/imbue-ai/sculptor) describes workspaces as "isolated worktrees of your repo, branches, and setup". The container backend is now "experimental".
- **Agents.** Built-in support for the Pi harness and Claude Code, and any terminal agent can run. Codex support was added Dec 3 2025 through an OpenAI API key.
- **Review.** Pairing Mode syncs agent state into your local IDE. You then merge back to main. Sessions keep their plans, chats and tool calls.
- **Closure check.** The 2025 product had custom checks written as LLM prompts or shell commands (linters, tests) ([post](https://imbue.com/blog/sculptor)). I did not verify whether this survives in the current build.
- **Openness.** The README admits it isn't "truly open source until the community is involved". The repo has 239 stars.

## 5. Crystal → Nimbalyst (Stravu)

- **Crystal.** Deprecated Feb 2026. The final release, v0.3.5 (Feb 26 2026), says it will not be updated again ([repo](https://github.com/stravu/crystal)).
- **Nimbalyst** ([repo](https://github.com/nimbalyst/nimbalyst), [site](https://nimbalyst.com/)):
  - Claude Code and Codex are first-class; OpenCode and Copilot are alpha.
  - Worktrees are optional per session.
  - A session kanban tracks phases: backlog, planning, implementing, complete.
  - **Trackers** (plans, decisions, bugs, tasks) can be edited by both agents and humans. The README says status is kept as markdown in your git repo with "no proprietary store".
  - Agents can create, update and query tracker items, including status and progress. There are **no acceptance-criteria or verification fields**, and "neither creating nor updating an item auto-links the current session" ([docs](https://nimbalyst.com/docs/task-management/ai-integration)).
  - Analytics go to PostHog by default, with an opt-out.
- **Inference.** This is the closest thing in the category to a record shared across vendors, but nothing enforces it.

## 6. Claude Squad

- **Mechanism.** A terminal UI using tmux plus worktrees. Supports Claude Code, Codex, Gemini and Aider ([repo](https://github.com/smtg-ai/claude-squad)).
  - `-y/--autoyes` (experimental) auto-accepts prompts.
  - `s` commits and pushes; `c` commits and pauses.
  - Configuration lives in `~/.claude-squad/config.json`.
  - There is no task or goal concept.
- **Open issues** ([issues](https://github.com/smtg-ai/claude-squad/issues)):
  - #266: the prompt is lost when sent before Codex or another CLI is ready.
  - #260: request for a worktree setup hook covering dependencies, env files and ports.
  - #275: the Windows binary fails.
  - #56: multiple repos, open since Apr 2025.

## 7. Terragon (shut down)

- **Shutdown.** A competitor page puts the service end at Feb 9 2026 ([DevBoxer](https://www.devboxer.com/docs/resources/terragon-shutdown)); Justin Duke reported it was shutting down on Jan 11 2026. The open-source snapshot README is dated Jan 16 2026: "an open-source snapshot of Terragon at the time of shutdown… provided as-is" ([terragon-oss](https://github.com/terragon-labs/terragon-oss)).
- **What it was.** Cloud containers per task for Claude Code, Codex, Amp and Gemini. Work was checkpointed and pushed to GitHub, with AI-written commit messages and PRs.
- **Reactions.**
  - The top HN reply to "alternatives?" was: "Why not use Claude Code Web or Codex on Web directly?" ([HN](https://news.ycombinator.com/item?id=46589735)).
  - Duke: "their moat was thin"; model providers would "soon cannibalize their UX".

## 8. Other notable tools

**Claude Code (Anthropic's own tools).**
- *Desktop app* ([docs](https://code.claude.com/docs/en/desktop)):
  - Parallel sessions with a worktree option, stored in `<project-root>/.claude/worktrees/`.
  - Local, Cloud or SSH sessions.
  - Line comments on diffs; a CI status bar; auto-fix for CI.
  - "Auto-merge when ready", which squash-merges once checks pass.
- *Cloud sessions* ([docs](https://code.claude.com/docs/en/claude-code-on-the-web)): `claude --cloud` starts parallel cloud sessions. From the CLI, handoff "is one-way": `--teleport` pulls a cloud session down to the terminal, but a terminal session can't be pushed up.
- *Projects* (public beta, Pro/Max only) ([docs](https://code.claude.com/docs/en/claude-projects)):
  - An optional one-line **Goal**.
  - **Project memory** files ("requirements, decisions, and pitfalls").
  - Project instructions that can say how a thread "checks its own work before calling it done". However, these are "instructions Claude keeps to, not enforced settings".
  - Threads are marked Resolved by you, by Claude after you merge, or "automatically after a week with no activity".
  - Anthropic is the only model provider, and a project belongs to one user.
- *Agent teams* (experimental) ([docs](https://code.claude.com/docs/en/agent-teams)):
  - A shared task list at `~/.claude/tasks/{team}/`.
  - A **`TaskCompleted` hook can block completion** by exiting with code 2. This is the only programmable closure gate I found.
  - The docs admit "Task status can lag" and that "The lead can stop early… before all tasks are actually complete."
  - Claude only.

**Codex app (OpenAI)** ([worktrees docs](https://learn.chatgpt.com/docs/environments/git-worktrees)):
- Worktrees live in `$CODEX_HOME/worktrees`.
- "Handoff" moves a chat and its code between the local checkout and a worktree.
- Keeps the 15 most recent worktrees and snapshots one before deleting it.
- No support for other vendors' agents is mentioned.

**Emdash (YC W26)** ([repo](https://github.com/generalaction/emdash)):
- Apache-2.0, about 6.0k stars; v1.2.8 on Oct 10 2026.
- Nine CLI agents; one worktree per task; SSH remotes.
- Issue intake from Linear, GitHub, Jira, GitLab and others.
- "App state is stored in a local SQLite database."
- Diff, PR, CI and merge in one place.
- Issues include #3293 (closing a tab doesn't kill the agent) and #3262 (sustained CPU use).

**Xum, formerly Mux (Coder)** ([repo](https://github.com/coder/mux)):
- Renamed after "Mux.com raised a trademark concern". AGPL-3.0; v0.31.0 on Oct 9 2026.
- Runs **its own agent loop across model vendors** (Anthropic, OpenAI, Grok, Ollama, OpenRouter) rather than wrapping vendor CLIs.
- Local, worktree or SSH runtimes. Experimental "Agent Memory" since v0.29.0.
- Inference: because one harness drives every model, history is shared across models, but you lose each vendor's native CLI.

**Agent of Empires** ([repo](https://github.com/njbrake/agent-of-empires)):
- MIT, v1.20.0 on Oct 15 2026.
- tmux plus worktrees, with optional Docker, Podman or Apple Containers sandboxes.
- Eight CLI agents; terminal UI, web UI, CLI and HTTP API.

## Synthesis

**What the category solves well (verified across products).**
- **Isolation.** Worktrees are now standard (Conductor, Superset, Vibe Kanban, Claude Squad, Emdash, Nimbalyst, Agent of Empires, Claude Desktop, Codex app). The cloud alternative is VMs or containers (Conductor Cloud, Claude cloud sessions, the late Terragon).
- **Launching any vendor's agent.** Superset supports 20+, Vibe Kanban 10, Emdash 9.
- **Diff review.** Line comments go back to the agent, and PR, CI-status and merge buttons sit in the same window.
- **Status and remote steering.** Status views, notifications and mobile apps.

**What it does not solve.**
1. **Intent shared across vendors.** The unit of work everywhere is a workspace, branch or session.
   - The most you get is per-workspace files (Conductor's `.context`), a truncated transcript tail (Superset's 36k characters), a task title and description used as the prompt (Superset, Vibe Kanban), or unenforced markdown trackers (Nimbalyst).
   - Vibe Kanban [#3476](https://github.com/BloopAI/vibe-kanban/issues/3476) names the gap directly.
2. **A long-lived goal record.** Only Claude Code Projects has an explicit Goal plus memory, and it is limited to one vendor, one user, and beta. Everyone else treats a task as a prompt or a synced Linear issue.
3. **Evidence-checked completion.** No product requires evidence before "done".
   - Conductor's gate is a human checkbox.
   - Claude's `TaskCompleted` hook is a script you write yourself, and only for Claude agent teams.
   - Claude Projects' "run make test before done" is explicitly not enforced, and threads auto-resolve after a week of inactivity.
   - CI checks are the de facto proxy for done. Anthropic's own docs concede that agents mark tasks done late or stop early.
4. **Handoff between runtimes.** It is lossy or locked to one vendor.
   - Claude's teleport is one-way from the CLI.
   - Codex's handoff is OpenAI-only.
   - Superset's handoff across vendors is a truncated, unredacted transcript.
   - I found no tool that moves one shared task record between cloud and local runtimes *and* across vendors.
5. **Durability.**
   - Terragon died in Feb 2026.
   - Bloop died in Apr 2026, and the cloud-held kanban data died with it.
   - Crystal was deprecated in Feb 2026; Sculptor pivoted; Mux was renamed.
   - Anthropic and OpenAI now ship worktrees, cloud sessions, auto-fix and auto-merge themselves.
   - Inference: the orchestration layer is being commoditized, and state locked in a tool's database or cloud is a liability.
6. **The human review bottleneck.** Vendors concede it ("the /eventual/ bottleneck"); none of these tools reduces it beyond nicer diff viewers.
