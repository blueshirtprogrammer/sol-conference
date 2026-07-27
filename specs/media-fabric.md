# Sol Fabric Media Specification

## Objective

Expose stable local media endpoints and route supported sources to selected destinations without feedback.

## Operations

```text
node.discover
node.attach
node.detach
route.create
route.update
route.remove
scene.apply
gain.set
mute.input
mute.output
mute.all
solo.monitor
talkback.start
talkback.stop
safety.humans_only
safety.emergency_silence
diagnostic.loopback
```

## Source kinds

Physical/virtual microphones and speakers, application/process render output, meeting application, phone transport, network audio, media player, screen/window, camera and artifact renderer.

## Phase 1 DSP

- gain and channel mapping;
- resampling and buffering;
- mix-minus;
- mute and monitor;
- latency measurement;
- clipping detection.

Later DSP may include measured acoustic echo cancellation, noise suppression, AGC, VAD, ducking and spatial audio. Do not claim AEC until verified with a documented measurement.

## Mix-minus

For participant `P`:

```text
mix(P) = all permitted sources - P.output
```

An AI application's output is blocked from every route returning to that application's virtual microphone.

## Feedback protection

- reject direct self-route;
- detect short cycles;
- bound AI turns;
- emergency silence bypasses scene state;
- process capture excludes Sol Fabric monitor output;
- notifications and unrelated desktop sounds remain private by default.

## Target endpoints

```text
Sol Room — Agent 1 Microphone / Speaker
Sol Room — Agent 2 Microphone / Speaker
Sol Room — Phone Input / Output
Sol Room — Meeting Microphone / Speaker
Sol Room — Operator Monitor
Sol Room — Talkback
Sol Room — Shared Camera
```

Existing virtual-audio software may be used for proof. The architecture must allow an owned signed Windows driver later.

## Visual graph

A visual source may provide pixels plus structured accessibility/artifact metadata, URL/branch/document identity, selected slide/object and permission scope. The shared stage records active source and presenter.
