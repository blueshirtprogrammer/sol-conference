# Sol Room — Master Product and Technical Specification

## 1. Product definition

Sol Room is a local-first, vendor-neutral multimodal operating environment. It connects humans, native phone calls, communication apps, media, screens, subscribed AI voice applications, local models and working agents through standard virtual-device interfaces.

The commercial product is the room, routing, control, privacy, installation and work orchestration layer—not a resale of one model or an always-metered API conference.

## 2. Product family

- **Sol Link:** Android phone/device gateway for contacts, native SIM calls, SMS, notifications, navigation and media.
- **Sol Fabric:** low-latency virtual audio/video routing engine and device graph.
- **Sol Room:** human + AI meeting environment, shared stage, roles, floors and private channels.
- **Sol Work:** coding, design, research and business agents producing real artifacts while the room continues.
- **Sol Presence:** clearly identified AI avatars, spatial audio and embodied room identity.
- **Sol Room Edge:** Raspberry Pi/Compute Module-class always-on appliance controller.

## 3. Non-negotiable architecture

### Core local path

```text
Phone / meeting / microphone / media / screen
                    ↓
          Sol Fabric node graph
                    ↓
Virtual microphones, speakers, cameras and displays
                    ↓
Existing AI apps, humans and working applications
```

Existing AI applications connect the same way they connect to ordinary hardware: microphone, speaker, camera, screen and UI. The first implementation must not require OpenAI Realtime, Twilio, SIP or metered speech APIs.

### Optional later fallback

Cloud telephony, SIP and model APIs may be added for unattended calls, PC-off operation or enterprise provider agreements. They must remain adapters behind the same room/node contracts and cannot replace the local MVP.

## 4. Canonical node model

Every participant, device, application or artifact is a node.

```ts
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

type Capability = "hear" | "speak" | "see" | "act" | "share";

type NodeState = {
  audio: "connected" | "muted" | "isolated" | "unavailable";
  visual: "watching" | "presenting" | "private" | "none";
  tools: "connected" | "restricted" | "executing" | "none";
  work: "idle" | "working" | "blocked" | "ready";
};
```

Audio/media participation never automatically grants tools. A voice app may hear and speak but have no computer control. A coding agent may work privately without joining the spoken floor.

## 5. Canonical buses

### Audio bus

Carries phone callers, humans, AI voices, meetings and media. Required functions:

- explicit source-to-destination routes;
- per-node input mute, output mute, complete mute and solo;
- mix-minus for every node;
- operator monitor and private talkback;
- voice activity and speaker state;
- floor ownership and bounded AI turns;
- emergency silence and humans-only scene;
- latency, level, clipping and feedback diagnostics.

### Visual bus

Carries desktop screens, individual windows, phone displays, cameras, presentations, designs, documents and live previews. Agents receive only sources they are authorised to see.

### Room bus

Carries participant identity, role, AI disclosure, scene, speaker state, floor, privacy, permissions and shared-stage selection.

### Agent bus

Carries structured prompts, selected context, tool calls, delegation, private critique and task status. It is separate from the spoken audio bus.

### Artifact bus

Carries slides, reports, designs, source branches, live previews, documents, decisions, tasks and completed work back into the room.

## 6. First digital bridge

The known acoustic baseline is:

```text
remote caller → phone speaker → laptop microphone → AI
AI speaker → phone microphone → remote caller
Josh speaks and hears both
```

The digital MVP replaces the room acoustics:

```text
call/meeting RX → Sol Fabric → AI virtual microphone
AI isolated process output → Sol Fabric → call/meeting TX
Josh microphone → call and optional AI input
call + AI → Josh monitor
```

Self-routes are forbidden. The caller must not receive their own delayed audio. The AI must not hear its own output. The operator must have immediate emergency mute.

## 7. Virtual device surface

Target Windows endpoints:

```text
Sol Room — Agent 1 Microphone
Sol Room — Agent 1 Speaker
Sol Room — Agent 2 Microphone
Sol Room — Agent 2 Speaker
Sol Room — Phone Input
Sol Room — Phone Output
Sol Room — Meeting Microphone
Sol Room — Meeting Speaker
Sol Room — Operator Monitor
Sol Room — Shared Camera
```

Applications with device selectors use these directly. Applications without selectors use supported per-application Windows routing. Initial experiments may use validated third-party virtual cables, but the production target is an owned Windows virtual-audio driver and media engine.

## 8. Phone architecture

### Control plane

Sol Link is a private Android companion using encrypted Wi-Fi/mobile data as its primary command channel. It provides:

- device pairing and revocation;
- contact search;
- SMS preview and confirmed send through the selected SIM;
- native dial/open-call actions under policy;
- call and device state where the platform exposes it;
- notifications, navigation and media adapters;
- signed, expiring, device-bound, idempotent commands;
- phone-level confirmation for unknown or risky destinations.

Bluetooth is primarily an audio/nearby transport. USB is for experiments, development, charging and wired audio accessories. A plain USB-C data cable must not be assumed to expose protected call audio.

### Audio transport candidates

Test in this order and select from evidence:

1. Windows Phone Link compatibility path;
2. wired bidirectional USB-C headset/audio bridge;
3. dedicated Bluetooth HFP headset bridge hardware;
4. network audio for calls owned by a Sol Link/WebRTC companion flow;
5. acoustic speakerphone baseline.

A normal Android app cannot be assumed to capture protected cellular or third-party communication audio. The universal solution is to appear to the phone as a communication headset and route that bidirectional audio into Sol Fabric.

## 9. Multi-agent room

The room supports 1–16+ independently isolated channels. Examples:

- Sol / ChatGPT Voice;
- Gemini Voice;
- Claude Voice;
- Google Assistant or another phone AI;
- a Raspberry Pi/local-model voice node;
- Josh and other in-room humans;
- remote callers;
- Zoom/Meet/Teams;
- desktop media.

Required controls:

- mute input/output/all;
- solo;
- conference all or selected;
- private whisper/talkback;
- give humans privacy;
- assign/request/lock floor;
- remove a node without closing its application;
- emergency silence;
- reusable scenes.

AI-to-AI conversation must be bounded by maximum autonomous turns, targetable wake names, floor arbitration and human interruption priority.

## 10. Shared visual stage

The live room contains one shared stage that can display:

- slides;
- Figma/wireframes;
- code preview;
- browser or application window;
- phone screen;
- document or spreadsheet;
- camera or composed scene.

Agents should receive both the authorised visual feed and structured artifact metadata when available. Private terminals, credentials and sensitive client data are not automatically shared.

## 11. Working-agent model

A room may assign hats such as:

- chair/presenter;
- marketing lead;
- visual designer;
- technical architect;
- developer;
- researcher;
- critic/supervisor;
- translator;
- note taker;
- accessibility reviewer.

Example product room:

1. Josh and a client discuss a requirement.
2. Sol chairs and extracts outcomes.
3. Gemini produces wireframes or operates slides.
4. Claude privately reviews architecture and risk.
5. Codex or Claude Code implements a real branch.
6. The live preview appears on the shared stage.
7. Humans and agents review it before the meeting ends.

Work status must remain distinct from voice status.

## 12. Raspberry Pi / edge appliance

Sol Room Edge may manage:

- discovery and pairing;
- room state and scene recall;
- USB/Bluetooth device supervision;
- physical mute and privacy buttons;
- voice activity/wake words;
- lightweight transcription/speaker identity;
- floor moderation;
- status display and LEDs;
- optional small local models.

The Pi is the chairman, not necessarily the heavyweight inference machine. Larger local models may run on a connected workstation or GPU server.

## 13. Avatar and presence layer

Any audio channel may drive a labelled AI avatar. Presence states include listening, speaking, working privately, ready to present, muted and disconnected.

Photorealistic or cloned identities require explicit consent and visible AI labelling. The avatar layer consumes the existing channel audio and room state; it must not be a mandatory extra language-model call.

## 14. User interface

Primary desktop layout:

```text
Shared stage                         Participant channels
slides / screen / preview            humans / phone / AI / agents

Workstreams                          Room controls
Gemini designing                     humans only
Claude reviewing                     conference selected
Codex building                       emergency silence
```

Every channel shows separately:

- connection;
- hear/speak routes;
- visual access;
- tools;
- work state;
- floor state.

The routing matrix must be inspectable. Simplified scenes hide complexity for normal users. Accessibility target is WCAG 2.2 AA with keyboard operation, screen-reader state, reduced motion, high contrast and 200% zoom.

## 15. Security and trust

- AI participants are visibly identified.
- Recording is off by default and separately disclosed.
- Personal data and credentials never enter source control.
- Commands are signed, expiring, idempotent and audited.
- Unknown recipients require device confirmation.
- Emergency, premium and international numbers are not automatically dialled.
- Humans-only and emergency silence work locally without cloud dependency.
- Media access does not imply tool access.
- The system does not impersonate a person or automate identity verification.

## 16. Commercial model

### Personal

One desktop, one linked phone, up to four AI/media channels, local scenes and basic screen sharing.

### Pro room

Pi/embedded controller, 8–16 channels, physical controls, phone/headset bridge, multiple displays/cameras, local moderation and managed room profiles.

### Enterprise

Multi-room fleet, identity and policy, audit/retention, local models/GPU integration, custom workflows, installation, training and support.

Revenue comes from software, hardware, deployment, room engineering, workflows, management and support. Customers connect their own appropriately licensed subscriptions, enterprise seats, local models or approved APIs.

## 17. Priority use cases

- real-estate/building package discovery during channel-partner calls;
- executive/end-of-year reviews with live slides and dashboard construction;
- product discovery rooms where design and code appear in real time;
- multilingual supplier meetings;
- family/accessibility support calls;
- sales and customer workshops;
- training rooms and conference centres;
- technical, legal and financial review rooms;
- media analysis and live presentations.

## 18. Build phases

1. Canonical website, specs and USB-C capability lab.
2. Desktop software bridge between two ordinary applications.
3. Sol Link Android control plane for contacts/SMS/native calls.
4. Universal native-phone audio transport.
5. Multi-agent audio room and scene manager.
6. Shared visual stage and working-agent/artifact buses.
7. Pi-powered room appliance.
8. Presence/avatar layer.
9. Enterprise management and optional cloud fallback adapters.

## 19. First definition of done

The first real demonstration must show:

- one ordinary meeting/call source;
- one existing AI voice application using a normal virtual microphone/speaker;
- one local human with monitor and microphone;
- clean two-way conversation;
- no node hearing itself;
- immediate emergency mute;
- no model speech/realtime API required;
- recorded audio/state evidence and documented limitations.
