# Start Building Sol Room Here

This is the operational handoff from product vision to coding agents.

## Source branch

Use:

```text
agent/sol-room-vision-site
```

Do not start from the superseded telephony-first branch or PR.

## Read order

Every coding agent must read, in order:

1. `SYSTEM_PROMPT.md`
2. `VISION.md`
3. `SOL_ROOM_MASTER_SPEC.md`
4. `AGENTS.md`
5. `CODING_AGENT_PROMPT.md`
6. `CODEX_PROJECT.md`
7. `specs/obs-plugin.md`
8. `lab/CURRENT_HARDWARE_TOPOLOGY.md`
9. `lab/PHONE_LINK_OBS_BUILD_PLAN.md`
10. `lab/USB_C_PHONE_LAB.md`

## First implementation objective

Do not build the complete product first.

Build one truthful vertical proof:

```text
Microsoft Phone Link or deterministic phone simulator
+ one existing AI voice application or deterministic agent simulator
+ local operator microphone
+ OBS scene control
+ Sol Fabric room state
+ emergency silence
```

The first software milestone does not require proven live phone audio. It must provide the scaffolding and deterministic test harness that lets the hardware lab replace simulated nodes with real nodes one at a time.

## First repository shape

Create:

```text
apps/
  sol-fabric-service/
  sol-room-web/
  sol-obs-bridge/
  sol-obs-plugin/          # scaffold only until external OBS proof passes

packages/
  contracts/
  room-state/
  media-graph/
  command-policy/
  diagnostics/
  obs-adapter/
  phone-link-adapter/
  test-harness/

skills/
  sol-room/

specs/
lab/
```

Use a pnpm workspace for TypeScript components. Windows-native audio and OBS native plugin code may be added in the appropriate later phase; do not fake those capabilities in TypeScript.

## Phase 0B — buildable control-plane scaffold

### Deliverables

- pnpm workspace and root scripts;
- shared strict TypeScript contracts;
- deterministic room simulator;
- Sol Fabric local service with HTTP/WebSocket health and room-state endpoints;
- browser-based room console;
- OBS WebSocket adapter behind a typed interface;
- mock OBS adapter for CI;
- phone adapter interface plus deterministic simulator;
- semantic command handlers shared by web and MCP-facing code;
- emergency-silence state and tests;
- diagnostics bundle command;
- Windows setup documentation;
- CI for lint, typecheck, tests and build.

### Required commands

```text
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm dev
```

### Required proof

1. Start the Sol Fabric service.
2. Start the room simulator.
3. Open the room console.
4. Observe human, phone and AI simulator nodes.
5. Activate a room scene.
6. Trigger emergency silence.
7. Verify agent/media speak routes are disabled while human/private safety state remains available.
8. Restart the console or OBS mock and restore authoritative state.
9. Save a diagnostics bundle containing versions, state trace and test evidence but no secrets.

## Phase 0B exclusions

Do not yet:

- write a production virtual audio driver;
- claim Phone Link audio capture works;
- create a full Phone Link clone;
- introduce Twilio, SIP or model realtime APIs;
- automate consequential calls without preview and confirmation;
- depend on coordinate clicking;
- make the OBS plugin own call continuity or room truth;
- add databases or distributed infrastructure without a demonstrated need.

## Agent workflow

For each assigned task:

1. restate the bounded objective;
2. inspect current code and tests;
3. write the smallest implementation plan;
4. implement with tests;
5. run all relevant checks;
6. inspect the actual output;
7. update specifications when evidence changes an assumption;
8. commit the coherent unit;
9. return a truthful verification report.

## Parallel-agent lanes

After the initial scaffold exists, agents may work in separate worktrees:

### Lane A — contracts and room state

Schemas, events, reducers, safety invariants and deterministic tests.

### Lane B — OBS integration

OBS WebSocket adapter, scene templates, overlays and eventual plugin scaffold.

### Lane C — Windows and Phone Link lab

UI Automation inspector, process/endpoint inventory, manual call-state tests and diagnostics. No unverified audio claims.

### Lane D — room web interface

Operator console, routing matrix, participants, scenes, health and accessibility.

### Lane E — infrastructure and verification

CI, packaging, diagnostics, test harnesses and reproduction scripts.

No lane may redefine shared contracts privately. Contract changes must be reviewed and merged first.

## First Codex prompt

```text
You are starting the Sol Room implementation on branch agent/sol-room-vision-site.

Read START_BUILD_HERE.md and every file in its mandatory read order.
Implement Phase 0B only: the buildable control-plane scaffold and deterministic
OBS/phone room simulation.

Do not implement a production audio driver, do not claim Phone Link media is
working, and do not introduce Twilio, SIP or metered realtime APIs.

Use the external OBS WebSocket adapter before a native plugin. Scaffold the
native plugin directory only if the external proof and tests pass.

Run pnpm install, lint, typecheck, test and build. Return the exact commands,
results, files changed, screenshots or traces produced, and remaining hardware
checks. Commit the completed coherent slice on a new agent branch.
```

## First human hardware actions

While Codex builds Phase 0B:

1. install/update Phone Link and pair one phone;
2. install OBS Studio;
3. enable OBS WebSocket and set a local password;
4. confirm laptop, desktop and Pi can ping each other;
5. label the two TVs `SOL STAGE` and `SOL WORK WALL`;
6. keep TV audio muted for the first bridge tests;
7. collect screenshots of Windows Sound input/output and communications-device pages;
8. run the USB-C and Phone Link lab without inferring unsupported capabilities.

## Completion boundary

Phase 0B is complete when a new developer can clone the branch, run the documented commands, see the deterministic Sol Room in a browser and OBS mock/real adapter, exercise emergency silence, and understand exactly which hardware behaviours remain unverified.