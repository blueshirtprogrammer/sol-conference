# AGENTS.md — Sol Room Engineering Contract

## Mission

Build Sol Room from one reliable local digital bridge into a vendor-neutral room operating system for humans, phones, media, existing AI voice applications and working agents.

## Mandatory read order

1. `SYSTEM_PROMPT.md`
2. `VISION.md`
3. `SOL_ROOM_MASTER_SPEC.md`
4. `START_BUILD_HERE.md`
5. `CODING_AGENT_PROMPT.md`
6. `CODEX_PROJECT.md`
7. `specs/obs-plugin.md`
8. `lab/CURRENT_HARDWARE_TOPOLOGY.md`
9. `lab/PHONE_LINK_OBS_BUILD_PLAN.md`
10. `lab/USB_C_PHONE_LAB.md`
11. `website/`

Twilio, SIP and metered realtime APIs are optional fallback work only. They are not the MVP and may not replace local virtual-device, Phone Link, OBS or hardware-lab work.

## Architectural invariants

- Local virtual devices are the default compatibility layer.
- Existing AI applications are ordinary media nodes.
- The phone remains authoritative for SIM, contacts, native calls and native messages.
- Microsoft Phone Link is the first native-cellular transport adapter; Sol Room does not rebuild Phone Link before the bridge proof.
- The Windows/desktop fabric owns local routing, monitoring and virtual endpoints.
- OBS is the visual body and operator console, not the room authority or call-continuity layer.
- Sol Fabric remains authoritative for room state, audio routing, policy, MCP and emergency control.
- The external OBS WebSocket proof precedes the native OBS plugin.
- Raspberry Pi/edge hardware may own room state replication, physical controls and lightweight moderation.
- Media participation and tool permission are separate.
- Every route is explicit and every node receives mix-minus.
- Humans can silence or isolate every AI immediately.
- AI-to-AI turns are bounded and human speech has priority.

## Integration priority

Use the most reliable interface available:

1. typed Sol Fabric APIs and shared command handlers;
2. official application APIs or protocols, including OBS native APIs/WebSocket;
3. Windows UI Automation for Phone Link and unsupported desktop applications;
4. supervised computer-use/vision fallback;
5. manual operator action when automation cannot be verified safely.

Never use coordinate clicking when a semantic or accessibility interface exists.

## Target repository shape

```text
apps/
  sol-fabric-service/
  sol-room-web/
  sol-obs-bridge/
  sol-obs-plugin/
  sol-desktop/
  sol-link-android/
  sol-room-edge/
packages/
  contracts/
  media-graph/
  room-state/
  command-policy/
  virtual-devices/
  phone-link-adapter/
  obs-adapter/
  device-commands/
  agent-adapters/
  artifact-bus/
  diagnostics/
  test-harness/
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
14. OBS restart or failure must not terminate calls or destroy room truth.
15. A native plugin or driver is not complete merely because it compiles.
16. Shared command handlers must serve the web UI, OBS integration and MCP; do not create divergent control logic.

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
- The OBS dock and Sol Room web UI are two views of the same authoritative state.
- Audio, visual, tool and work state appear separately.
- Humans-only, private operator channel and emergency silence remain visible.
- Provider jargon belongs only in diagnostics.

## Definition of evidence

A feature is verified only when supported by an automated test, real-device diagnostic, screenshot/video, audio loopback capture, state trace, operating-system event or written reproduction procedure.

A coding agent may not mark a real device, Phone Link, audio, OBS plugin or driver capability complete merely because code compiles or a mock passes.

## Current phase

Begin with Phase 0B in `START_BUILD_HERE.md`: the buildable control-plane scaffold, deterministic room/phone simulator and external OBS WebSocket proof. Do not begin cloud telephony, production audio drivers or the native OBS plugin before its gate passes.