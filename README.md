# Sol Conference

Native, accessible voice conferencing and device communications for connecting trusted people with an explicitly disclosed AI voice participant.

> **Security:** Keep this repository private before adding production configuration. Never commit credentials, real phone numbers, private contact profiles, transcripts, recordings, device keys, or production secrets. Store them in encrypted deployment secrets and private data stores.

## Current status

The complete bootstrap contract is on branch:

```text
agent/bootstrap-sol-conference
```

and draft pull request **#1**. The `main` branch currently contains only the initial README until that PR is merged.

## Agent entrypoints

| Agent | Entry file |
|---|---|
| OpenAI Codex | `AGENTS.md` and `CODEX_PROJECT.md` |
| Claude Code | `CLAUDE.md` |
| GitHub Copilot coding agent | `.github/copilot-instructions.md` |
| Any other coding agent | `CODING_AGENT_PROMPT.md` |
| Repository-wide highest instruction | `SYSTEM_PROMPT.md` |
| Runtime Sol voice behaviour | `prompts/sol-voice-system.md` |
| Reusable repository skill | `skills/sol-conference/SKILL.md` |

All coding-agent entrypoints defer to the same system prompt, specifications, phase plan, and acceptance tests.

## Mandatory read order

1. `SYSTEM_PROMPT.md`
2. `AGENTS.md`
3. `CODING_AGENT_PROMPT.md`
4. `CODEX_PROJECT.md`
5. every file in `specs/`
6. `prompts/sol-voice-system.md`
7. any nested platform-specific instructions

## Start Codex

```text
Read SYSTEM_PROMPT.md, AGENTS.md, CODING_AGENT_PROMPT.md, CODEX_PROJECT.md, every file under specs/, and prompts/sol-voice-system.md.

Implement Phase 0 only.

Do not start Phase 1 until pnpm install, lint, typecheck, tests, production build, and docker compose startup all pass. Do not leave TODOs, placeholder success responses, incomplete provider interfaces, or unverified claims. Commit the completed phase with the verification report required by CODING_AGENT_PROMPT.md.
```

## Start Claude Code

```text
Read CLAUDE.md and follow its mandatory read order. Implement Phase 0 only. Do not begin Phase 1 until the complete Phase 0 definition of done passes. Report commands and tests actually run, and do not claim unavailable live provider or device checks passed.
```

## Product architecture

- Android Relay is the programmable SIM gateway for native SMS and calls.
- Humans retain ordinary Phone and Messages experiences.
- Production AI calls use Twilio Conference plus OpenAI Realtime SIP.
- `solctl` is the dependable automation interface; MCP wraps the same command service.
- Windows Sol Desktop provides device control, diagnostics, Phone Link guidance, and an optional supervised native ChatGPT audio bridge.
- Human calls remain connected when Sol fails, is muted, or leaves.

See `specs/product-requirements.md`, `specs/architecture.md`, `specs/native-integrations.md`, `specs/ui-ux.md`, and `specs/acceptance-tests.md`.
