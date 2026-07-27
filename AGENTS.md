# AGENTS.md — Sol Room Engineering Contract

## Mission

Build Sol Room from one reliable local digital bridge into a vendor-neutral room operating system for humans, phones, media, existing AI voice applications and working agents.

## Mandatory read order

1. `SYSTEM_PROMPT.md`
2. `VISION.md`
3. `SOL_ROOM_MASTER_SPEC.md`
4. `CODING_AGENT_PROMPT.md`
5. `CODEX_PROJECT.md`
6. `lab/USB_C_PHONE_LAB.md`
7. `website/`

The older telephony-first material under `specs/` is superseded where it conflicts with these canonical files. Twilio, SIP and metered realtime APIs are optional fallback work only.

## Architectural invariants

- Local virtual devices are the default compatibility layer.
- Existing AI applications are ordinary media nodes.
- The phone remains authoritative for SIM, contacts, native calls and native messages.
- The Windows/desktop fabric owns local routing, monitoring and virtual endpoints.
- Raspberry Pi/edge hardware may own room state, physical controls and lightweight moderation.
- Media participation and tool permission are separate.
- Every route is explicit and every node receives mix-minus.
- Humans can silence or isolate every AI immediately.
- AI-to-AI turns are bounded and human speech has priority.

## Target repository shape

```text
apps/
  sol-desktop/
  sol-link-android/
  sol-room-web/
  sol-room-edge/
packages/
  media-graph/
  virtual-devices/
  room-state/
  device-commands/
  agent-adapters/
  artifact-bus/
  contracts/
  diagnostics/
website/
specs/
lab/
pitch/
```

## Engineering rules

1. Use strict typing and stable schemas between processes.
2. Model source, destination and route independently.
3. Make externally visible actions idempotent.
4. Validate every command, device identity and permission.
5. Never log secrets, full phone numbers, authentication codes or protected content.
6. Do not claim a transport works until tested on real hardware.
7. Build labelled simulators for unavailable hardware.
8. Keep provider and app adapters behind interfaces.
9. Keep DSP and room-state logic testable without GUI or hardware.
10. Reject direct self-routes and short feedback cycles.
11. Provide a physical/software emergency mute path early.
12. Meet WCAG 2.2 AA and support keyboard, screen reader, reduced motion and 200% zoom.
13. Run relevant checks and provide evidence before completing a phase.

## Required domain model

```ts
type Capability = "hear" | "speak" | "see" | "act" | "share";

type NodeKind =
  | "human"
  | "phone"
  | "ai-app"
  | "working-agent"
  | "local-model"
  | "meeting-app"
  | "media"
  | "screen"
  | "camera"
  | "artifact"
  | "room-device";

type RouteState = "routed" | "isolated" | "muted" | "unavailable";
```

The media graph and agent/tool graph must not be the same object.

## UI principles

- Premium communications product, not a developer console.
- Live room is the primary interface.
- Audio, visual, tool and work state appear separately.
- Humans-only, private operator channel and emergency silence remain visible.
- Provider jargon belongs only in diagnostics.

## Definition of evidence

A feature is verified only when supported by an automated test, real-device diagnostic, screenshot/video, audio loopback capture, state trace, operating-system event or written reproduction procedure.

A coding agent may not mark a real device or audio capability complete merely because code compiles.

## Current phase

Begin with Phase 0 in `CODEX_PROJECT.md`. Do not start cloud telephony.
