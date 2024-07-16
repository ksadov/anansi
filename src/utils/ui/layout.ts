
import Dagre from '@dagrejs/dagre';
import {
  Edge,
  Node
} from 'reactflow';

// get LoomNode default width from .react-flow__node-custom css class
export const defaultLoomNodeWidth = 200;
export const defaultLoomNodeHeight = 100;

const OVERLAP_RANDOMNESS_MAX = 25;

export function dagreLayout(g: Dagre.graphlib.Graph, nodes: Node[], edges: Edge[], options: any) {
  g.setGraph({ rankdir: options.direction });

  edges.forEach((edge) => g.setEdge(edge.source, edge.target));
  nodes.forEach((node) => g.setNode(node.id, {
    width: node.width ?? defaultLoomNodeWidth,
    height: node.height ?? defaultLoomNodeHeight
  }));

  Dagre.layout(g);

  return {
    nodes: nodes.map((node) => {
      const position = g.node(node.id);
      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      const x = position.x - (node.width ?? defaultLoomNodeWidth) / 2;
      const y = position.y - (node.height ?? defaultLoomNodeHeight) / 2;
      return { ...node, position: { x, y } };
    }),
    edges,
  };
};

export function basicLayout(nodes: Node[], existing_children: number, parent_x: number, parent_y: number) {
  const y = parent_y + defaultLoomNodeHeight + 25;
  const num_nodes = nodes.length;
  const pad_between_nodes = 50;
  return nodes.map((node, index) => {
    let x_pos = (parent_x - (num_nodes * defaultLoomNodeWidth / 2) +
      (index + existing_children) * defaultLoomNodeWidth + (index + existing_children) * pad_between_nodes);
    // Add OVERLAP_RANDOMNESS_MAX of randomness to the y position so that nodes don't overlap.
    return {
      ...node,
      position: {
        x: x_pos,
        y: y + Math.random() * OVERLAP_RANDOMNESS_MAX
      }
    }
  });
}