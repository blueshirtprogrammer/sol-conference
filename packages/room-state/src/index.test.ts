import assert from "node:assert/strict";
import test from "node:test";
import { createDeterministicRoomStore } from "./index.js";

function route(state: ReturnType<ReturnType<typeof createDeterministicRoomStore>["getState"]>, id: string) {
  const found = state.routes.find((candidate) => candidate.id === id);
  assert.ok(found, `expected route ${id}`);
  return found;
}

test("deterministic simulator has no self-routes", () => {
  const state = createDeterministicRoomStore().getState();
  assert.equal(state.nodes.length, 3);
  assert.equal(state.routes.some((candidate) => candidate.sourceNodeId === candidate.destinationNodeId), false);
});

test("emergency silence removes AI speak routes but preserves human call continuity", () => {
  const store = createDeterministicRoomStore();
  const state = store.apply({ type: "room.emergency_silence.set", enabled: true });

  assert.equal(state.emergencySilence, true);
  assert.equal(route(state, "ai-to-human").effective, false);
  assert.deepEqual(route(state, "ai-to-phone").blockedBy, ["emergency-silence"]);
  assert.equal(route(state, "human-to-phone").effective, true);
  assert.equal(route(state, "phone-to-human").effective, true);
});

test("state timestamps and revisions are deterministic", () => {
  const store = createDeterministicRoomStore();
  const first = store.apply({ type: "room.scene.activate", sceneId: "03 AI ROOM" });
  const second = store.apply({ type: "room.humans_only.set", enabled: true });

  assert.equal(first.revision, 1);
  assert.equal(first.updatedAt, "2026-07-27T00:00:01.000Z");
  assert.equal(second.revision, 2);
  assert.equal(second.updatedAt, "2026-07-27T00:00:02.000Z");
});
