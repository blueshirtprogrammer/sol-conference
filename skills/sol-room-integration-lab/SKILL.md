---
name: sol-room-integration-lab
description: Configure, test, diagnose or document the Sol Room no-code integration lab using Microsoft Phone Link, VoiceMeeter Banana, OBS Studio, scrcpy, OBS MCP and Windows UI Automation MCP. Use before writing production media drivers or native OBS plugins.
---

# Sol Room Integration Lab Skill

## Trigger

Use this skill when the task involves any of the following:

- setting up the current Sol Room hardware lab;
- testing Phone Link with an AI voice application;
- configuring VoiceMeeter mix-minus;
- configuring or controlling OBS;
- installing or validating OBS/Windows MCP servers;
- inspecting Phone Link through UI Automation;
- collecting endpoint, latency, echo or call-state evidence;
- deciding whether custom Sol Fabric code is necessary;
- reproducing the first human + caller + AI demonstration.

## Mandatory context

Read, in order:

1. `/SYSTEM_PROMPT.md`
2. `/VISION.md`
3. `/SOL_ROOM_MASTER_SPEC.md`
4. `/SOUL.md`
5. `/START_BUILD_HERE.md`
6. `/AGENTS.md`
7. `/lab/CURRENT_HARDWARE_TOPOLOGY.md`
8. `/lab/PHONE_LINK_OBS_BUILD_PLAN.md`
9. `/lab/NO_CODE_INTEGRATION_LAB.md`
10. `/mcp/MCP_STACK.md`
11. `/.mcp.example.json`

## Lab doctrine

- Use existing software to prove the workflow before replacing it.
- Use Phone Link as the first cellular-call adapter.
- Use VoiceMeeter Banana as the temporary two-bus matrix.
- Use OBS as the visual stage, not the authoritative call/audio service.
- Use OBS WebSocket before writing a native OBS plugin.
- Use Windows UI Automation before screenshots or coordinates.
- Keep all consequential actions supervised.
- Never treat a mock, visible button or successful command response as proof of remote audio or call state.

## Mix-minus model

```text
B1 -> AI microphone
     contains human + caller
     excludes AI output

B2 -> Phone Link/default communications microphone
     contains human + AI output
     excludes caller output

A1 -> local operator monitor
     contains caller + AI
     human sidetone optional
```

Reject any configuration where caller output routes to B2 or AI output routes to B1.

## Working procedure

### 1. Establish baseline

- inventory software versions;
- identify exact Windows playback, recording and communications endpoints;
- verify ordinary Phone Link call manually;
- verify OBS WebSocket locally;
- verify VoiceMeeter B1/B2 using local recording before a live call.

### 2. Configure visuals

- create the `SOL ROOM LAB` scene collection;
- add Phone Link, AI app and scrcpy windows;
- project the stage to the assigned TV;
- keep TV audio muted.

### 3. Configure MCP

- connect exactly one OBS MCP server;
- connect exactly one Windows UI Automation MCP server;
- list actual tools and versions;
- perform read-only smoke tests first;
- stop before any call or recording action until the human confirms.

### 4. Test the call graph incrementally

Run tests in order:

1. ordinary Phone Link call;
2. human microphone through B2;
3. caller through B1 into AI;
4. AI through B2 into caller;
5. complete three-party turn;
6. emergency silence while human call remains active.

Do not skip directly to the full loop. A failure must be localized to one route or interface.

### 5. Capture evidence

Record:

- endpoint names;
- per-app input/output assignment;
- VoiceMeeter routing screenshot;
- OBS scene readback;
- Phone Link UI Automation snapshot;
- remote-hearing confirmation;
- echo/latency notes;
- failure and restart behaviour;
- exact manual steps still required.

Redact secrets and personal data.

## MCP control order

```text
Sol semantic command
  -> direct OBS/Sol API
  -> Windows UI Automation
  -> screenshot/mouse fallback
  -> human action
```

A screenshot fallback must be visibly reported as less reliable.

## Stop conditions

Stop and request human action when:

- a UAC or secure-desktop prompt appears;
- a real recipient or number is ambiguous;
- the agent would start a call, message, stream or recording without confirmation;
- OBS WebSocket is exposed beyond localhost without an explicit security decision;
- Windows test-signing or driver installation is proposed during the initial lab;
- Phone Link state cannot be verified after an action;
- feedback or uncontrolled audio looping occurs;
- recording consent is absent.

## Required completion report

Return:

1. hardware and software actually present;
2. versions and endpoint names;
3. routes configured;
4. exact commands/tool calls performed;
5. tests passed and failed;
6. real remote-party confirmations;
7. screenshots/traces produced;
8. latency and echo observations;
9. unverified assumptions;
10. recommendation for the next build phase.

## Success boundary

The skill succeeds when it produces trustworthy evidence about whether the existing Phone Link + VoiceMeeter + OBS architecture works on the actual lab. It does not need to write production code to be successful.
