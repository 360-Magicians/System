import { FC } from 'react';
import { Node, ComponentType } from '../types';

interface KeyComponentsSidebarProps {
  nodes: Node[];
  onNodeSelect: (nodeId: string) => void;
}

const keyComponentTypes: ComponentType[] = [
  ComponentType.USER_INTERFACE,
  ComponentType.AI_CORE,
  ComponentType.DATABASE,
  ComponentType.ACCESSIBILITY,
  ComponentType.ETHICS,
];

const KeyComponentsSidebar: FC<KeyComponentsSidebarProps> = ({ nodes, onNodeSelect }) => {
  const keyNodes = nodes.filter(node => keyComponentTypes.includes(node.type));

  return (
    <div className="absolute top-1/2 -translate-y-1/2 left-4 z-10 bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-lg shadow-lg p-3 hidden lg:block">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-1">Key Components</h3>
      <ul className="space-y-1">
        {keyNodes.map(node => (
          <li key={node.id}>
            <button
              onClick={() => onNodeSelect(node.id)}
              className="w-full text-left text-sm text-slate-300 hover:bg-slate-700/50 px-2 py-1.5 rounded-md transition-colors"
            >
              {node.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default KeyComponentsSidebar;