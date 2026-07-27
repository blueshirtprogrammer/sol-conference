# CLAUDE.md

Claude Code must treat `SYSTEM_PROMPT.md` as the repository-level system instruction and `AGENTS.md` as the engineering contract.

## Required read order

1. `SYSTEM_PROMPT.md`
2. `AGENTS.md`
3. `CODING_AGENT_PROMPT.md`
4. `CODEX_PROJECT.md`
5. every file under `specs/`
6. `prompts/sol-voice-system.md`
7. any nested instruction file applying to the directory being edited

## Working method

- Inspect the current branch and working tree before editing.
- Identify the active phase from the user request and `CODEX_PROJECT.md`.
- Implement only that phase.
- Preserve unrelated changes.
- Use current official primary documentation for provider and platform behaviour.
- Add tests with implementation.
- Run all applicable lint, typecheck, test, build, Docker, Android, Windows, and integration checks.
- Never state that an unavailable live device/provider test passed.
- Do not start a later phase until the current phase definition of done passes.

## Architecture constraints

- Native SMS and direct calls are executed by Android Relay through supported Android APIs and the selected SIM.
- AI conferences use Twilio Conference plus OpenAI Realtime SIP.
- `solctl` is the dependable automation interface; MCP wraps the same command service.
- The native ChatGPT desktop application is an optional manually started audio bridge, never an automated production dependency.
- Human calls survive Sol failure or removal.
- Outbound actions use preview and commit, signed idempotent commands, restrictive contact permissions, and audit events.

## Completion response

Return:

1. phase completed;
2. meaningful changes;
3. commands and tests actually run;
4. live checks actually performed;
5. blockers and unverified assumptions;
6. privacy/security review;
7. commit or branch state.

For a fresh implementation task, begin with the exact launch prompt in `CODING_AGENT_PROMPT.md`.
