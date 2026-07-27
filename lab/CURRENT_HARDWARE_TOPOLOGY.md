# Current Sol Room Hardware Topology

This file is the canonical lab-path entrypoint referenced by the agent read order. It aligns with `specs/current-hardware-lab.md` and does not claim that the digital phone-audio bridge has passed.

## Reported inventory — verification still required on the machines

- Windows 11 laptop with built-in microphone/speakers and Simplecom dock;
- Windows 11 desktop/work node;
- Raspberry Pi 5, 8 GB;
- Android phone and iPhone;
- two 65-inch Google TVs;
- router and wired Ethernet.

## Assigned roles

```text
Windows laptop  -> live-media node: Phone Link, VoiceMeeter, AI voice app, OBS
Windows desktop -> work/artifact node: builds, agents, diagnostics, optional encoding
Raspberry Pi 5  -> room-state/health coordinator; not the first audio mixer
TV 1            -> SOL STAGE; audio muted during first bridge tests
TV 2            -> SOL WORK WALL
Android/iPhone  -> native SIM/call authority; no generic USB call-audio assumption
```

## Network

Use the router as the first shared LAN. A direct laptop-to-desktop link is optional and must not replace the stable router-facing connection without an explicit adapter plan.

## First transport under test

Microsoft Phone Link is the first native-cellular control and audio candidate. VoiceMeeter Banana is the temporary B1/B2 matrix. OBS is the visual compositor. Sol Fabric remains the future authoritative room, policy and emergency-control process.

## Evidence gate

Do not claim the phone bridge works until the actual Windows endpoints, Phone Link microphone acceptance, caller/AI hearing, mix-minus, latency, restart and emergency-silence behaviour have been observed and recorded.
