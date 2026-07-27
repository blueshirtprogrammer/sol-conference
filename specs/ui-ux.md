# UI and User Experience — Sol Room

The canonical visual reference is `website/index.html`.

## Product character

- premium communications instrument;
- legible at room distance;
- calmer than OBS and simpler than a broadcast console;
- vendor-neutral;
- visible human control;
- deep diagnostics available without contaminating ordinary use.

## Primary views

### Home

Start/resume a room, show connected phones/edge devices, recent scenes, first-proof launcher and current privacy state.

### Live Room

- shared stage;
- participant channels;
- separate audio, visual, tool and work state;
- workstreams;
- room health;
- scene presets;
- humans-only and emergency silence.

### Routing Matrix

Source rows and destination columns, locked self-routes, explicit routed/isolated/muted states, audio/visual tabs and keyboard-operable switches.

### Device Link

Paired phones/edge devices, selected SIM, contact permissions, command queue, call/SMS status, USB/LAN/Bluetooth transport state and diagnostics.

### Agent Setup

Select app/process, virtual input/output, role, permitted audio/visual sources, separate tool adapter, loopback test and saved agent slot.

### Scene Builder

Select participants, program/monitor/private buses, shared-stage source, floor policy, AI turn limit and physical privacy behaviour.

### Diagnostics

Actual OS devices, sample rates, channel count, route graph, loopback level, latency, clipping, cycle detection, phone transport state and redacted logs.

## Mandatory live controls

Always visible:

- Mute all AI;
- Humans only;
- Emergency silence;
- Private operator channel;
- Current floor;
- Active stage;
- Room health.

## Channel status

Display independently:

```text
Audio: Connected / Listening / Speaking / Muted / Isolated
Visual: Watching / Presenting / Private / None
Tools: Connected / Restricted / Executing / None
Work: Idle / Working / Blocked / Ready
```

Do not use one vague “online” badge.

## Room-distance mode

Increase text, participant tiles, active speaker indicator, privacy state and physical-control confirmation.

## Avatar requirements

- AI label remains visible;
- speaking follows actual channel audio;
- private/work states are not portrayed as fake human emotion;
- consent is required for a real-person likeness;
- avatar may be disabled without affecting audio or work.

## Accessibility

Target WCAG 2.2 AA, 48px controls, keyboard operation, screen-reader route/room announcements, reduced motion, high contrast and 200% zoom.
