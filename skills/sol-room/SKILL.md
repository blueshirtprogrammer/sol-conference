---
name: sol-room
description: Build, test, review or operate the Sol Room local-first virtual audio/video/device fabric, Android phone gateway, multi-agent rooms, visual stage, working-agent orchestration, Pi edge appliance and optional presence layer.
---

# Sol Room Skill

## Trigger

Use this skill for any task involving this repository, Sol Link, Sol Fabric, Sol Room, Sol Work, Sol Presence or Sol Room Edge.

## Mandatory context

Read:

1. `/SYSTEM_PROMPT.md`
2. `/VISION.md`
3. `/SOL_ROOM_MASTER_SPEC.md`
4. `/AGENTS.md`
5. `/CODING_AGENT_PROMPT.md`
6. `/CODEX_PROJECT.md`
7. `/lab/USB_C_PHONE_LAB.md`

## Highest-order decision

The core is a local virtual-device and room-orchestration fabric. Do not make Twilio, SIP, OpenAI Realtime or metered model voice APIs the default architecture. Cloud adapters are optional later fallbacks.

## Media rules

Treat every human, app, phone, model, screen and media source as a node. Create explicit routes. Apply mix-minus. Reject self-routes and short feedback cycles.

## Tool rules

Audio/video participation does not grant tool access. Tool adapters and permissions are separate.

## Phone rules

Use the Android phone's native SIM, contacts, dialler and SMS through Sol Link. Do not claim ordinary Android applications can capture protected call audio. Test Phone Link, wired headset, HFP hardware and controlled network-audio paths.

## Multi-agent rules

Bound AI-to-AI turns, prioritise human interruption, provide private channels and keep working-agent status separate from spoken-floor status.

## Hardware rules

Use Pi 5/Compute Module-class hardware as an edge chairman, not as a requirement to run every heavyweight model.

## Workflow

1. identify the active phase;
2. observe actual platform capability;
3. update the specification when evidence differs;
4. build the smallest real vertical slice;
5. test feedback, privacy and failure;
6. produce the required verification report.
