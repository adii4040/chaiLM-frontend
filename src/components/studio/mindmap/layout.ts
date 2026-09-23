import dagre from '@dagrejs/dagre';
import type { Node, Edge } from '@xyflow/react';

export function calculateLayout(
  nodes: Node[],
  edges: Edge[],
  direction: 'LR' | 'TB' = 'LR'
): { nodes: Node[]; edges: Edge[] } {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: isHorizontal ? 40 : 50,
    ranksep: isHorizontal ? 120 : 90,
  });

  nodes.forEach((node) => {
    let width = 280;
    let height = 100;
    if (node.type === 'rootNode') {
      width = 320;
      height = 130;
    } else if (node.type === 'branchNode') {
      width = 260;
      height = 95;
    } else if (node.type === 'subBranchNode') {
      const detailsCount = (node.data as any).keyDetails?.length || 0;
      width = 280;
      height = 50 + Math.max(1, detailsCount) * 28;
    }
    dagreGraph.setNode(node.id, { width, height });
  });

  // Dagre builds layer ranks such that reversing edge insertions produces
  // natural top-to-bottom (LR) and left-to-right (TB) branch ordering (1 -> 2 -> 3 -> 4)
  [...edges].reverse().forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const pos = dagreGraph.node(node.id);
    let width = 280;
    let height = 100;
    if (node.type === 'rootNode') {
      width = 320;
      height = 130;
    } else if (node.type === 'branchNode') {
      width = 260;
      height = 95;
    } else if (node.type === 'subBranchNode') {
      const detailsCount = (node.data as any).keyDetails?.length || 0;
      width = 280;
      height = 50 + Math.max(1, detailsCount) * 28;
    }

    return {
      ...node,
      position: {
        x: pos.x - width / 2,
        y: pos.y - height / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
}
