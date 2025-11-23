import { useEffect, FC } from 'react';
import { ComponentType } from '../types';
import { 
  UserInterfaceIcon, BackendApiIcon, AiCoreIcon, AiAgentIcon, DatabaseIcon, MessagingIcon, AnalyticsIcon, EcosystemServiceIcon, AccessibilityIcon, EthicsIcon, ExternalApiIcon, GovernanceIcon, InfrastructureIcon, MonitoringIcon, AiModelIcon, AuthServiceIcon, InformationCircleIcon
} from './icons';

interface LegendModalProps {
  onClose: () => void;
}

const typeDetails: { [key in ComponentType]: { Icon: FC<any>; color: string; name: string; description: string } } = {
  [ComponentType.USER_INTERFACE]: { Icon: UserInterfaceIcon, color: 'text-sky-400', name: 'User Interface', description: 'Components users directly interact with (e.g., web/mobile apps).' },
  [ComponentType.AUTH_SERVICE]: { Icon: AuthServiceIcon, color: 'text-emerald-400', name: 'Auth Service', description: 'Services responsible for user identity, authentication, and security.' },
  [ComponentType.BACKEND_API]: { Icon: BackendApiIcon, color: 'text-teal-400', name: 'Backend API', description: 'Gateways that handle business logic and data processing.' },
  [ComponentType.ACCESSIBILITY]: { Icon: AccessibilityIcon, color: 'text-pink-400', name: 'Accessibility', description: 'Core services focused on accessibility and inclusion.' },
  [ComponentType.ETHICS]: { Icon: EthicsIcon, color: 'text-red-500', name: 'Ethics', description: 'Components ensuring fairness, trust, and ethical AI behavior.' },
  [ComponentType.AI_CORE]: { Icon: AiCoreIcon, color: 'text-purple-400', name: 'AI Core', description: 'Central orchestrator for AI agents and models.' },
  [ComponentType.AI_AGENT]: { Icon: AiAgentIcon, color: 'text-purple-400', name: 'AI Agent', description: 'Specialized AI workers that perform specific tasks.' },
  [ComponentType.AI_MODEL]: { Icon: AiModelIcon, color: 'text-purple-400', name: 'AI Model', description: 'Trained models for specific tasks like translation or generation.' },
  [ComponentType.MESSAGING]: { Icon: MessagingIcon, color: 'text-orange-400', name: 'Messaging', description: 'Services for asynchronous communication (e.g., event buses, queues).' },
  [ComponentType.DATABASE]: { Icon: DatabaseIcon, color: 'text-amber-400', name: 'Database', description: 'Systems for storing and retrieving operational data.' },
  [ComponentType.ANALYTICS]: { Icon: AnalyticsIcon, color: 'text-lime-400', name: 'Analytics', description: 'Data warehouses for large-scale analysis and business intelligence.' },
  [ComponentType.INFRASTRUCTURE]: { Icon: InfrastructureIcon, color: 'text-slate-400', name: 'Infrastructure', description: 'Core resources for hosting, building, and running the system.' },
  [ComponentType.MONITORING]: { Icon: MonitoringIcon, color: 'text-yellow-400', name: 'Monitoring', description: 'Tools for observing system health (logs, metrics, alerts).' },
  [ComponentType.ECOSYSTEM_SERVICE]: { Icon: EcosystemServiceIcon, color: 'text-indigo-400', name: 'Ecosystem Service', description: 'Internal services that support the broader system.' },
  [ComponentType.EXTERNAL_API]: { Icon: ExternalApiIcon, color: 'text-cyan-400', name: 'External API', description: 'Integrations with third-party services and data sources.' },
  [ComponentType.GOVERNANCE]: { Icon: GovernanceIcon, color: 'text-violet-400', name: 'Governance', description: 'Systems for community validation, voting, and decision-making.' },
};

const orderedTypes = [
    ComponentType.USER_INTERFACE,
    ComponentType.AUTH_SERVICE,
    ComponentType.BACKEND_API,
    ComponentType.ACCESSIBILITY,
    ComponentType.ETHICS,
    ComponentType.AI_CORE,
    ComponentType.AI_AGENT,
    ComponentType.AI_MODEL,
    ComponentType.DATABASE,
    ComponentType.MESSAGING,
    ComponentType.ANALYTICS,
    ComponentType.INFRASTRUCTURE,
    ComponentType.MONITORING,
    ComponentType.ECOSYSTEM_SERVICE,
    ComponentType.EXTERNAL_API,
    ComponentType.GOVERNANCE,
];

const statusDetails = [
  { name: 'Active', color: 'bg-[#34d399]', description: 'Component is running and processing requests normally.' },
  { name: 'Idle', color: 'bg-[#64748b]', description: 'Component is running but not currently processing requests.' },
  { name: 'Warning', color: 'bg-[#f59e0b]', description: 'Component may have issues that affect performance (e.g., high CPU).' },
  { name: 'Error', color: 'bg-[#f43f5e]', description: 'Component has failed or is in an error state.' },
];

const LegendModal: FC<LegendModalProps> = ({ onClose }) => {
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

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="relative w-full max-w-4xl bg-slate-800 rounded-xl border border-slate-700 shadow-2xl shadow-slate-900/50 p-8 transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale"
        onClick={(e) => e.stopPropagation()}
        style={{ animationFillMode: 'forwards' }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="flex items-center space-x-3 mb-6">
          <InformationCircleIcon className="w-8 h-8 text-pink-400" />
          <h2 id="modal-title" className="text-2xl font-bold text-white">Legend</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 sticky top-0 bg-slate-800 py-1">Component Types</h3>
            <div className="space-y-4">
              {orderedTypes.map(type => {
                const details = typeDetails[type];
                const { Icon, color, name, description } = details;
                return (
                  <div key={type} className="flex items-start space-x-4 p-3 bg-slate-900/50 rounded-lg">
                    <div className={`flex-shrink-0 w-8 h-8 ${color}`}><Icon /></div>
                    <div>
                      <h4 className={`font-bold text-white`}>{name}</h4>
                      <p className="text-slate-400 text-sm">{description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 sticky top-0 bg-slate-800 py-1">Status Indicators</h3>
            <div className="space-y-4">
              {statusDetails.map(status => (
                <div key={status.name} className="flex items-start space-x-4 p-3 bg-slate-900/50 rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                    <span className="relative flex h-4 w-4">
                      { (status.name === 'Warning' || status.name === 'Error') &&
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75`} style={{backgroundColor: status.color}}></span>
                      }
                      <span className={`relative inline-flex rounded-full h-4 w-4`} style={{backgroundColor: status.color}}></span>
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{status.name}</h4>
                    <p className="text-slate-400 text-sm">{status.description}</p>
                  </div>
                </div>
              ))}
            </div>
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

export default LegendModal;
