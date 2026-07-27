# CODEX_PROJECT.md — Sol Room Goals, Phases and Verification Loops

## Product outcome

Create a local-first room fabric where users connect humans, phone calls, existing AI voice applications, media, screens and working agents; explicitly control who hears, speaks, sees, acts and shares; and produce real artifacts while the conversation continues.

## Phase loop

Every phase follows:

1. **Observe** actual device and operating-system behaviour.
2. **Specify** exact interfaces, constraints and expected state.
3. **Simulate** with a deterministic loopback harness.
4. **Implement** the smallest real vertical slice.
5. **Verify** with tests, traces, screenshots and hardware evidence.
6. **Refine** the specification with what was proven.
7. **Commit** one coherent phase and a truthful report.

## Phase 0 — Canonical vision and hardware lab

Deliver:

- canonical website under `website/`;
- synchronized system and coding-agent instructions;
- node, route, capability and room schemas;
- USB-C Android/Windows inspection procedure or utility;
- acoustic baseline record;
- decision record for the first phone-audio transport;
- static preview deployment.

Done when the website runs without external model services, every agent entrypoint names the local-first rule, USB-C/Phone Link tests save a diagnostic bundle, and no document claims digital phone bridging has already been proven.

## Phase 1 — Desktop software bridge

Prove clean bidirectional audio between two ordinary Windows/browser applications.

Deliver media graph, source/destination abstractions, app/process output capture where supported, virtual/test endpoints, operator monitor, mix-minus, input/output/all mute, emergency silence, one AI-app + one meeting-app scene, latency and feedback diagnostics.

Demonstration: a person in a desktop meeting speaks with an existing AI voice app; the AI is heard in the meeting; the operator hears and speaks with both; no node receives itself; no model API is required.

## Phase 2 — Sol Link Android control plane

Deliver pairing, contact search, selected-SIM SMS preview/commit, native dial/call policy, device notifications/media/navigation adapter interfaces, signed expiring idempotent commands, phone confirmations and `solctl`.

Done when a confirmed SMS sends exactly once through the phone's SIM, a native trusted call opens/starts under policy, unknown destinations require phone confirmation, and no Twilio Voice/SMS is used.

## Phase 3 — Universal phone audio transport

Test, in order:

1. Phone Link compatibility;
2. wired bidirectional USB-C headset/audio bridge;
3. dedicated Bluetooth HFP bridge hardware;
4. network audio for calls owned by a Sol Link companion flow;
5. acoustic fallback.

Select transport from measured capability, latency, echo, reliability and app compatibility—not preference.

Demonstration: a native phone or WhatsApp call is digitally connected to one AI voice app and one local human with headphones, mix-minus and privacy controls.

## Phase 4 — Multi-agent room

Deliver 1–16+ isolated channels, routing matrix, scenes, floor ownership, human interruption priority, bounded AI-to-AI turns, private whisper/talkback, humans-only and emergency silence.

Demonstration: Sol and Gemini can hold a bounded two-turn exchange while Josh can interrupt instantly; another agent may work privately without joining audio.

## Phase 5 — Shared visual stage and work buses

Deliver screen/window/camera/phone sources, shared stage, authorised viewer routes, structured artifact context, agent roles, workstream status, private critique and artifact publication.

Demonstration: Gemini edits a visual, Claude reviews privately, Codex builds a preview and the room presents the resulting artifact while conversation continues.

## Phase 6 — Sol Room Edge

Deliver Pi/embedded room controller for discovery, state, physical mute/privacy, device supervision, scene recall, local wake/activity detection, lightweight moderation and diagnostics.

## Phase 7 — Sol Presence

Deliver clearly labelled avatars, channel-driven lip sync/presence states, spatial audio and physical/virtual seating. Identity cloning requires explicit consent.

## Phase 8 — Enterprise and optional cloud fallbacks

Deliver fleet management, identity/policy, audit/retention, deployment tooling, local model/GPU integration and—only when explicitly assigned—cloud/SIP/API fallback adapters.

## Final rules

- A later phase may not replace a difficult earlier phase.
- Virtual-device/local mode remains the canonical product.
- Hardware claims require real evidence.
- Mocks remain visibly labelled.
- Every phase ends with exact commands, tests, demonstrations, limitations and remaining manual steps.

## First Codex instruction

```text
Read SYSTEM_PROMPT.md, VISION.md, SOL_ROOM_MASTER_SPEC.md, AGENTS.md, CODING_AGENT_PROMPT.md, CODEX_PROJECT.md and lab/USB_C_PHONE_LAB.md.

Implement and verify Phase 0 only. Do not start Phase 1. Do not introduce Twilio, SIP, OpenAI Realtime or another metered voice pipeline as the core architecture.
```
