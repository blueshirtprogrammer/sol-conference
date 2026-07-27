# Phone Link + OBS Bounded Build Plan

## Objective

Coordinate the no-code hardware proof with the Phase 0B simulator without allowing either track to manufacture evidence for the other.

## Track A — read-only first

1. Inventory exact Phone Link, VoiceMeeter, OBS, scrcpy, Node and MCP versions.
2. Verify OBS WebSocket is bound to `127.0.0.1:4455` with authentication.
3. Use exactly one OBS MCP to list scenes and read the current program scene.
4. Use exactly one Windows UI Automation MCP to find Phone Link, snapshot its accessible tree and open the Calls page semantically.
5. Stop before dialling, answering, ending a call, sending a message, recording or streaming.

## Track B — Phase 0B software proof

1. Start the deterministic Sol Fabric service.
2. Observe the simulated human, Phone Link and AI nodes in the browser console.
3. Activate an OBS scene through the shared semantic command handler and require program-scene readback.
4. Trigger emergency silence and verify AI/media output routes become ineffective while human-to-phone and phone-to-human routes remain available.
5. Restart the console or OBS mock and reload authoritative room state from Sol Fabric.
6. generate a diagnostics bundle that clearly says hardware verification is false.

## Replacement rule

Replace one simulator boundary at a time:

```text
Mock OBS -> authenticated localhost OBS WebSocket
Phone simulator -> read-only Phone Link UI Automation adapter
Simulated audio routes -> measured VoiceMeeter/Windows endpoints
```

A real adapter may enter the proof only when its state can be read back. A successful click, compile or mock test is not hardware evidence.
