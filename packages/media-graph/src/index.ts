import type { AudioRoute, NodeKind, RoomNode, RouteBlockReason } from "../../contracts/src/index.js";

const SPEAKING_KINDS = new Set<NodeKind>(["ai-app", "working-agent", "local-model", "media"]);
const NON_HUMAN_KINDS = new Set<NodeKind>([
  "ai-app",
  "working-agent",
  "local-model",
  "meeting-app",
  "media",
]);

export interface RoutePolicyState {
  readonly emergencySilence: boolean;
  readonly humansOnly: boolean;
  readonly manuallyMutedNodeIds: ReadonlySet<string>;
}

export function assertValidGraph(nodes: readonly RoomNode[], routes: readonly AudioRoute[]): void {
  const nodeIds = new Set(nodes.map((node) => node.id));
  for (const route of routes) {
    if (!nodeIds.has(route.sourceNodeId) || !nodeIds.has(route.destinationNodeId)) {
      throw new Error(`Route ${route.id} references an unknown node`);
    }
    if (route.sourceNodeId === route.destinationNodeId) {
      throw new Error(`Route ${route.id} is a forbidden self-route`);
    }
  }
}

export function applyRoutePolicy(
  nodes: readonly RoomNode[],
  routes: readonly AudioRoute[],
  policy: RoutePolicyState,
): readonly AudioRoute[] {
  const nodeById = new Map(nodes.map((node) => [node.id, node] as const));
  return routes.map((route) => {
    const source = nodeById.get(route.sourceNodeId);
    if (source === undefined) {
      throw new Error(`Unknown route source ${route.sourceNodeId}`);
    }

    const blockedBy: RouteBlockReason[] = [];
    if (policy.manuallyMutedNodeIds.has(source.id)) {
      blockedBy.push("manual-mute");
    }
    if (policy.emergencySilence && SPEAKING_KINDS.has(source.kind)) {
      blockedBy.push("emergency-silence");
    }
    if (policy.humansOnly && NON_HUMAN_KINDS.has(source.kind)) {
      blockedBy.push("humans-only");
    }

    return {
      ...route,
      effective: route.requested && blockedBy.length === 0,
      blockedBy,
    };
  });
}
