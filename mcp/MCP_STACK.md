# Sol Room Portable MCP Stack

## Goal

Give any MCP-capable coding or desktop agent the same bounded tool surface for the Sol Room lab without embedding credentials or vendor-specific assumptions in the repository.

## Use exactly one server per capability

Do not load several Windows-control or OBS-control MCP servers at once. Duplicate tools increase ambiguity and make verification harder.

Recommended lab stack:

```text
OBS control      -> obs-mcp 1.1.0 OR sbroenne OBS MCP extension
Windows control  -> sbroenne/mcp-windows standalone OR FlaUI-MCP
Repository       -> agent's native git/GitHub tools
Browser          -> agent's native browser/Playwright tools
```

## Trust model

Community MCP servers are third-party code with desktop control. Before use:

1. inspect the source/release provenance;
2. pin a version or release artifact;
3. run locally only;
4. do not pass secrets on the command line;
5. start non-elevated;
6. approve consequential actions manually;
7. keep OBS WebSocket on localhost;
8. review tool logs after the session.

## OBS server

Portable stdio configuration:

```json
{
  "command": "cmd",
  "args": ["/c", "npx", "-y", "obs-mcp@1.1.0"],
  "env": {
    "OBS_WEBSOCKET_URL": "ws://127.0.0.1:4455",
    "OBS_WEBSOCKET_PASSWORD": "SET_LOCALLY_DO_NOT_COMMIT"
  }
}
```

OBS 28+ includes obs-websocket. Enable it under `Tools -> WebSocket Server Settings`, keep authentication enabled and use localhost for the first lab.

## Windows semantic automation server

Preferred standalone form:

```json
{
  "command": "C:\\SolRoom\\tools\\Sbroenne.WindowsMcp.exe",
  "args": []
}
```

Use semantic tools in this order:

```text
window find/activate
UI snapshot
find by accessible name/type
click/select/type by semantic element
wait and verify state
screenshot/mouse fallback only when required
```

Do not run Phone Link or the MCP server as Administrator during normal testing. Windows UI Automation cannot cross integrity boundaries cleanly, and UAC secure-desktop prompts require the human.

## Shared project configuration

`.mcp.example.json` is intentionally non-secret. Copy it to the configuration format used by the selected agent and replace placeholders locally.

Do not commit the resulting real configuration if it contains passwords or machine-specific executable paths.

## Claude Code

Claude Code supports project-scoped `.mcp.json` and local/user scopes. On native Windows, local `npx` servers may need the `cmd /c` wrapper.

Example commands:

```powershell
claude mcp add obs --scope local --env OBS_WEBSOCKET_URL=ws://127.0.0.1:4455 --env OBS_WEBSOCKET_PASSWORD=YOUR_LOCAL_PASSWORD -- cmd /c npx -y obs-mcp@1.1.0
claude mcp add windows --scope local -- C:\SolRoom\tools\Sbroenne.WindowsMcp.exe
claude mcp list
```

Keep the OBS password in local scope rather than the shared project file.

## Gemini CLI

Gemini CLI reads project guidance from `GEMINI.md` and MCP settings from `.gemini/settings.json` or the current supported configuration location.

Use the same stdio command definitions from `.mcp.example.json`. Restart Gemini CLI or refresh MCP after editing its settings.

## Codex

Open the repository/folder as a Codex project and point the agent at `prompts/PASTE_INTO_ANY_CODING_AGENT.txt`.

Codex supports project instructions and skills checked into the repository. Configure local MCP servers through the current Codex app/CLI project settings; keep passwords in local environment variables or local config, not repository files.

## VS Code / GitHub Copilot

The simplest Windows setup is:

```powershell
code --install-extension sbroenne.obs-mcp-server
code --install-extension sbroenne.windows-mcp
```

Alternatively configure stdio servers in `.vscode/mcp.json`. Do not commit passwords.

## Claude Desktop / other MCP clients

Most clients accept the common shape:

```json
{
  "mcpServers": {
    "obs": {
      "command": "cmd",
      "args": ["/c", "npx", "-y", "obs-mcp@1.1.0"],
      "env": {
        "OBS_WEBSOCKET_URL": "ws://127.0.0.1:4455",
        "OBS_WEBSOCKET_PASSWORD": "SET_LOCALLY"
      }
    },
    "windows": {
      "command": "C:\\SolRoom\\tools\\Sbroenne.WindowsMcp.exe",
      "args": []
    }
  }
}
```

Client schemas vary slightly. Preserve the command, arguments and environment values while adapting the outer object to the client's documented format.

## Required smoke test

An agent is not considered connected because the server name appears in a menu.

Verify:

1. OBS MCP lists the actual scene collection and current program scene.
2. OBS MCP changes to `01 LAB OVERVIEW` and reads the current scene back.
3. Windows MCP finds the real Phone Link window.
4. Windows MCP returns a UI Automation snapshot.
5. Windows MCP opens the Calls page semantically and reads visible state.
6. No call is initiated during the smoke test.

## Tool permission policy

Allowed without separate confirmation during the lab:

- list windows/scenes/sources;
- inspect UI Automation trees;
- focus or move windows;
- switch between non-broadcast OBS lab scenes;
- read status and diagnostics;
- launch local non-elevated lab applications.

Require explicit confirmation:

- dial, answer or end a real call;
- send a message;
- start streaming;
- start recording;
- expose a camera/microphone to a remote service;
- publish or upload content;
- install drivers;
- enable Windows test-signing;
- run elevated commands;
- change firewall/router configuration.

## Replacement strategy

These MCP servers are proving tools, not permanent product dependencies.

After the lab:

- wrap OBS WebSocket behind `packages/obs-adapter`;
- wrap Windows UI Automation behind `packages/phone-link-adapter`;
- expose a smaller Sol-owned MCP surface with intent-level tools;
- retain third-party servers only for diagnostics and supervised fallback.