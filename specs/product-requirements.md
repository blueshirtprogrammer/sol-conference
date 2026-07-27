# Product Requirements — Sol Room

`SOL_ROOM_MASTER_SPEC.md` is the complete canonical product contract. This document provides the implementation checklist.

## Objective

Create a local-first multimodal operating room that connects humans, phone/meeting participants, multiple existing AI voice applications, local models, screens, cameras, media and tool-using agents; explicitly controls HEAR, SPEAK, SEE, ACT and SHARE; and returns real artifacts while the conversation continues.

## Sol Link

- pair and revoke Android devices;
- search contacts under permission;
- preview and send SMS through selected SIM;
- preview and open/place native calls under trust policy;
- expose truthful device/command state;
- separately permission notifications, navigation and media;
- sign, expire, bind, deduplicate and audit commands;
- require device confirmation for unknown or risky destinations.

## Sol Fabric

- discover physical, virtual, process and network media endpoints;
- create explicit source/destination routes;
- provide per-node mix-minus;
- expose virtual microphones, speakers and later camera/screen endpoints;
- support mute input/output/all, solo, talkback, monitor, humans-only and emergency silence;
- detect self-routes, short cycles, clipping and degraded endpoints;
- measure latency and avoid sharing system notification audio by default.

## Sol Room

- persistent room identity, participants and roles;
- scenes and routing matrix;
- floor ownership, queue and human interruption;
- bounded AI-to-AI turns;
- shared stage and private visual/reviewer channels;
- separate audio, visual, tool and work states;
- decisions, action items and optional retained room memory.

## Sol Work

- scoped tasks with selected transcript/context only;
- adapters for coding, design, research, browser and document agents;
- private work that may continue while the agent is muted;
- progress/blocker/ready state;
- authorised artifact publication to the stage;
- preserved branch, preview, document and evidence identity.

## Sol Room Edge

- always-on room service;
- device discovery and supervision;
- physical mute/privacy and scene recall;
- watchdog/offline policy;
- lightweight wake/VAD/speaker activity and optional local models;
- local emergency controls independent of cloud services.

## Sol Presence

- channel-driven avatar/presence state;
- visible AI label;
- consent for real-person likeness/voice;
- optional spatial audio and room seating;
- avatar failure does not affect audio or work.

## Security and reliability

- local processing by default;
- recording off by default and separately disclosed;
- full numbers, credentials and protected content absent from logs/git;
- media access does not grant tools;
- physical/software privacy overrides scene state;
- AI failure does not end human communication;
- visual/work failures do not end audio;
- stale endpoints become degraded, not silently successful;
- mocks and simulated devices are visibly labelled.

## Initial performance targets

Targets must be measured before being marketed:

- local control acknowledgement under 150 ms on LAN;
- mute/emergency silence under 100 ms;
- added desktop-bridge round-trip under 120 ms;
- room-state update under 250 ms;
- no sustained clipping in nominal configuration.

## Core MVP exclusions

- autonomous PC-off PSTN answering;
- replacing Android's default dialler;
- bypassing Android call-audio protections;
- unbounded autonomous AI conversations;
- provider-account resale or evasion;
- covert recording or undisclosed avatars;
- enterprise fleet work before the room primitive is proven;
- Twilio/SIP/OpenAI Realtime as the core implementation.
