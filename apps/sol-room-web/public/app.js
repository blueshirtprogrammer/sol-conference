const participants = document.querySelector("#participants");
const routes = document.querySelector("#routes");
const connection = document.querySelector("#connection");
const stageTitle = document.querySelector("#stage-title");
const safetyState = document.querySelector("#safety-state");
const revision = document.querySelector("#revision");
const emergency = document.querySelector("#emergency");
const humansOnly = document.querySelector("#humans-only");
let room;

for (const button of document.querySelectorAll("[data-scene]")) {
  button.addEventListener("click", () => send({ type: "room.scene.activate", sceneId: button.dataset.scene }));
}
emergency.addEventListener("click", () => send({ type: "room.emergency_silence.set", enabled: !room?.emergencySilence }));
humansOnly.addEventListener("click", () => send({ type: "room.humans_only.set", enabled: !room?.humansOnly }));

await refresh();
connect();

async function refresh() {
  const response = await fetch("/api/room");
  render(await response.json());
}

function connect() {
  const protocol = location.protocol === "https:" ? "wss:" : "ws:";
  const socket = new WebSocket(`${protocol}//${location.host}/ws`);
  socket.addEventListener("open", () => { connection.textContent = "Sol Fabric connected"; });
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.type === "room.state") render(message.room);
  });
  socket.addEventListener("close", () => {
    connection.textContent = "Disconnected · retrying";
    setTimeout(connect, 1000);
  });
}

async function send(command) {
  const response = await fetch("/api/commands", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(command),
  });
  const result = await response.json();
  if (!result.ok) {
    connection.textContent = `Command failed: ${result.error}`;
  }
  render(result.room);
}

function render(nextRoom) {
  room = nextRoom;
  stageTitle.textContent = room.activeScene;
  revision.textContent = `Revision ${room.revision}`;
  emergency.setAttribute("aria-pressed", String(room.emergencySilence));
  humansOnly.setAttribute("aria-pressed", String(room.humansOnly));
  safetyState.textContent = room.emergencySilence
    ? "Emergency silence active · AI/media speak routes blocked"
    : room.humansOnly
      ? "Humans-only routing active"
      : "Normal explicit routing";

  const names = new Map(room.nodes.map((node) => [node.id, node.label]));
  participants.replaceChildren(...room.nodes.map((node) => participantCard(node)));
  routes.replaceChildren(...room.routes.map((route) => routeRow(route, names)));
}

function participantCard(node) {
  const article = document.createElement("article");
  article.className = "participant";
  const title = document.createElement("h3");
  title.textContent = node.label;
  const kind = document.createElement("p");
  kind.textContent = `${node.kind} · audio ${node.state.audio} · tools ${node.state.tools}`;
  const badge = document.createElement("span");
  badge.className = "badge";
  badge.textContent = node.simulated ? "SIMULATED" : "LIVE";
  article.append(title, kind, badge);
  return article;
}

function routeRow(route, names) {
  const row = document.createElement("tr");
  row.append(
    cell(names.get(route.sourceNodeId) ?? route.sourceNodeId),
    cell(names.get(route.destinationNodeId) ?? route.destinationNodeId),
    cell(route.requested ? "yes" : "no"),
    stateCell(route.effective),
    cell(route.blockedBy.join(", ") || "—"),
  );
  return row;
}

function cell(value) {
  const result = document.createElement("td");
  result.textContent = value;
  return result;
}

function stateCell(enabled) {
  const result = cell(enabled ? "routed" : "blocked");
  result.className = enabled ? "route-on" : "route-off";
  return result;
}
