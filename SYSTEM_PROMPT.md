# SYSTEM_PROMPT.md — Sol Room Repository System Instruction

You are working on **Sol Room**, a local-first, vendor-neutral multimodal operating environment created to connect humans, phones, media and independently licensed AI applications through standard virtual-device interfaces.

This document is the highest-order repository instruction. When another document conflicts with it, this document wins.

## Product truth

The core product is not a Twilio conference, SIP service, OpenAI Realtime client or metered multi-agent API orchestration system.

The core product is:

1. a local virtual audio/video device fabric;
2. a secure phone/device control plane;
3. a human-controlled room state and routing graph;
4. a working-agent and artifact coordination layer;
5. an optional Raspberry Pi-powered room appliance.

Existing AI applications and subscriptions connect as ordinary microphone, speaker, camera, screen or browser nodes. Local models and properly licensed APIs may also connect.

## Highest-order technical rule

Build the local path before any cloud fallback.

The canonical dependency order is:

```text
Windows/local audio-video fabric
    → desktop meeting bridge
    → Android phone control
    → universal phone headset transport
    → multi-agent rooms and visual stage
    → Pi room appliance
    → optional cloud/SIP/API adapters
```

A coding agent must not begin with SIP, Twilio, OpenAI Realtime, telephony APIs or a hosted conference service unless explicitly implementing the optional fallback phase.

## Mandatory boundaries

### MUST

- treat every human, app, phone, model and media source as a node;
- model HEAR, SPEAK, SEE, ACT and SHARE permissions separately;
- provide explicit source-to-destination routing;
- implement mix-minus so nodes never receive their own delayed output;
- provide emergency silence and humans-only privacy states;
- keep audio/video participation separate from tool permission;
- support the user's existing AI subscription applications through normal device interfaces;
- support local models without requiring cloud inference;
- use the phone's native SIM, dialler, SMS, contacts and call applications where possible;
- keep personal data, phone numbers, credentials and transcripts out of git;
- make AI identity visible;
- require human confirmation for outward actions according to trust policy;
- build in phases and verify each phase with evidence.

### MUST NOT

- make Twilio, SIP or metered voice APIs the default architecture;
- claim that a plain USB cable automatically exposes cellular-call audio;
- claim that a normal Windows app can automatically act as a Bluetooth HFP headset without validating the transport;
- claim official programmatic control over consumer AI voice interfaces where none exists;
- route one AI's output back into its own microphone;
- allow unbounded AI-to-AI speech loops;
- infer that audio access grants phone, browser or computer control;
- automate emergency, premium or international calling;
- bypass provider licensing, account limits or product terms;
- hide that a photoreal avatar is AI;
- leave placeholder success paths, unimplemented production routes or unverifiable claims.

## Canonical product names

- **Sol Link** — phone and device gateway.
- **Sol Fabric** — virtual audio/video/source routing engine.
- **Sol Room** — live meeting and shared-stage environment.
- **Sol Work** — tool-using agents and artifact production.
- **Sol Presence** — avatars, spatial presence and embodied room identity.
- **Sol Room Edge** — Raspberry Pi/embedded room controller.

## Canonical buses

- Audio bus
- Visual bus
- Room bus
- Agent bus
- Artifact bus

Do not collapse these into one vague “AI conference” abstraction.

## Media versus work

An AI application can be connected to the audio room and have no tools.

A coding agent can be working privately and have no spoken room output.

The UI and state model must show these independently:

```text
Audio: connected | muted | isolated | unavailable
Visual: watching | presenting | private | none
Tools: connected | restricted | executing | none
Work: idle | working | blocked | ready
```

## Phase discipline

Read, in order:

1. `SYSTEM_PROMPT.md`
2. `VISION.md`
3. `SOL_ROOM_MASTER_SPEC.md`
4. `AGENTS.md`
5. `CODING_AGENT_PROMPT.md`
6. `CODEX_PROJECT.md`
7. `lab/USB_C_PHONE_LAB.md`
8. `pitch/`

Existing telephony-first documents under `specs/` are superseded wherever they conflict with this instruction or `SOL_ROOM_MASTER_SPEC.md`. They may only be used as reference for a later optional cloud-fallback phase.

Do not implement a later phase to avoid completing a difficult earlier one.

Each phase ends with:

- working demonstration;
- tests;
- limitations recorded;
- screenshots or diagnostics where relevant;
- no unsupported claims;
- verification report committed to the repository.

## Current objective

The repository's current product objective is the local-first proof:

> one call or meeting source, one existing AI voice application, one local human, clean bidirectional routing, mix-minus, monitoring and emergency mute.

The website under `website/` is the canonical visual explanation of the product and must remain aligned with these instructions.
