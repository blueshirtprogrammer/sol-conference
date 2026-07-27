import assert from "node:assert/strict";
import test from "node:test";
import { MockObsAdapter } from "../../obs-adapter/src/index.js";
import type { ObsAdapter } from "../../obs-adapter/src/index.js";
import { DeterministicPhoneAdapter } from "../../phone-link-adapter/src/index.js";
import { createDeterministicRoomStore } from "../../room-state/src/index.js";
import { handleSemanticCommand, parseSemanticCommand, synchronizeObsFromRoom } from "./index.js";

function context() {
  return {
    room: createDeterministicRoomStore(),
    obs: new MockObsAdapter(),
    phone: new DeterministicPhoneAdapter(),
  };
}

test("semantic scene activation verifies OBS readback and room state", async () => {
  const result = await handleSemanticCommand(context(), {
    type: "room.scene.activate",
    sceneId: "03 AI ROOM",
  });
  assert.equal(result.ok, true);
  assert.equal(result.room.activeScene, "03 AI ROOM");
  assert.ok(result.data && "currentProgramScene" in result.data);
  assert.equal(result.data.currentProgramScene, "03 AI ROOM");
});

test("unknown command payloads fail closed", () => {
  assert.throws(() => parseSemanticCommand({ type: "phone.call.start" }), /Unknown command type/);
});

test("emergency silence uses the shared handler", async () => {
  const result = await handleSemanticCommand(context(), {
    type: "room.emergency_silence.set",
    enabled: true,
  });
  assert.equal(result.ok, true);
  assert.equal(result.room.emergencySilence, true);
  assert.equal(result.room.routes.find((route) => route.id === "ai-to-phone")?.effective, false);
});


test("a restarted OBS adapter restores the authoritative room scene", async () => {
  const room = createDeterministicRoomStore();
  room.apply({ type: "room.scene.activate", sceneId: "03 AI ROOM" });
  const restartedObs = new MockObsAdapter();
  const restored = await synchronizeObsFromRoom(restartedObs, room.getState());
  assert.equal(restored.currentProgramScene, "03 AI ROOM");
});


class UnavailableObsAdapter implements ObsAdapter {
  public readonly kind = "obs-websocket" as const;
  public async connect(): Promise<void> { throw new Error("OBS unavailable"); }
  public async disconnect(): Promise<void> {}
  public async getSceneState(): Promise<never> { throw new Error("OBS unavailable"); }
  public async activateScene(): Promise<never> { throw new Error("OBS unavailable"); }
}

test("emergency silence remains authoritative when OBS is unavailable", async () => {
  const testContext = context();
  const result = await handleSemanticCommand({ ...testContext, obs: new UnavailableObsAdapter() }, {
    type: "room.emergency_silence.set",
    enabled: true,
  });
  assert.equal(result.ok, true);
  assert.equal(result.room.emergencySilence, true);
  assert.equal(result.room.routes.find((route) => route.id === "ai-to-phone")?.effective, false);
  assert.match(result.warnings?.[0] ?? "", /OBS scene sync failed/);
});
