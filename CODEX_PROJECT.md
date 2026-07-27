# CODEX_PROJECT.md — Sol Room Goals, Phases and Verification Loops

## Product outcome

Create a local-first room fabric where users connect humans, phone calls, existing AI voice applications, media, screens and working agents; explicitly control who hears, speaks, sees, acts and shares; and produce real artifacts while the conversation continues.

## Phase loop

Every phase follows:

1. **Observe** actual device and operating-system behaviour.
2. **Specify** exact interfaces, constraints and expected state.
3. **Simulate** with a deterministic harness.
4. **Implement** the smallest real vertical slice.
5. **Verify** with tests, traces, screenshots and hardware evidence.
6. **Refine** the specification with what was proven.
7. **Commit** one coherent phase and a truthful report.

## Phase 0A — Canonical vision and hardware definition

Deliver:

- canonical website under `website/`;
- synchronized system and coding-agent instructions;
- node, route, capability and room schemas;
- physical topology and hardware inventory;
- USB-C Android/Windows inspection procedure;
- acoustic baseline procedure;
- decision record for the first phone-audio transport;
- static preview deployment configuration.

Done when every agent entrypoint names the local-first rule, the hardware topology is documented, no document claims digital phone bridging has already been proven, and the repository contains a truthful implementation path.

## Phase 0B — Buildable control-plane and OBS proof

Follow `START_BUILD_HERE.md`.

Deliver:

- pnpm workspace and root verification scripts;
- strict shared contracts;
- deterministic room, phone and AI-node simulator;
- Sol Fabric local HTTP/WebSocket service;
- browser operator console;
- typed OBS WebSocket adapter plus mock adapter;
- generated Sol Room scene templates and overlays;
- phone-adapter interface with deterministic simulator;
- semantic command handlers suitable for web and MCP;
- emergency-silence state and tests;
- diagnostics bundle command;
- CI for lint, typecheck, tests and build.

Demonstration: a simulated phone, local human and simulated AI appear in the room; OBS or its deterministic adapter changes scenes; emergency silence removes agent/media speak capability; restarting the UI or OBS adapter restores authoritative state.

Done when a new developer can clone, install, run and verify the deterministic room without hardware or paid model services.

Exclusions:

- no production virtual audio driver;
- no claim that Phone Link audio works;
- no Phone Link clone;
- no native OBS plugin beyond a gated scaffold;
- no Twilio, SIP or metered realtime core;
- no coordinate-only automation.

## Phase 1 — Desktop media bridge

Prove clean bidirectional audio between two ordinary Windows/browser applications and integrate the result into the external OBS proof.

Deliver media graph, source/destination abstractions, app/process output capture where supported, virtual/test endpoints, operator monitor, mix-minus, input/output/all mute, emergency silence, one AI-app + one meeting-app scene, latency and feedback diagnostics.

Demonstration: a person in a desktop meeting speaks with an existing AI voice app; the AI is heard in the meeting; the operator hears and speaks with both; no node receives itself; OBS shows verified room state; no model API is required.

## Phase 2 — Phone Link control adapter

Deliver:

- Windows UI Automation inspector;
- semantic Phone Link adapter;
- phone/connectivity state model;
- call preview, start, answer, mute and end workflows;
- post-action verification;
- version-tolerant selectors and diagnostics;
- supervised computer-use fallback only when UI Automation cannot expose a control.

The adapter controls Phone Link but does not own audio routing.

Done when approved call-state actions can be executed and verified on the test machine without blind coordinate clicking. Media remains separately gated by Phase 3.

## Phase 3 — Native phone audio transport

Test, in order:

1. Phone Link process-specific or communications-endpoint capture;
2. Phone Link acceptance of a temporary virtual microphone;
3. wired bidirectional USB-C headset/audio bridge;
4. dedicated Bluetooth HFP bridge hardware;
5. network audio for calls owned by a Sol Link companion flow;
6. acoustic fallback.

Select transport from measured capability, latency, echo, reliability and app compatibility—not preference.

Demonstration: a native cellular or supported app call is digitally connected to one AI voice app and one local human with mix-minus, monitoring, privacy controls and emergency silence.

## Phase 4 — Sol Room native OBS plugin

Only after the external OBS proof passes, implement `specs/obs-plugin.md`.

Deliver a native Sol Room dock, authenticated Sol Fabric client, accurate room/participant/health state, scene control and the first proven custom sources or overlays.

OBS restart or failure must not terminate a human call or become the authoritative room-state store.

## Phase 5 — Sol Link Android control plane

Deliver pairing, contact search, selected-SIM SMS preview/commit, native dial/call policy, device notifications/media/navigation adapter interfaces, signed expiring idempotent commands, phone confirmations and `solctl`.

Done when a confirmed SMS sends exactly once through the phone's SIM, a native trusted call opens/starts under policy, unknown destinations require phone confirmation, and no Twilio Voice/SMS is used.

## Phase 6 — Multi-agent room

Deliver 1–16+ isolated channels, routing matrix, scenes, floor ownership, human interruption priority, bounded AI-to-AI turns, private whisper/talkback, humans-only and emergency silence.

Demonstration: Sol and Gemini can hold a bounded two-turn exchange while Josh can interrupt instantly; another agent may work privately without joining audio.

## Phase 7 — Shared visual stage and work buses

Deliver screen/window/camera/phone sources, shared stage, authorised viewer routes, structured artifact context, agent roles, workstream status, private critique and artifact publication.

Demonstration: Gemini edits a visual, Claude reviews privately, Codex builds a preview and the room presents the resulting artifact while conversation continues.

## Phase 8 — Sol Room Edge

Deliver Pi/embedded room controller for discovery, state replication, physical mute/privacy, device supervision, scene recall, local wake/activity detection, lightweight moderation and diagnostics.

## Phase 9 — Sol Presence

Deliver clearly labelled avatars, channel-driven lip sync/presence states, spatial audio and physical/virtual seating. Identity cloning requires explicit consent.

## Phase 10 — Enterprise and optional cloud fallbacks

Deliver fleet management, identity/policy, audit/retention, deployment tooling, local model/GPU integration and—only when explicitly assigned—cloud/SIP/API fallback adapters.

## Parallel-agent rule

Parallel Codex worktrees are allowed only after shared contracts and the Phase 0B scaffold exist. Recommended lanes are contracts/state, OBS, Windows/Phone Link lab, room UI, and verification/infrastructure. No lane may privately redefine shared contracts.

## Final rules

- A later phase may not replace a difficult earlier phase.
- Virtual-device/local mode remains the canonical product.
- Hardware claims require real evidence.
- Mocks remain visibly labelled.
- OBS is not the authoritative audio or call-continuity process.
- Semantic APIs and UI Automation precede computer-use fallback.
- Every phase ends with exact commands, tests, demonstrations, limitations and remaining manual steps.

## First Codex instruction

```text
You are starting the Sol Room implementation on branch agent/sol-room-vision-site.

Read START_BUILD_HERE.md and every file in its mandatory read order.
Implement Phase 0B only: the buildable control-plane scaffold and deterministic
OBS/phone room simulation.

Do not implement a production audio driver, do not claim Phone Link media is
working, and do not introduce Twilio, SIP or metered realtime APIs.

Use the external OBS WebSocket adapter before a native plugin. Scaffold the
native plugin directory only if the external proof and tests pass.

Run pnpm install, lint, typecheck, test and build. Return the exact commands,
results, files changed, screenshots or traces produced, and remaining hardware
checks. Commit the completed coherent slice on a new agent branch.
```
