# Windows Phase 0B Setup

Phase 0B is a deterministic control-plane proof. It does not install a virtual audio driver, operate a real phone call or assert that Phone Link accepts a virtual microphone.

## Requirements

- Windows 11;
- Node.js 22 or later;
- Corepack-enabled pnpm 10.14.0;
- OBS Studio 28+ only when testing the real OBS WebSocket adapter.

## Commands

```powershell
corepack enable
corepack prepare pnpm@10.14.0 --activate
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm dev
```

Open `http://127.0.0.1:4317`. The console must label the human, phone and AI nodes as simulated.

## Optional OBS WebSocket mode

Keep OBS WebSocket on localhost and set secrets only in the local shell:

```powershell
$env:SOL_OBS_MODE = "websocket"
$env:OBS_WEBSOCKET_URL = "ws://127.0.0.1:4455"
$env:OBS_WEBSOCKET_PASSWORD = "YOUR_LOCAL_PASSWORD"
pnpm dev
```

The adapter uses OBS WebSocket v5 scene-list, scene-activation and program-scene readback. A successful connection proves only semantic scene control. It does not prove Phone Link audio, recording, streaming or call continuity.

## Diagnostics

After `pnpm build`:

```powershell
pnpm diagnostics
```

The generated JSON records simulator state and runtime versions. It deliberately marks hardware verification as false and contains no OBS password, phone number, transcript or contact data.
