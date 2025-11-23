import { useEffect, useMemo, useState, FC } from 'react';
import { Node, ComponentType } from '../types';
import { TableCellsIcon } from './icons';

interface SystemOverviewModalProps {
  nodes: Node[];
  onClose: () => void;
}

const typeOrder: ComponentType[] = [
    ComponentType.USER_INTERFACE,
    ComponentType.AUTH_SERVICE,
    ComponentType.BACKEND_API,
    ComponentType.ACCESSIBILITY,
    ComponentType.ETHICS,
    ComponentType.AI_CORE,
    ComponentType.AI_AGENT,
    ComponentType.AI_MODEL,
    ComponentType.MESSAGING,
    ComponentType.DATABASE,
    ComponentType.ANALYTICS,
    ComponentType.INFRASTRUCTURE,
    ComponentType.MONITORING,
    ComponentType.ECOSYSTEM_SERVICE,
    ComponentType.EXTERNAL_API,
    ComponentType.GOVERNANCE,
];

const getTypeName = (type: ComponentType) => type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

const SystemOverviewModal: FC<SystemOverviewModalProps> = ({ nodes, onClose }) => {
  const [copyButtonText, setCopyButtonText] = useState('Copy as Markdown');
    
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const groupedNodes = useMemo(() => {
    const groups = new Map<ComponentType, Node[]>();
    nodes.forEach(node => {
      const group = groups.get(node.type) || [];
      group.push(node);
      groups.set(node.type, group);
    });
    
    // Sort groups based on predefined order
    return new Map([...groups.entries()].sort(([a], [b]) => typeOrder.indexOf(a) - typeOrder.indexOf(b)));
  }, [nodes]);

  const handleCopyToClipboard = () => {
    let markdown = '';
    
    groupedNodes.forEach((groupNodes, type) => {
        markdown += `### ${getTypeName(type)}\n\n`;
        markdown += '| ID | Name | Description | GCP Equivalent | AWS Equivalent | Azure Equivalent |\n';
        markdown += '|----|------|-------------|----------------|----------------|------------------|\n';
        groupNodes.forEach(node => {
            const description = node.description.replace(/\n/g, ' ').replace(/\|/g, '\\|');
            markdown += `| \`${node.id}\` | ${node.name} | ${description} | ${node.equivalents?.gcp || '-'} | ${node.equivalents?.aws || '-'} | ${node.equivalents?.azure || '-'} |\n`;
        });
        markdown += '\n';
    });
    
    navigator.clipboard.writeText(markdown).then(() => {
        setCopyButtonText('Copied!');
        setTimeout(() => setCopyButtonText('Copy as Markdown'), 2000);
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="relative w-full max-w-7xl h-[90vh] bg-slate-800 rounded-xl border border-slate-700 shadow-2xl shadow-slate-900/50 flex flex-col transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale"
        onClick={(e) => e.stopPropagation()}
        style={{ animationFillMode: 'forwards' }}
      >
        <header className="flex-shrink-0 flex items-center justify-between p-6 border-b border-slate-700">
             <div className="flex items-center space-x-3">
                <TableCellsIcon className="w-8 h-8 text-pink-400" />
                <h2 id="modal-title" className="text-2xl font-bold text-white">System Components Overview</h2>
            </div>
            <div className="flex items-center gap-4">
                <button
                    onClick={handleCopyToClipboard}
                    className="bg-slate-700 text-slate-200 font-semibold px-4 py-2 rounded-lg hover:bg-slate-600 transition-colors"
                >
                    {copyButtonText}
                </button>
                <button
                onClick={onClose}
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="Close"
                >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
                </button>
            </div>
        </header>
        
        <div className="flex-grow overflow-y-auto p-6 custom-scrollbar">
            <div className="w-full text-left text-slate-300">
                {Array.from(groupedNodes.entries()).map(([type, groupNodes]) => (
                    <div key={type} className="mb-10">
                        <h3 className="text-xl font-semibold text-pink-400 mb-4 border-b-2 border-pink-400/20 pb-2">{getTypeName(type)}</h3>
                        <div className="overflow-x-auto">
                           <table className="min-w-full divide-y divide-slate-700">
                                <thead className="bg-slate-900/50">
                                <tr>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">ID</th>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Name</th>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Description</th>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">GCP</th>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">AWS</th>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Azure</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700/50">
                                {groupNodes.map(node => (
                                    <tr key={node.id} className="hover:bg-slate-700/30">
                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-slate-400">`{node.id}`</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-white">{node.name}</td>
                                    <td className="px-4 py-4 text-sm text-slate-300 max-w-md">{node.description}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-400">{node.equivalents?.gcp || '-'}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-400">{node.equivalents?.aws || '-'}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-400">{node.equivalents?.azure || '-'}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
            </div>
        </div>

      </div>
      <style>{`
        @keyframes fade-in-scale {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in-scale {
          animation: fade-in-scale 0.2s ease-out;
        }
        .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(0,0,0,0.2);
            border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #4a5568; /* slate-600 */
            border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #718096; /* slate-500 */
        }
      `}</style>
    </div>
  );
};

export default SystemOverviewModal;