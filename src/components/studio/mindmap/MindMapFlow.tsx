import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useReactFlow,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type { MindMapData } from '../../../modules/studio/dto/studioDto';
import { THEMES, PALETTES, type MindMapTheme } from './mindMapTheme';
import { nodeTypes } from './nodes';
import { calculateLayout } from './layout';
import { MindMapToolbar } from './MindMapToolbar';

export interface MindMapFlowProps {
  data: MindMapData;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  theme: MindMapTheme;
  onChangeTheme: (theme: MindMapTheme) => void;
}

export function MindMapFlow({
  data,
  isFullscreen,
  onToggleFullscreen,
  theme,
  onChangeTheme,
}: MindMapFlowProps) {
  const root = data.rootNode;
  const branches = root?.branches || [];
  const { fitView } = useReactFlow();

  const [orientation, setOrientation] = useState<'LR' | 'TB'>('LR');
  const currentTheme = THEMES[theme] || THEMES.light;

  const [expandedBranches, setExpandedBranches] = useState<Record<number, boolean>>(() => {
    const init: Record<number, boolean> = {};
    branches.forEach((_, idx) => {
      init[idx] = true;
    });
    return init;
  });

  const toggleBranch = useCallback((idx: number) => {
    setExpandedBranches((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  }, []);

  const expandAll = useCallback(() => {
    const all: Record<number, boolean> = {};
    branches.forEach((_, idx) => {
      all[idx] = true;
    });
    setExpandedBranches(all);
  }, [branches]);

  const collapseAll = useCallback(() => {
    const none: Record<number, boolean> = {};
    branches.forEach((_, idx) => {
      none[idx] = false;
    });
    setExpandedBranches(none);
  }, [branches]);

  // Compute raw nodes and edges from data and expanded states
  const { rawNodes, rawEdges, totalSubNodes } = useMemo(() => {
    const nodesList: Node[] = [];
    const edgesList: Edge[] = [];
    let subTotal = 0;

    branches.forEach((branch) => {
      subTotal += branch.subBranches?.length || 0;
    });

    // 1. Root Node
    const rootId = 'root';
    nodesList.push({
      id: rootId,
      type: 'rootNode',
      position: { x: 0, y: 0 },
      data: {
        title: root?.label || data.mapTitle || 'Central Knowledge Concept',
        branchCount: branches.length,
        totalSubNodes: subTotal,
        orientation,
        theme,
      },
    });

    // 2. Branch Nodes & SubBranch Nodes
    branches.forEach((branch, bIdx) => {
      const branchId = `branch-${bIdx}`;
      const palette = PALETTES[bIdx % PALETTES.length];
      const isExpanded = Boolean(expandedBranches[bIdx]);
      const subBranches = branch.subBranches || [];

      nodesList.push({
        id: branchId,
        type: 'branchNode',
        position: { x: 0, y: 0 },
        data: {
          label: branch.label,
          branchIndex: bIdx,
          subCount: subBranches.length,
          isExpanded,
          onToggle: toggleBranch,
          palette,
          orientation,
          theme,
        },
      });

      // Edge from Root -> Branch
      edgesList.push({
        id: `edge-root-${branchId}`,
        source: rootId,
        target: branchId,
        type: 'smoothstep',
        style: { stroke: palette.primary, strokeWidth: 2 },
      });

      // Sub-branches if expanded
      if (isExpanded && subBranches.length > 0) {
        subBranches.forEach((sub, sIdx) => {
          const subId = `sub-${bIdx}-${sIdx}`;
          nodesList.push({
            id: subId,
            type: 'subBranchNode',
            position: { x: 0, y: 0 },
            data: {
              label: sub.label,
              keyDetails: sub.keyDetails || [],
              palette,
              orientation,
              theme,
            },
          });

          // Edge from Branch -> SubBranch
          edgesList.push({
            id: `edge-${branchId}-${subId}`,
            source: branchId,
            target: subId,
            type: 'smoothstep',
            style: {
              stroke: palette.stroke,
              strokeWidth: 1.5,
              strokeDasharray: '4,4',
            },
          });
        });
      }
    });

    return { rawNodes: nodesList, rawEdges: edgesList, totalSubNodes: subTotal };
  }, [data, root, branches, expandedBranches, orientation, theme, toggleBranch]);

  // Compute Layout
  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(() => {
    return calculateLayout(rawNodes, rawEdges, orientation);
  }, [rawNodes, rawEdges, orientation]);

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  // Sync state when layout recalculates
  useEffect(() => {
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
    const timer = setTimeout(() => {
      fitView({ padding: 0.25, duration: 400 });
    }, 50);
    return () => clearTimeout(timer);
  }, [layoutedNodes, layoutedEdges, setNodes, setEdges, fitView]);

  const handleResetLayout = () => {
    fitView({ padding: 0.25, duration: 400 });
  };

  const toggleOrientation = () => {
    setOrientation((prev) => (prev === 'LR' ? 'TB' : 'LR'));
  };

  return (
    <div
      className="w-full h-full relative transition-colors duration-300"
      style={{ backgroundColor: currentTheme.canvasBg }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.25 }}
        minZoom={0.1}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={18} size={1} color={currentTheme.dotColor} />
        <Controls
          position="bottom-left"
          className={`rounded-xl! shadow-sm! overflow-hidden! ${currentTheme.controlsClass}`}
          showInteractive={false}
        />
        <MiniMap
          position="bottom-right"
          className={`hidden! md:block! rounded-2xl! shadow-sm! overflow-hidden! m-4! border ${currentTheme.miniMapBorder}`}
          style={{ backgroundColor: currentTheme.miniMapBg }}
          nodeColor={(node) => {
            if (node.type === 'rootNode') return '#8B5CF6';
            if (node.type === 'branchNode') {
              return (node.data as any)?.palette?.primary || '#3B82F6';
            }
            return theme === 'light' || theme === 'warm' ? '#CBCFC9' : '#334155';
          }}
          maskColor={currentTheme.miniMapMask}
        />

        <MindMapToolbar
          branchCount={branches.length}
          totalSubNodes={totalSubNodes}
          theme={theme}
          orientation={orientation}
          isFullscreen={isFullscreen}
          onExpandAll={expandAll}
          onCollapseAll={collapseAll}
          onChangeTheme={onChangeTheme}
          onToggleOrientation={toggleOrientation}
          onResetLayout={handleResetLayout}
          onToggleFullscreen={onToggleFullscreen}
        />
      </ReactFlow>
    </div>
  );
}
