# Sol Room — Canonical Vision

## One-sentence definition

Sol Room is a local-first, vendor-neutral multimodal operating environment where humans, phones, media, AI voice applications and working agents can hear, see, speak and produce real artifacts together through standard virtual-device interfaces.

## The category

Sol Room combines five ideas:

1. **Sol Link** — the phone and device gateway.
2. **Sol Fabric** — virtual audio, video, screen and input routing.
3. **Sol Room** — the live human + AI meeting environment.
4. **Sol Work** — tool-using agents that create slides, designs, code, documents and actions while the meeting continues.
5. **Sol Presence** — agent identity, avatars, spatial audio and physical room embodiment.

## The originating proof

A normal phone is placed on speaker beside a laptop running an AI voice conversation.

- the remote caller speaks;
- the laptop microphone hears the caller;
- the AI hears and responds;
- the phone microphone hears the AI;
- the remote caller, local human and AI can all participate.

That acoustic proof already works. The first product goal is to replace the air gap with a reliable digital bridge.

## The core insight

AI applications already expose microphone input, speaker output, camera/screen access, browser or desktop UI, subscription-funded intelligence and optional computer-use/coding capabilities.

Phones already expose SIM calls, contacts, SMS, communication applications, notifications, navigation, media and headset routes.

Sol Room does not replace these systems. It connects and orchestrates them.

## Product rule

The default product must not depend on OpenAI Realtime, model speech APIs, SIP trunks, Twilio Voice/SMS, per-minute cloud conferences or a proprietary integration with one AI vendor.

Those are optional adapters for unattended or off-device operation.

The default local experience uses:

- AI apps and subscriptions the user already has;
- phones and mobile plans the user already has;
- virtual audio/video devices;
- per-application capture;
- local routing and moderation;
- direct Android commands for SIM calls and SMS;
- local or connected coding/design agents for work.

## The room primitive

Every participant or source is a node with five independently controlled capabilities:

- **HEAR** — audio destinations it receives;
- **SPEAK** — audio destinations it can reach;
- **SEE** — visual sources it can inspect;
- **ACT** — tools and systems it may operate;
- **SHARE** — artifacts it may publish into the room.

Nodes include humans, phone callers, AI voice apps, local models, Raspberry Pi agents, coding agents, browser tabs, meeting apps, media players, microphones, cameras, screens and artifacts.

## The five buses

### Audio bus

Voice, calls, media, private talkback and monitoring with source routing, mix-minus, floor control, echo protection and emergency silence.

### Visual bus

Screens, windows, phone displays, cameras, slides, documents, Figma canvases and composed scenes.

### Room bus

Identity, roles, speaker state, floor ownership, scene, privacy, permissions and shared-stage state.

### Agent bus

Structured prompts, selected transcript context, tool calls, private critiques and delegation between working agents.

### Artifact bus

Code branches, live previews, slide decks, designs, reports, documents, decisions and action items returned to the room.

## The appliance

A Raspberry Pi 5 or Compute Module-class device can act as the always-on edge chairman for device discovery, room state, USB/Bluetooth supervision, wake words, speaker activity, floor moderation, physical privacy controls, lightweight transcription and status display.

It does not need to run every heavyweight model. Phones, desktop applications and local GPU systems can supply intelligence.

## Commercial position

We sell software, the virtual-device fabric, room-controller hardware, installation, audio engineering, organisational workflows, agent roles, integrations, fleet management, training, support, privacy and governance.

Customers connect properly licensed AI applications, enterprise seats, local models or approved APIs. The product is not sold as a way to evade provider limits or resell one consumer account.

## First proof

> Route one real call or meeting source into one existing AI voice application's microphone, route that application's isolated output back into the call, let a local human hear and speak with both, and provide an immediate emergency mute.

Every later product is an additional node, destination, scene or tool on that same fabric.
