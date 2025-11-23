import { useEffect, FC } from 'react';
import GeminiLogo from './GeminiLogo';

interface GenerationResultModalProps {
  result: {
    summary: string;
    partner: 'gcp' | 'aws' | 'azure';
  };
  onClose: () => void;
  traceId: string | null;
}

const partnerDetails = {
  gcp: { name: 'Google Cloud', color: 'border-blue-500' },
  aws: { name: 'Amazon Web Services', color: 'border-orange-500' },
  azure: { name: 'Microsoft Azure', color: 'border-sky-500' },
};

const GenerationResultModal: FC<GenerationResultModalProps> = ({ result, onClose, traceId }) => {
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

  const details = partnerDetails[result.partner];
  const buildLink = `https://build.mbtq.dev/${result.partner}`;
  const agentDeployLink = `https://agents.mbtq.dev/invite?partner=${result.partner}`;

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className={`relative w-full max-w-2xl bg-slate-800 rounded-xl border ${details.color} shadow-2xl shadow-slate-900/50 p-8 transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale`}
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
        
        <div className="flex items-center space-x-3">
          <GeminiLogo className="w-8 h-8" />
          <h2 id="modal-title" className="text-2xl font-bold text-white">Architecture Analysis Complete</h2>
        </div>

        <div className="mt-6 text-slate-300 space-y-4">
          <p>{result.summary}</p>
          <p>
            Based on this analysis, the recommended implementation partner is <strong className="font-semibold text-white">{details.name}</strong>.
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-700">
            {traceId && <p className="text-xs text-slate-500 font-mono">Trace ID: {traceId}</p>}
        </div>

        <div className="mt-8 text-slate-300 text-right">
          <p className="mb-4 text-sm text-slate-400">
            Take the next step by deploying your AI agents to a managed, serverless environment for monitoring and execution.
          </p>
          <div className="flex flex-wrap justify-end gap-4">
             <a
              href={agentDeployLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-purple-600 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-purple-500 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-purple-500"
            >
              Deploy Agents
            </a>
            <a
              href={buildLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-green-600 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-green-500 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-green-500"
            >
              Ready to Build
            </a>
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
      `}</style>
    </div>
  );
};

export default GenerationResultModal;