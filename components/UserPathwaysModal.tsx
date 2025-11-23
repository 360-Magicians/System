import { useEffect, FC, ReactNode, useState } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { BriefcaseIcon, RocketIcon, CodeBracketIcon, PaintBrushIcon, UsersIcon, LightBulbIcon, WrenchScrewdriverIcon, ChartBarIcon, ShieldCheckIcon } from './icons';
import GeminiLogo from './GeminiLogo';

interface UserPathwaysModalProps {
  onClose: () => void;
}

type Suggestion = {
  title: string;
  description: string;
};

type Stage = 'Idea' | 'Build' | 'Grow' | 'Managed';

const stages: { name: Stage; icon: FC<any>; color: string; description: string; prompt: string; }[] = [
    { 
        name: 'Idea', 
        icon: LightBulbIcon,
        color: 'text-amber-400',
        description: "Spark your creativity. Generate and refine business ideas tailored for the Deaf-first market with help from MagicianCore.",
        prompt: "You are MagicianCore, an AI assistant for Deaf entrepreneurs. Generate 3 innovative business ideas for a startup focused on the Deaf community. For each idea, provide a concise title and a one-sentence description."
    },
    { 
        name: 'Build', 
        icon: WrenchScrewdriverIcon,
        color: 'text-sky-400',
        description: "Lay the foundation. Get actionable steps for creating a Minimum Viable Product (MVP) and building your core team.",
        prompt: "You are MagicianCore, an AI assistant for Deaf entrepreneurs. For a new Deaf-first tech startup, list 3 crucial first steps to build an MVP (Minimum Viable Product). For each step, provide a concise title and a one-sentence description of why it's important."
    },
    { 
        name: 'Grow', 
        icon: ChartBarIcon,
        color: 'text-lime-400',
        description: "Find your audience. Discover effective marketing strategies and growth hacks to connect your product with the Deaf community.",
        prompt: "You are MagicianCore, an AI assistant for Deaf entrepreneurs. Suggest 3 effective and culturally-aware marketing strategies to reach the Deaf community for a new tech product. For each strategy, provide a concise title and a one-sentence description."
    },
    { 
        name: 'Managed', 
        icon: ShieldCheckIcon,
        color: 'text-emerald-400',
        description: "Achieve sustainability. Learn about the key metrics to track for long-term success, compliance, and community impact.",
        prompt: "You are MagicianCore, an AI assistant for Deaf entrepreneurs. List 3 key metrics a Deaf-first startup should track to ensure long-term success and positive community impact. For each metric, provide a concise title and a one-sentence explanation."
    },
];

const LifecycleJourneyModal: FC<{ onClose: () => void }> = ({ onClose }) => {
    const [currentStage, setCurrentStage] = useState<Stage>('Idea');
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
          if (event.key === 'Escape') {
            onClose();
          }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const handleStageChange = (stage: Stage) => {
        setCurrentStage(stage);
        setSuggestions([]);
        setError(null);
    }
    
    const handleGenerate = async () => {
        setIsLoading(true);
        setError(null);
        setSuggestions([]);
        
        const stageData = stages.find(s => s.name === currentStage);
        if (!stageData) return;

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: stageData.prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                title: { type: Type.STRING },
                                description: { type: Type.STRING },
                            },
                            required: ['title', 'description'],
                        },
                    },
                },
            });
            
            const resultText = response.text.trim();
            const resultJson = JSON.parse(resultText);
            setSuggestions(resultJson);
        } catch (e) {
            setError("Failed to generate suggestions. Please try again.");
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };
    
    const activeStageData = stages.find(s => s.name === currentStage)!;
    const ActiveIcon = activeStageData.icon;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="lifecycle-title">
             <div className="relative w-full max-w-3xl bg-slate-800/90 rounded-xl border border-slate-700 shadow-2xl p-8 transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale" onClick={e => e.stopPropagation()} style={{ animationFillMode: 'forwards' }}>
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white" aria-label="Close"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg></button>
                <div className="flex items-center space-x-3"><RocketIcon className="w-8 h-8 text-amber-400" /><h2 id="lifecycle-title" className="text-2xl font-bold text-white">Entrepreneur's Journey</h2></div>
                <div className="mt-6 border-b border-slate-700 -mx-8 px-8"><div className="flex space-x-1">{stages.map((stage, index) => (<button key={stage.name} onClick={() => handleStageChange(stage.name)} aria-current={currentStage === stage.name ? 'step' : undefined} className={`py-3 px-4 font-semibold text-sm transition-colors ${currentStage === stage.name ? `${stage.color} border-b-2 ${stage.color.replace('text', 'border')}` : 'text-slate-400 hover:text-white'}`}>{stage.name}</button>))}</div></div>
                <div className="mt-6 min-h-[20rem]">
                    <div className="flex items-start gap-4">
                        <div className={`p-2 bg-slate-700/50 rounded-lg ${activeStageData.color}`}><ActiveIcon className="w-8 h-8"/></div>
                        <div>
                            <h3 className="text-xl font-bold text-white">{activeStageData.name}</h3>
                            <p className="text-slate-400 mt-1">{activeStageData.description}</p>
                        </div>
                    </div>
                    <div className="mt-6 bg-slate-900/50 p-4 rounded-lg min-h-[12rem] flex flex-col">
                        <h4 className="font-semibold text-slate-300 mb-2">Magician's Suggestions</h4>
                        {isLoading && <div className="flex-grow flex items-center justify-center"><div className="w-8 h-8 border-4 border-slate-500 border-t-pink-500 rounded-full animate-spin"></div></div>}
                        {error && <div className="flex-grow flex items-center justify-center text-rose-400">{error}</div>}
                        {!isLoading && !error && suggestions.length > 0 && (<ul className="space-y-3">{suggestions.map((s, i) => (<li key={i} className="bg-slate-800/70 p-3 rounded-md"><p className="font-semibold text-white">{s.title}</p><p className="text-sm text-slate-400">{s.description}</p></li>))}</ul>)}
                        {!isLoading && !error && suggestions.length === 0 && <div className="flex-grow flex items-center justify-center"><button onClick={handleGenerate} disabled={isLoading} className="inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-indigo-500 transition-all transform hover:scale-105 disabled:bg-slate-600 disabled:scale-100"><GeminiLogo className="w-5 h-5"/>Generate with MagicianCore</button></div>}
                    </div>
                </div>
             </div>
        </div>
    );
};

const UserPathwaysModal: FC<UserPathwaysModalProps> = ({ onClose }) => {
  const [isJourneyModalOpen, setIsJourneyModalOpen] = useState(false);
  
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
  
  const pathways = [
    {
      icon: <BriefcaseIcon className="w-8 h-8 text-sky-400" />,
      title: 'The Job Seeker',
      description: 'Leverage the Employment Pathway, powered by the JobMagician, to find career opportunities, match your skills to job descriptions, and prepare for interviews.',
      action: null,
    },
    {
      icon: <RocketIcon className="w-8 h-8 text-amber-400" />,
      title: 'The Entrepreneur / Business Owner',
      description: 'Embark on an AI-guided journey from Idea to Build, and from Grow to Manage. Specialized AI Magicians support each stage, helping you validate concepts, create plans, find customers, and operate your venture.',
      action: () => setIsJourneyModalOpen(true),
    },
    {
      icon: <CodeBracketIcon className="w-8 h-8 text-teal-400" />,
      title: 'The Developer',
      description: 'Explore the system\'s technical architecture. Interact with the APIs, understand the data flows, and see how cloud-native services can be orchestrated to build a powerful platform.',
      action: null,
    },
    {
      icon: <PaintBrushIcon className="w-8 h-8 text-fuchsia-400" />,
      title: 'The Creative',
      description: 'Turn your passion into a business. Use the IdeaMagician to brainstorm how your creative talents can become a viable company, and let the GrowthMagician find your audience.',
      action: null,
    },
  ];

  const PathwayCard: FC<{ icon: ReactNode, title: string, description: string, action: (() => void) | null }> = ({ icon, title, description, action }) => (
    <div className="bg-slate-900/50 p-6 rounded-lg flex flex-col sm:flex-row items-start sm:space-x-4">
      <div className="flex-shrink-0 mb-4 sm:mb-0">{icon}</div>
      <div className="flex-grow">
        <h3 className="font-bold text-white text-lg">{title}</h3>
        <p className="text-slate-400 text-sm mt-1">{description}</p>
        {action && (
            <button onClick={action} className="mt-4 bg-amber-500/80 text-white font-semibold px-4 py-2 rounded-lg hover:bg-amber-500 transition-colors">
                Begin Journey
            </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-40 p-4"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div
          className="relative w-full max-w-2xl bg-slate-800 rounded-xl border border-slate-700 shadow-2xl shadow-slate-900/50 p-8 transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale"
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
            <UsersIcon className="w-8 h-8 text-pink-400" />
            <h2 id="modal-title" className="text-2xl font-bold text-white">Who is this for?</h2>
          </div>
          
          <p className="mt-2 text-slate-400">
            This system is designed for a diverse range of users, each with a unique pathway to success.
          </p>

          <div className="mt-6 space-y-4">
            {pathways.map((path, index) => (
              <PathwayCard key={index} {...path} />
            ))}
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
      {isJourneyModalOpen && <LifecycleJourneyModal onClose={() => setIsJourneyModalOpen(false)} />}
    </>
  );
};

export default UserPathwaysModal;