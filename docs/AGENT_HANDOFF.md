# Cross-Agent Handoff

## One repository, many agent surfaces

The repository is the durable source of truth. Chat histories are supporting context, not the implementation contract.

Use the same branch and paste-ready prompt across:

- OpenAI Codex app, CLI, IDE or cloud;
- Claude Code or Claude Work;
- Gemini CLI / Antigravity;
- GitHub Copilot coding agent;
- Cursor or another MCP-capable coding agent.

## Fastest handoff

1. Clone or open `blueshirtprogrammer/sol-conference`.
2. Check out `agent/sol-room-vision-site`.
3. Open `prompts/PASTE_INTO_ANY_CODING_AGENT.txt`.
4. Paste its entire contents into the new agent session.
5. Allow the agent to read the repository.
6. Configure MCP locally using `mcp/MCP_STACK.md` and `.mcp.example.json`.
7. Begin with read-only smoke tests or Phase 0B.

## Agent-specific discovery

```text
Codex / generic    -> AGENTS.md, START_BUILD_HERE.md, skills/, paste prompt
Claude Code        -> CLAUDE.md and project/local MCP config
Gemini CLI         -> GEMINI.md and .gemini/settings.json
Copilot / VS Code  -> .github/copilot-instructions.md and .vscode/mcp.json
Other MCP client   -> llms.txt, SOUL.md, paste prompt, client MCP config
```

## Context continuity

Do not depend on a web-chat transcript automatically appearing inside a coding agent.

The portable context is:

- canonical repository files;
- branch and git history;
- issues/PRs;
- skills;
- diagnostics and evidence;
- the paste-ready bootstrap prompt.

A coding agent may read a summary of the originating conversation, but repository contracts win when there is a conflict.

## Orchestration pattern

Use one lead/supervisor thread and multiple bounded worktrees after Phase 0B contracts exist.

Suggested worktrees:

```text
agent/contracts-room-state
agent/obs-external-proof
agent/windows-phone-link-lab
agent/room-console
agent/verification-ci
```

The lead agent:

1. owns shared architecture and contracts;
2. assigns bounded lanes;
3. reviews evidence and diffs;
4. prevents duplicate/incompatible implementations;
5. merges only after checks pass;
6. updates the phase plan with real findings.

## Human control

The human must approve:

- real calls/messages;
- recording/streaming;
- driver installation;
- elevated commands;
- firewall/router changes;
- public deployment;
- merging the canonical branch.

## First command to any coding agent

```text
Read prompts/PASTE_INTO_ANY_CODING_AGENT.txt and follow it exactly.
Do not change architecture before reading the mandatory files.
Begin with read-only state inspection, then Phase 0B or the no-code lab as assigned.
```
