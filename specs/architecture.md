# Architecture — Sol Room Local-First System

## Context

```text
AI voice apps / meeting apps / media / local models
                 ↕ ordinary device interfaces
        Sol Fabric on desktop/workstation
     audio · visual · room · agent · artifact buses
             ↕ commands and transports
 Android phones · Pi edge · USB/HFP bridges · room hardware
```

## Core processes

### Sol Desktop

Owns media discovery, local routing graph, operator monitor/talkback, per-application capture adapters, virtual endpoints, room UI and diagnostics.

### Sol Link Android

Owns trusted pairing, contacts, native SIM SMS, native dial/call intents, notifications, navigation/media adapters, phone confirmations and command results. It does not claim unrestricted capture of other applications' call audio.

### Sol Room Edge

Owns always-on room state, hardware discovery, physical mute/scene controls, lightweight moderation, wake/VAD/speaker activity, watchdog and offline privacy policy.

### Room service

Owns nodes, routes, scenes, roles, floors, private channels, workstreams, artifacts and the event ledger. It may initially run inside Sol Desktop and later move to Edge.

## Node and route

```ts
type Node = {
  id: string;
  kind: "human" | "phone" | "ai-app" | "working-agent" | "local-model" |
        "meeting-app" | "media" | "screen" | "camera" | "artifact" | "room-device";
  label: string;
  presence: "offline" | "available" | "connected" | "degraded";
  capabilities: { hear: boolean; speak: boolean; see: boolean; act: boolean; share: boolean };
};

type Route = {
  id: string;
  sourceNodeId: string;
  destinationNodeId: string;
  media: "audio" | "video" | "screen" | "artifact";
  state: "routed" | "isolated" | "muted" | "unavailable";
  gainDb?: number;
  sceneId?: string;
};
```

Audio self-routes are invalid. The graph validator also rejects short feedback cycles.

## Media buses

- Program bus — what public/remote participants hear.
- Per-agent input buses — isolated mix-minus for each AI application.
- Human monitor — what the operator hears.
- Talkback — operator-to-selected-node private speech.
- Media bus — deliberately shared desktop/phone content.
- Safety bus — humans-only and emergency silence.
- Shared stage — selected visual/artifact source.

## Agent and artifact separation

Working agents receive structured, scoped tasks and authorised artifacts. They do not inherit unrestricted room audio, visuals or tools.

## Floor state

```ts
type FloorState = {
  ownerNodeId?: string;
  queue: string[];
  maxAgentTurnsWithoutHuman: number;
  humanInterruptsImmediately: boolean;
  agentLoopState: "allowed" | "paused" | "blocked";
};
```

## Transport separation

Control and media are independent.

Control candidates: authenticated LAN WebSocket, hosted relay, FCM/HTTPS and USB/ADB for development.

Phone-audio candidates: Phone Link compatibility, wired bidirectional headset bridge, dedicated HFP bridge, controlled companion-app network audio, and the acoustic baseline.

A plain USB cable is not a phone-audio transport without evidence.

## Cloud fallback

Optional SIP/PSTN and hosted model adapters may support unattended/PC-off operation later. They cannot alter the local-first room model or become the MVP dependency.
