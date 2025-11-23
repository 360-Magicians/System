import { useState, useEffect, useRef, useMemo, FC, MouseEvent, WheelEvent } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { NODES, EDGES, NODE_WIDTH, NODE_HEIGHT } from './constants';
import { Node, ComponentType } from './types';
import NodeDetailModal from './components/NodeDetailModal';
import GenerationResultModal from './components/GenerationResultModal';
import UserPathwaysModal from './components/UserPathwaysModal';
import SystemOverviewModal from './components/SystemOverviewModal';
import AiAssistant from './components/AiAssistant';
import LegendModal from './components/LegendModal';
import KeyComponentsSidebar from './components/KeyComponentsSidebar';
import ArchitectureNode from './components/ArchitectureNode';
import MiniMap from './components/MiniMap';
import ViewControls from './components/ViewControls';
import { SpeakerWaveIcon, SpeakerXMarkIcon, UsersIcon, TableCellsIcon, InformationCircleIcon } from './components/icons';

type CloudProvider = 'default' | 'gcp' | 'aws' | 'azure';

interface GenerationResult {
  summary: string;
  partner: 'gcp' | 'aws' | 'azure';
}

const INITIAL_VIEWBOX = { x: -200, y: 0, width: 2200, height: 1650 };

const App: FC = () => {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  
  // Initialize highlighted nodes with BACKEND_API and AI_CORE types
  const [highlightedNodeIds, setHighlightedNodeIds] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    NODES.forEach(node => {
      if (node.type === ComponentType.BACKEND_API || node.type === ComponentType.AI_CORE) {
        initial.add(node.id);
      }
    });
    return initial;
  });

  const [isDeafMode, setIsDeafMode] = useState<boolean>(false);
  const [cloudProvider, setCloudProvider] = useState<CloudProvider>('default');

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationResult, setGenerationResult] = useState<GenerationResult | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [generationTraceId, setGenerationTraceId] = useState<string | null>(null);

  const [isLegendVisible, setIsLegendVisible] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [isPathwaysModalOpen, setIsPathwaysModalOpen] = useState(false);
  const [isOverviewModalOpen, setIsOverviewModalOpen] = useState(false);

  const [viewBox, setViewBox] = useState(INITIAL_VIEWBOX);
  const [isDragging, setIsDragging] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const panState = useRef({ startPoint: { x: 0, y: 0 }, startViewBox: { x: 0, y: 0 } });
  
  const nodeMap = useMemo(() => new Map(NODES.map(node => [node.id, node])), []);

  const toggleAudioPlayback = () => {
    if (audioRef.current) {
      if (isAudioPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsAudioPlaying(!isAudioPlaying);
    }
  };

  useEffect(() => {
    const audioElement = audioRef.current;
    const handleAudioEnd = () => setIsAudioPlaying(false);

    if (audioElement) {
      audioElement.addEventListener('ended', handleAudioEnd);
      return () => {
        audioElement.removeEventListener('ended', handleAudioEnd);
      };
    }
  }, []);

  const handleGenerateArchitecture = async () => {
    const traceId = `trace-${crypto.randomUUID().slice(0, 8)}`;
    setGenerationTraceId(traceId);
    setIsGenerating(true);
    setGenerationError(null);
    setGenerationResult(null);

    const nodeNames = NODES.map(node => node.name).join(', ');
    const prompt = `Based on an application architecture featuring these components: ${nodeNames}, and with a user preference for the ${cloudProvider} ecosystem, provide a brief, one-paragraph summary highlighting its key capabilities. Also, recommend the most suitable primary cloud partner for implementation. Your response must be in JSON format. The JSON object should have two keys: "summary" (a string) and "partner" (a string, which must be a value of 'gcp', 'aws', or 'azure').`;
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              partner: { type: Type.STRING },
            },
            required: ['summary', 'partner'],
          },
        },
      });
      
      const resultText = response.text.trim();
      const resultJson = JSON.parse(resultText);
      const resultData = Array.isArray(resultJson) ? resultJson[0] : resultJson;
      setGenerationResult(resultData);
    } catch (error) {
      setGenerationError("Failed to generate summary. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNodeClick = (node: Node) => {
    setSelectedNode(node);
    setHighlightedNodeIds(new Set([node.id]));
  };
  
  const handleNavigateToNode = (nodeId: string) => {
    const node = nodeMap.get(nodeId);
    if (node) {
        handleNodeClick(node); // This will trigger the useEffect below to pan/zoom
    }
  };
  
  useEffect(() => {
    // This effect handles "navigating" to a node by panning/zooming the viewbox
    if (highlightedNodeIds.size === 1) {
      const nodeId = highlightedNodeIds.values().next().value;
      const node = nodeMap.get(nodeId);
      const svg = svgRef.current;
      if (node && svg) {
        const targetWidth = 1200; // The desired zoom level (smaller is more zoomed in)
        const svgRatio = svg.clientHeight / svg.clientWidth;
        const targetHeight = targetWidth * svgRatio;

        setViewBox({
          width: targetWidth,
          height: targetHeight,
          x: node.position.x + NODE_WIDTH / 2 - targetWidth / 2,
          y: node.position.y + NODE_HEIGHT / 2 - targetHeight / 2,
        });
      }
    }
  }, [highlightedNodeIds, nodeMap]);


  const handleAiCommand = (command: string, args: string[]) => {
    if (command === 'HIGHLIGHT') {
        const newHighlights = new Set<string>();
        args.forEach(nodeId => {
            if (nodeMap.has(nodeId)) {
                newHighlights.add(nodeId);
            }
        });
        setHighlightedNodeIds(newHighlights);
        // If only one node is highlighted, also select it for the detail modal
        if (newHighlights.size === 1) {
             const node = nodeMap.get(args[0]);
             if (node) setSelectedNode(node);
        }
    } else if (command === 'CLEAR') {
        setHighlightedNodeIds(new Set());
        setSelectedNode(null);
    }
  };

  // --- Pan and Zoom Handlers ---
  const handleMouseDown = (e: MouseEvent<SVGSVGElement>) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    panState.current.startPoint = { x: e.clientX, y: e.clientY };
    panState.current.startViewBox = { x: viewBox.x, y: viewBox.y };
  };

  const handleMouseMove = (e: MouseEvent<SVGSVGElement>) => {
    if (!isDragging || !svgRef.current || svgRef.current.clientWidth <= 0) return;
    
    const scale = viewBox.width / svgRef.current.clientWidth;
    // Ensure scale is a valid number before calculating deltas
    if (!isFinite(scale)) return;

    const dx = (e.clientX - panState.current.startPoint.x) * scale;
    const dy = (e.clientY - panState.current.startPoint.y) * scale;
    
    // Ensure the calculated position deltas are valid numbers
    if (!isFinite(dx) || !isFinite(dy)) return;

    setViewBox(vb => ({
      ...vb,
      x: panState.current.startViewBox.x - dx,
      y: panState.current.startViewBox.y - dy,
    }));
  };
  
  const handleMouseUp = () => setIsDragging(false);

  const handleWheel = (e: WheelEvent<SVGSVGElement>) => {
    e.preventDefault();
    const svg = svgRef.current;
    if (!svg) return;

    const scaleFactor = 1.1;
    const { clientX, clientY } = e;
    
    const screenCTM = svg.getScreenCTM();
    // If we can't get the CTM, we can't calculate the zoom point correctly.
    if (!screenCTM) return;

    const point = new DOMPoint(clientX, clientY);
    const svgPoint = point.matrixTransform(screenCTM.inverse());
    
    // Ensure the transformed point is valid
    if (!isFinite(svgPoint.x) || !isFinite(svgPoint.y)) return;
    
    const newWidth = e.deltaY > 0 ? viewBox.width * scaleFactor : viewBox.width / scaleFactor;
    const newHeight = e.deltaY > 0 ? viewBox.height * scaleFactor : viewBox.height / scaleFactor;
    
    // Prevent zooming to an invalid or zero size
    if (newWidth <= 0 || newHeight <= 0 || !isFinite(newWidth) || !isFinite(newHeight)) return;

    // Calculate the difference in position needed to keep the cursor centered
    const dx = (svgPoint.x - viewBox.x) * (newWidth / viewBox.width - 1);
    const dy = (svgPoint.y - viewBox.y) * (newHeight / viewBox.height - 1);

    // Ensure the position delta is a valid number
    if (!isFinite(dx) || !isFinite(dy)) return;

    setViewBox({
      x: viewBox.x - dx,
      y: viewBox.y - dy,
      width: newWidth,
      height: newHeight
    });
  };

  const handleZoom = (factor: number) => {
    const svg = svgRef.current;
    if (!svg) return;

    const centerX = viewBox.x + viewBox.width / 2;
    const centerY = viewBox.y + viewBox.height / 2;
    const newWidth = viewBox.width * factor;
    const newHeight = viewBox.height * factor;

    setViewBox({
      x: centerX - newWidth / 2,
      y: centerY - newHeight / 2,
      width: newWidth,
      height: newHeight
    });
  };

  const handleResetView = () => {
    setViewBox(INITIAL_VIEWBOX);
    setHighlightedNodeIds(new Set());
    setSelectedNode(null);
  };

  const CloudProviderButton: FC<{ provider: CloudProvider, label: string }> = ({ provider, label }) => (
    <button
      onClick={() => setCloudProvider(provider)}
      aria-pressed={cloudProvider === provider}
      className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-pink-500
        ${cloudProvider === provider ? 'bg-pink-500 text-white shadow-md' : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'}`}
    >
      {label}
    </button>
  );

  return (
    <>
      <style>{`
        @keyframes pulse-warning {
          0%, 100% {
            opacity: 0.7;
            transform: scale(1);
          }
          50% {
            opacity: 0.2;
            transform: scale(1.8);
          }
        }
        @keyframes pulse-error {
          0%, 100% {
            opacity: 0.8;
            transform: scale(1);
          }
          50% {
            opacity: 0.2;
            transform: scale(2);
          }
        }
        .pulse-warning {
          animation: pulse-warning 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .pulse-error {
          animation: pulse-error 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
      <audio ref={audioRef} src={'https://storage.googleapis.com/magicians-deaf-first-assets/system-explanation.mp3'} preload="auto" />
      <div className="h-screen w-full bg-slate-900 flex flex-col">
        <header className="absolute top-0 left-0 right-0 z-20 p-4">
          <div className="w-full max-w-7xl mx-auto flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Deaf First Magicians System</h1>
              <div className="flex items-center gap-2 mt-2">
                 <div className={`flex items-center space-x-2 p-1 bg-slate-800/50 rounded-full border transition-all duration-300 ${isDeafMode ? 'border-pink-500/50' : 'border-slate-700'}`}>
                    <span className={`px-2 text-xs font-semibold ${!isDeafMode ? 'text-white' : 'text-slate-400'}`}>Hearing</span>
                    <label htmlFor="deaf-mode-toggle" className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" role="switch" id="deaf-mode-toggle" className="sr-only peer" checked={isDeafMode} onChange={() => setIsDeafMode(!isDeafMode)} aria-label="Toggle Deaf Mode" />
                      <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-focus:ring-2 peer-focus:ring-pink-500/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                    </label>
                    <span className={`px-2 text-xs font-semibold ${isDeafMode ? 'text-pink-400' : 'text-slate-400'}`}>Deaf</span>
                </div>
                 <div className="flex items-center space-x-1 p-1 bg-slate-800/50 rounded-full border border-slate-700">
                  <CloudProviderButton provider="default" label="Default" />
                  <CloudProviderButton provider="gcp" label="GCP" />
                  <CloudProviderButton provider="aws" label="AWS" />
                  <CloudProviderButton provider="azure" label="Azure" />
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={() => setIsLegendVisible(true)} aria-label="View Legend" className="h-10 w-10 bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700/90 transition-all duration-200"><InformationCircleIcon className="w-5 h-5" /></button>
              <button onClick={() => setIsOverviewModalOpen(true)} aria-label="View system overview" className="h-10 w-10 bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700/90 transition-all duration-200"><TableCellsIcon className="w-5 h-5" /></button>
              <button onClick={() => setIsPathwaysModalOpen(true)} aria-label="View user pathways" className="h-10 w-10 bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700/90 transition-all duration-200"><UsersIcon className="w-5 h-5" /></button>
              <button onClick={toggleAudioPlayback} aria-label={isAudioPlaying ? "Pause audio" : "Play audio"} className="h-10 w-10 bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700/90 transition-all duration-200">{isAudioPlaying ? <SpeakerXMarkIcon className="w-5 h-5" /> : <SpeakerWaveIcon className="w-5 h-5" />}</button>
            </div>
          </div>
        </header>

        <main className={`flex-1 relative overflow-hidden ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
           <svg
             ref={svgRef}
             width="100%"
             height="100%"
             viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
             onMouseDown={handleMouseDown}
             onMouseMove={handleMouseMove}
             onWheel={handleWheel}
             className="bg-slate-900"
           >
            {EDGES.map(edge => {
                const sourceNode = nodeMap.get(edge.source);
                const targetNode = nodeMap.get(edge.target);
                if (!sourceNode || !targetNode) return null;
                
                const isHighlighted = highlightedNodeIds.has(edge.source) || highlightedNodeIds.has(edge.target);
                const isDimmed = highlightedNodeIds.size > 0 && !isHighlighted;
                
                return (
                  <line
                    key={edge.id}
                    x1={sourceNode.position.x + NODE_WIDTH / 2}
                    y1={sourceNode.position.y + NODE_HEIGHT / 2}
                    x2={targetNode.position.x + NODE_WIDTH / 2}
                    y2={targetNode.position.y + NODE_HEIGHT / 2}
                    stroke={isHighlighted ? '#a78bfa' : '#475569'}
                    strokeWidth={isHighlighted ? 2.5 : 1.5}
                    opacity={isDimmed ? 0.2 : 0.8}
                    style={{ transition: 'all 0.3s ease-in-out' }}
                  />
                );
            })}
            {NODES.map(node => (
                <ArchitectureNode
                    key={node.id}
                    node={node}
                    isDeafMode={isDeafMode}
                    cloudProvider={cloudProvider}
                    isHighlighted={highlightedNodeIds.has(node.id)}
                    isDimmed={highlightedNodeIds.size > 0 && !highlightedNodeIds.has(node.id)}
                    onClick={() => handleNodeClick(node)}
                />
            ))}
           </svg>
           <ViewControls onZoomIn={() => handleZoom(0.8)} onZoomOut={() => handleZoom(1.25)} onReset={handleResetView} />
           <MiniMap nodes={NODES} viewBox={viewBox} />
        </main>
        
        <KeyComponentsSidebar nodes={NODES} onNodeSelect={handleNavigateToNode} />
        <AiAssistant onCommand={handleAiCommand} onGenerateSummary={handleGenerateArchitecture} isGenerating={isGenerating} />
      </div>
      
      {selectedNode && (
        <NodeDetailModal 
          key={selectedNode.id}
          node={selectedNode}
          nodes={NODES}
          edges={EDGES}
          isDeafMode={isDeafMode} 
          onClose={() => {
            setSelectedNode(null);
            setHighlightedNodeIds(new Set());
          }} 
          onNavigate={handleNavigateToNode}
          feedback={[]}
          onFeedbackSubmit={() => {}}
        />
      )}
      {generationResult && (
        <GenerationResultModal 
          result={generationResult} 
          onClose={() => {
            setGenerationResult(null);
            setGenerationTraceId(null);
          }} 
          traceId={generationTraceId}
        />
      )}
      {isPathwaysModalOpen && <UserPathwaysModal onClose={() => setIsPathwaysModalOpen(false)} />}
      {isOverviewModalOpen && <SystemOverviewModal nodes={NODES} onClose={() => setIsOverviewModalOpen(false)} />}
      {isLegendVisible && <LegendModal onClose={() => setIsLegendVisible(false)} />}
      {generationError && (
         <div className="fixed bottom-24 right-4 bg-rose-500 text-white px-6 py-3 rounded-lg shadow-lg" role="alert">
          {generationError}
        </div>
      )}
       {isGenerating && generationTraceId && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-slate-700/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg shadow-lg z-50" role="status">
          <p>Generating summary... <span className="font-mono text-sm">Trace ID: <span className="text-pink-400">{generationTraceId}</span></span></p>
        </div>
      )}
    </>
  );
};

export default App;