import { useMemo, FC } from 'react';
import { Node } from '../types';
import { NODE_WIDTH, NODE_HEIGHT } from '../constants';

interface MiniMapProps {
  nodes: Node[];
  viewBox: { x: number; y: number; width: number; height: number };
}

const MINIMAP_WIDTH = 250;
const PADDING = 100;

const MiniMap: FC<MiniMapProps> = ({ nodes, viewBox }) => {
  const bounds = useMemo(() => {
    if (nodes.length === 0) return { minX: 0, minY: 0, width: 1, height: 1 };
    const minX = Math.min(...nodes.map(n => n.position.x)) - PADDING;
    const minY = Math.min(...nodes.map(n => n.position.y)) - PADDING;
    const maxX = Math.max(...nodes.map(n => n.position.x + NODE_WIDTH)) + PADDING;
    const maxY = Math.max(...nodes.map(n => n.position.y + NODE_HEIGHT)) + PADDING;
    return { minX, minY, width: maxX - minX, height: maxY - minY };
  }, [nodes]);

  const scale = MINIMAP_WIDTH / bounds.width;
  const minimapHeight = bounds.height * scale;

  return (
    <div className="absolute bottom-20 left-4 z-10 bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-lg shadow-lg overflow-hidden hidden md:block">
      <svg width={MINIMAP_WIDTH} height={minimapHeight}>
        <g transform={`scale(${scale}) translate(${-bounds.minX}, ${-bounds.minY})`}>
          {/* Background Nodes */}
          {nodes.map(node => (
            <rect
              key={node.id}
              x={node.position.x}
              y={node.position.y}
              width={NODE_WIDTH}
              height={NODE_HEIGHT}
              fill="#334155"
            />
          ))}
          {/* Viewport Rectangle */}
          <rect
            x={viewBox.x}
            y={viewBox.y}
            width={viewBox.width}
            height={viewBox.height}
            fill="none"
            stroke="#f472b6"
            strokeWidth={15 / scale}
          />
        </g>
      </svg>
    </div>
  );
};

export default MiniMap;