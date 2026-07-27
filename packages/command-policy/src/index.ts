import type { CommandResult, ObsSceneState, PhoneStatus, RoomState, SemanticCommand } from "../../contracts/src/index.js";
import type { ObsAdapter } from "../../obs-adapter/src/index.js";
import type { PhoneAdapter } from "../../phone-link-adapter/src/index.js";
import type { RoomStore } from "../../room-state/src/index.js";

export interface CommandContext {
  readonly room: RoomStore;
  readonly obs: ObsAdapter;
  readonly phone: PhoneAdapter;
}

export async function handleSemanticCommand(
  context: CommandContext,
  command: SemanticCommand,
): Promise<CommandResult<ObsSceneState | PhoneStatus>> {
  try {
    switch (command.type) {
      case "obs.scene.activate": {
        const obsState = await context.obs.activateScene(command.sceneName);
        const room = context.room.apply({ type: "room.scene.activate", sceneId: command.sceneName });
        return { ok: true, commandType: command.type, room, data: obsState };
      }
      case "phone.status.read": {
        const phoneStatus = await context.phone.getStatus();
        return { ok: true, commandType: command.type, room: context.room.getState(), data: phoneStatus };
      }
      case "room.scene.activate": {
        const obsState = await context.obs.activateScene(command.sceneId);
        const room = context.room.apply(command);
        return { ok: true, commandType: command.type, room, data: obsState };
      }
      case "room.emergency_silence.set": {
        if (command.enabled) {
          await context.obs.activateScene("06 EMERGENCY SILENCE");
        }
        const room = context.room.apply(command);
        return { ok: true, commandType: command.type, room };
      }
      case "room.humans_only.set": {
        if (command.enabled) {
          await context.obs.activateScene("05 HUMANS ONLY");
        }
        const room = context.room.apply(command);
        return { ok: true, commandType: command.type, room };
      }
      case "room.participant.mute": {
        const room = context.room.apply(command);
        return { ok: true, commandType: command.type, room };
      }
      default: {
        const neverCommand: never = command;
        throw new Error(`Unsupported command ${JSON.stringify(neverCommand)}`);
      }
    }
  } catch (error) {
    return {
      ok: false,
      commandType: command.type,
      room: context.room.getState(),
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function synchronizeObsFromRoom(obs: ObsAdapter, room: RoomState): Promise<ObsSceneState> {
  const current = await obs.getSceneState();
  if (current.currentProgramScene === room.activeScene) {
    return current;
  }
  return obs.activateScene(room.activeScene);
}

export function parseSemanticCommand(value: unknown): SemanticCommand {
  if (!isRecord(value) || typeof value["type"] !== "string") {
    throw new Error("Command must be an object with a type");
  }
  switch (value["type"]) {
    case "room.scene.activate":
      return { type: value["type"], sceneId: requireString(value, "sceneId") };
    case "room.emergency_silence.set":
      return { type: value["type"], enabled: requireBoolean(value, "enabled") };
    case "room.humans_only.set":
      return { type: value["type"], enabled: requireBoolean(value, "enabled") };
    case "room.participant.mute":
      return {
        type: value["type"],
        participantId: requireString(value, "participantId"),
        muted: requireBoolean(value, "muted"),
      };
    case "obs.scene.activate":
      return { type: value["type"], sceneName: requireString(value, "sceneName") };
    case "phone.status.read":
      return { type: value["type"] };
    default:
      throw new Error(`Unknown command type ${value["type"]}`);
  }
}

function requireString(value: Record<string, unknown>, key: string): string {
  const result = value[key];
  if (typeof result !== "string" || result.length === 0) {
    throw new Error(`${key} must be a non-empty string`);
  }
  return result;
}

function requireBoolean(value: Record<string, unknown>, key: string): boolean {
  const result = value[key];
  if (typeof result !== "boolean") {
    throw new Error(`${key} must be a boolean`);
  }
  return result;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
