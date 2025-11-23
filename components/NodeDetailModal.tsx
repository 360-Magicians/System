import { useEffect, useState, useMemo, FC, FormEvent, ReactNode } from 'react';
import { GoogleGenAI } from '@google/genai';
import { marked } from 'marked';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { Node, Edge, MetricDataPoint } from '../types';
import { ComponentType } from '../types';
import { 
  UserInterfaceIcon, BackendApiIcon, AiCoreIcon, AiAgentIcon, DatabaseIcon, MessagingIcon, AnalyticsIcon, EcosystemServiceIcon, AccessibilityIcon, EthicsIcon, ExternalApiIcon, GovernanceIcon, InfrastructureIcon, MonitoringIcon, AiModelIcon, AuthServiceIcon, CheckCircleIcon, XCircleIcon, ClockIcon, ExclamationCircleIcon,
  LatencyIcon, ErrorRateIcon, CpuIcon, CostIcon, CommandLineIcon, DocumentTextIcon, CubeTransparentIcon, CurrencyDollarIcon
} from './icons';
import GeminiLogo from './GeminiLogo';

interface NodeDetailModalProps {
  node: Node;
  nodes: Node[];
  edges: Edge[];
  isDeafMode: boolean;
  onClose: () => void;
  onNavigate: (nodeId: string) => void;
  feedback: { comment: string }[];
  onFeedbackSubmit: (comment: string) => void;
}

const typeDetails: { [key in ComponentType]: { Icon: FC<any>; color: string; name: string; } } = {
    [ComponentType.USER_INTERFACE]: { Icon: UserInterfaceIcon, color: 'text-sky-400', name: 'User Interface' },
    [ComponentType.BACKEND_API]: { Icon: BackendApiIcon, color: 'text-teal-400', name: 'Backend API' },
    [ComponentType.AI_CORE]: { Icon: AiCoreIcon, color: 'text-purple-400', name: 'AI Core' },
    [ComponentType.AI_AGENT]: { Icon: AiAgentIcon, color: 'text-purple-400', name: 'AI Agent' },
    [ComponentType.DATABASE]: { Icon: DatabaseIcon, color: 'text-amber-400', name: 'Database' },
    [ComponentType.MESSAGING]: { Icon: MessagingIcon, color: 'text-orange-400', name: 'Messaging' },
    [ComponentType.ANALYTICS]: { Icon: AnalyticsIcon, color: 'text-lime-400', name: 'Analytics' },
    [ComponentType.ECOSYSTEM_SERVICE]: { Icon: EcosystemServiceIcon, color: 'text-indigo-400', name: 'Ecosystem Service' },
    [ComponentType.ACCESSIBILITY]: { Icon: AccessibilityIcon, color: 'text-pink-400', name: 'Accessibility' },
    [ComponentType.ETHICS]: { Icon: EthicsIcon, color: 'text-red-500', name: 'Ethics' },
    [ComponentType.EXTERNAL_API]: { Icon: ExternalApiIcon, color: 'text-cyan-400', name: 'External API' },
    [ComponentType.GOVERNANCE]: { Icon: GovernanceIcon, color: 'text-violet-400', name: 'Governance' },
    [ComponentType.INFRASTRUCTURE]: { Icon: InfrastructureIcon, color: 'text-slate-400', name: 'Infrastructure' },
    [ComponentType.MONITORING]: { Icon: MonitoringIcon, color: 'text-yellow-400', name: 'Monitoring' },
    [ComponentType.AI_MODEL]: { Icon: AiModelIcon, color: 'text-purple-400', name: 'AI Model' },
    [ComponentType.AUTH_SERVICE]: { Icon: AuthServiceIcon, color: 'text-emerald-400', name: 'Auth Service' },
};

const verificationStatusDetails = {
  verified: { Icon: CheckCircleIcon, color: 'text-green-400', label: 'Verified' },
  partial: { Icon: ExclamationCircleIcon, color: 'text-amber-400', label: 'Partial' },
  pending: { Icon: ClockIcon, color: 'text-sky-400', label: 'Pending' },
  failed: { Icon: XCircleIcon, color: 'text-rose-400', label: 'Failed' },
  unverified: { Icon: () => null, color: '', label: 'Unverified' },
};

const CodeBlock: FC<{ title: string, content: object }> = ({ title, content }) => {
  const isContentEmpty = Object.keys(content).length === 0 && content.constructor === Object;

  return (
    <div>
      <h4 className="font-semibold text-slate-300 mb-2">{title}</h4>
      <pre className="text-xs bg-slate-900/70 p-4 rounded-lg overflow-x-auto custom-scrollbar" style={{ minHeight: '120px' }}>
        <code className="font-mono">
          {isContentEmpty 
            ? <span className="text-slate-500 italic">// No payload for this request type</span>
            : <span className="text-sky-300">{JSON.stringify(content, null, 2)}</span>
          }
        </code>
      </pre>
    </div>
  );
};

const MetricChart: FC<{ data: MetricDataPoint[], dataKey: string, stroke: string, unit: string, name: string, unitPosition?: 'prefix' | 'suffix' }> = ({ data, dataKey, stroke, unit, name, unitPosition = 'suffix' }) => {
    const formatValue = (value: number | string) => {
        return unitPosition === 'prefix' ? `${unit}${value}` : `${value}${unit}`;
    };
    return (
      <div style={{ width: '100%', height: 140 }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="time" stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} tickFormatter={formatValue} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(30, 41, 59, 0.9)',
                borderColor: '#4b5563',
                borderRadius: '0.5rem',
              }}
              labelStyle={{ color: '#cbd5e1' }}
              itemStyle={{ color: stroke, fontWeight: 'bold' }}
              formatter={(value: number) => [formatValue(value), name]}
            />
            <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: '12px', color: '#cbd5e1', paddingTop: '10px' }} />
            <Line type="monotone" dataKey={dataKey} stroke={stroke} strokeWidth={2} dot={{ r: 3, fill: stroke }} activeDot={{ r: 6, fill: stroke }} name={name} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
};


const NodeDetailModal: FC<NodeDetailModalProps> = ({ node, nodes, edges, isDeafMode, onClose, onNavigate, feedback, onFeedbackSubmit }) => {
  const [newComment, setNewComment] = useState('');
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [analysisTraceId, setAnalysisTraceId] = useState<string | null>(null);

  const nodeMap = useMemo(() => new Map(nodes.map(n => [n.id, n])), [nodes]);

  const connections = useMemo(() => {
    const inputs = edges.filter(edge => edge.target === node.id).map(edge => nodeMap.get(edge.source)).filter(Boolean) as Node[];
    const outputs = edges.filter(edge => edge.source === node.id).map(edge => nodeMap.get(edge.target)).filter(Boolean) as Node[];
    return { inputs, outputs };
  }, [node.id, edges, nodeMap]);
    
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

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onFeedbackSubmit(newComment.trim());
      setNewComment('');
    }
  };

  const handleAnalyzeFeedback = async () => {
    if (feedback.length === 0) return;
    const traceId = `trace-analysis-${crypto.randomUUID().slice(0, 8)}`;
    setAnalysisTraceId(traceId);
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setAnalysisError(null);
    console.log(`[Trace: ${traceId}] Starting feedback analysis for node: ${node.name}`);

    const allComments = feedback.map(f => f.comment).join('; ');
    const prompt = `You are an AI assistant with expertise in both American Sign Language (ASL) linguistics and software architecture. Your task is to analyze user feedback regarding the "Deaf Mode" label for a specific system component. The goal is to improve the label for clarity and conceptual accuracy for Deaf and Hard-of-Hearing users.

Here is the information:
- Component Name: "${node.name}"
- Current Deaf Mode Label (ASL Gloss): "${node.labelDeaf}"
- Collected User Feedback: "${allComments}"

Please perform the following steps:
1.  **Summarize the Feedback**: Provide a brief, one-paragraph summary of the main points and sentiments from the user comments.
2.  **Suggest Improvements**: Based on your analysis of the feedback and the component's function, propose one or two alternative labels. These suggestions should be formatted as ASL glosses (all-caps, hyphenated where-appropriate) and be conceptually clearer or more accurate than the current label. Explain briefly why each suggestion is an improvement.`;

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
      console.log(`[Trace: ${traceId}] Successfully analyzed feedback.`);
      setAnalysisResult(response.text);
    } catch (error) {
      console.error(`[Trace: ${traceId}] Error analyzing feedback:`, error);
      setAnalysisError("Failed to analyze feedback. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const details = typeDetails[node.type];
  const Icon = details.Icon;
  const detailsColor = details.color;
  const detailsName = details.name;

  const color = details ? detailsColor.replace('text-', 'bg-').replace('-400', '-500/10').replace('-500', '-500/10') : 'bg-slate-500/10';
  const borderColor = details ? detailsColor.replace('text-', 'border-') : 'border-slate-500';

  const label = isDeafMode ? node.labelDeaf : node.label;
  const description = isDeafMode ? node.descriptionDeaf : node.description;
  const verificationDetails = node.verification ? verificationStatusDetails[node.verification.status] : null;

  const ConnectionButton: FC<{ connectedNode: Node }> = ({ connectedNode }) => {
      const details = typeDetails[connectedNode.type];
      const ConnectedIcon = details.Icon;
      const color = details.color;
      return (
          <button
              onClick={() => onNavigate(connectedNode.id)}
              className="w-full flex items-center p-2 text-left bg-slate-700/50 rounded-md hover:bg-slate-700 border border-transparent hover:border-slate-600 transition-all"
              aria-label={`Navigate to ${connectedNode.name}`}
          >
              <div className={`w-5 h-5 mr-2 flex-shrink-0 ${color}`}><ConnectedIcon /></div>
              <span className="text-sm text-slate-300 flex-grow truncate">{connectedNode.name}</span>
          </button>
      );
  };

  const MetricItem: FC<{
      icon: ReactNode;
      label: string;
      value: string;
      valueClassName?: string;
      statusIcon?: ReactNode;
  }> = ({ icon, label, value, valueClassName = 'text-white', statusIcon }) => (
    <div className="flex items-start justify-between p-3 bg-slate-700/30 rounded-lg">
        <div className="flex items-center gap-3">
            <div className="w-6 h-6 text-slate-400">{icon}</div>
            <div>
                <p className="font-semibold text-slate-300">{label}</p>
                <div className="flex items-center gap-2">
                    <p className={`text-lg font-bold font-mono ${valueClassName}`}>{value}</p>
                    {statusIcon}
                </div>
            </div>
        </div>
        <div className="w-24 h-10 bg-slate-700/50 rounded-md flex items-center justify-center">
            <span className="text-xs text-slate-500 italic">trend</span>
        </div>
    </div>
  );

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div
        className={`relative w-full max-w-lg bg-slate-800/80 backdrop-blur-xl rounded-xl border ${borderColor} shadow-2xl shadow-slate-900/50 p-8 transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale max-h-[90vh] overflow-y-auto custom-scrollbar`}
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
        <div className="flex items-start space-x-6">
          <div className={`flex-shrink-0 p-4 rounded-lg ${color}`}>
            <div className={`w-12 h-12 ${detailsColor}`}><Icon /></div>
          </div>
          <div>
            <span className={`font-mono text-xs uppercase ${detailsColor}`}>{detailsName}</span>
            <h2 id="modal-title" className="text-2xl font-bold text-white mt-1">{node.name}</h2>
            <p className={`text-sm text-slate-400 font-mono mt-1 ${isDeafMode ? 'uppercase tracking-wider font-bold' : ''}`}>{label}</p>
          </div>
        </div>
        <p id="modal-description" className="mt-6 text-slate-300">
          {description}
        </p>

        {node.metrics && (
            <div className="mt-8 border-t border-slate-700 pt-6">
                <h3 className="text-lg font-semibold text-white mb-4">Live Metrics</h3>
                <div className="bg-slate-900/50 p-4 rounded-lg space-y-4">
                    {node.metrics.latencyHistory ? (
                        <div className="p-3 bg-slate-700/30 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 text-slate-400"><LatencyIcon /></div>
                                    <p className="font-semibold text-slate-300">Latency (p95)</p>
                                </div>
                                <p className="text-lg font-bold text-white font-mono">{node.metrics.latency}</p>
                            </div>
                            <MetricChart data={node.metrics.latencyHistory} dataKey="value" stroke="#38bdf8" unit="ms" name="Latency" />
                        </div>
                    ) : node.metrics.latency && <MetricItem icon={<LatencyIcon />} label="Latency (p95)" value={node.metrics.latency} />}
                    
                    {node.metrics.errorRateHistory ? (
                        <div className="p-3 bg-slate-700/30 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 text-slate-400"><ErrorRateIcon /></div>
                                    <p className="font-semibold text-slate-300">Error Rate (24h)</p>
                                </div>
                                <p className="text-lg font-bold text-white font-mono">{node.metrics.errorRate}</p>
                            </div>
                            <MetricChart data={node.metrics.errorRateHistory} dataKey="value" stroke="#f43f5e" unit="%" name="Error Rate" />
                        </div>
                    ) : node.metrics.errorRate && <MetricItem icon={<ErrorRateIcon />} label="Error Rate (24h)" value={node.metrics.errorRate} />}
                    
                    {node.metrics.cpuHistory ? (
                        <div className="p-3 bg-slate-700/30 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 text-slate-400"><CpuIcon /></div>
                                    <p className="font-semibold text-slate-300">CPU Utilization</p>
                                </div>
                                <p className="text-lg font-bold text-white font-mono">{node.metrics.cpu}</p>
                            </div>
                            <MetricChart data={node.metrics.cpuHistory} dataKey="value" stroke="#84cc16" unit="%" name="CPU" />
                        </div>
                    ) : node.metrics.cpu && (() => {
                        const cpuValue = parseFloat(node.metrics.cpu as string);
                        const isWarning = cpuValue > 80;
                        const valueClassName = isWarning ? 'text-amber-400' : 'text-white';
                        const statusIcon = isWarning ? <ExclamationCircleIcon className="w-4 h-4 text-amber-400" /> : null;
                        return <MetricItem icon={<CpuIcon />} label="CPU Utilization" value={node.metrics.cpu as string} valueClassName={valueClassName} statusIcon={statusIcon} />;
                    })()}
                    
                    {node.metrics.costHistory ? (
                        <div className="p-3 bg-slate-700/30 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 text-slate-400"><CostIcon /></div>
                                    <p className="font-semibold text-slate-300">Cost (MTD)</p>
                                </div>
                                <p className="text-lg font-bold text-white font-mono">{node.metrics.cost}</p>
                            </div>
                            <MetricChart data={node.metrics.costHistory} dataKey="value" stroke="#22d3ee" unit="$" name="Cost" unitPosition="prefix" />
                        </div>
                    ) : node.metrics.cost && (() => {
                        const costValue = parseFloat((node.metrics.cost as string).replace('$', '').replace(',', ''));
                        const isWarning = costValue > 1000;
                        const valueClassName = isWarning ? 'text-amber-400' : 'text-white';
                        const statusIcon = isWarning ? <ExclamationCircleIcon className="w-4 h-4 text-amber-400" /> : null;
                        return <MetricItem icon={<CostIcon />} label="Cost (MTD)" value={node.metrics.cost as string} valueClassName={valueClassName} statusIcon={statusIcon} />;
                    })()}
                </div>
            </div>
        )}

        {verificationDetails && node.verification && (
            <div className="mt-8 border-t border-slate-700 pt-6">
                <h3 className="text-lg font-semibold text-white mb-4">Verification Status</h3>
                <div className="bg-slate-900/50 p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                        {(() => {
                            const VerificationIcon = verificationDetails.Icon;
                            return <VerificationIcon className={`w-8 h-8 ${verificationDetails.color}`} />;
                        })()}
                        <div>
                            <p className={`text-lg font-bold ${verificationDetails.color}`}>{verificationDetails.label}</p>
                            <p className="text-xs text-slate-500">Last checked: {node.verification.lastChecked}</p>
                        </div>
                    </div>

                    {node.verification.requirements && node.verification.requirements.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-slate-700/50">
                            <h4 className="font-semibold text-slate-300 mb-3">Requirements</h4>
                            <ul className="space-y-2">
                                {node.verification.requirements.map((req, index) => {
                                    const reqStatusDetails = {
                                        verified: { Icon: CheckCircleIcon, color: 'text-green-400', label: 'Verified' },
                                        pending: { Icon: ClockIcon, color: 'text-sky-400', label: 'Pending' },
                                        failed: { Icon: XCircleIcon, color: 'text-rose-400', label: 'Failed' },
                                    }[req.status];
                                    const statusColor = {
                                        verified: 'bg-green-500/20 text-green-400',
                                        pending: 'bg-sky-500/20 text-sky-400',
                                        failed: 'bg-rose-500/20 text-rose-400',
                                    }[req.status];
                                    const ReqIcon = reqStatusDetails.Icon;
                                    return (
                                        <li key={index} className="flex items-center justify-between text-sm gap-3 p-2 bg-slate-800/50 rounded-md">
                                            <div className="flex items-center gap-3">
                                                <ReqIcon className={`w-5 h-5 flex-shrink-0 ${reqStatusDetails.color}`} />
                                                <span className="text-slate-300">{req.description}</span>
                                            </div>
                                            <span className={`font-semibold capitalize px-2 py-0.5 rounded-full text-xs ${statusColor}`}>
                                                {req.status}
                                            </span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        )}
        
        {(connections.inputs.length > 0 || connections.outputs.length > 0) && (
            <div className="mt-8 border-t border-slate-700 pt-6">
                <h3 className="text-lg font-semibold text-white mb-4">Connections</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                        <h4 className="text-sm font-semibold text-slate-400 mb-2">Inputs</h4>
                        <div className="space-y-2">
                            {connections.inputs.length > 0 ? (
                                connections.inputs.map(n => <ConnectionButton key={`in-${n.id}`} connectedNode={n} />)
                            ) : (
                                <p className="text-sm text-slate-500 italic">None</p>
                            )}
                        </div>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-slate-400 mb-2">Outputs</h4>
                        <div className="space-y-2">
                            {connections.outputs.length > 0 ? (
                                connections.outputs.map(n => <ConnectionButton key={`out-${n.id}`} connectedNode={n} />)
                            ) : (
                                <p className="text-sm text-slate-500 italic">None</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )}

        {node.type === ComponentType.BACKEND_API && node.apiExample && (
          <div className="mt-8 border-t border-slate-700 pt-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-3">
                    <div className="w-6 h-6 text-teal-400"><CommandLineIcon /></div>
                    <span>API Example</span>
                </h3>
                <div className="flex items-center gap-2">
                    {node.apiExample.schemaUrl && (
                        <a href={node.apiExample.schemaUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-semibold bg-slate-700 text-slate-200 px-3 py-1.5 rounded-full hover:bg-slate-600 transition-colors">
                            <CubeTransparentIcon className="w-4 h-4" />
                            <span>Schema</span>
                        </a>
                    )}
                    {node.apiExample.documentationUrl && (
                        <a href={node.apiExample.documentationUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-semibold bg-slate-700 text-slate-200 px-3 py-1.5 rounded-full hover:bg-slate-600 transition-colors">
                            <DocumentTextIcon className="w-4 h-4" />
                            <span>Docs</span>
                        </a>
                    )}
                </div>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-lg space-y-4">
              <div className="flex items-center space-x-2 font-mono text-sm">
                <span className={`px-2 py-0.5 rounded-md text-white font-bold ${
                  node.apiExample.method === 'POST' ? 'bg-green-600' 
                  : node.apiExample.method === 'GET' ? 'bg-blue-600'
                  : 'bg-slate-600'
                }`}>
                  {node.apiExample.method}
                </span>
                <span className="text-slate-400">{node.apiExample.endpoint}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CodeBlock title="Request Payload" content={node.apiExample.requestPayload} />
                <CodeBlock title="Response Payload" content={node.apiExample.responsePayload} />
              </div>
            </div>
          </div>
        )}

        {node.fundingOpportunities && node.fundingOpportunities.length > 0 && (
          <div className="mt-8 border-t border-slate-700 pt-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-3">
                <div className="w-6 h-6 text-green-400"><CurrencyDollarIcon /></div>
                <span>Funding Opportunities</span>
            </h3>
            <div className="bg-slate-900/50 p-4 rounded-lg space-y-3">
              {node.fundingOpportunities.map((opp, index) => {
                const statusStyles = {
                  Matching: 'bg-sky-500/20 text-sky-300',
                  Applied: 'bg-amber-500/20 text-amber-300',
                  Secured: 'bg-green-500/20 text-green-300',
                }[opp.status];
                
                return (
                  <a
                    key={index}
                    href={opp.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 bg-slate-800/50 rounded-lg hover:bg-slate-700/50 transition-colors border border-transparent hover:border-slate-600"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-white">{opp.name}</p>
                        <p className="text-sm text-slate-400">{opp.type} &bull; <span className="font-mono">{opp.amount}</span></p>
                      </div>
                      <div className={`text-xs font-bold px-2 py-1 rounded-full ${statusStyles}`}>
                        {opp.status}
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {isDeafMode && (
          <div className="mt-8 border-t border-slate-700 pt-6">
            <h3 className="text-lg font-semibold text-white mb-4">Feedback on Deaf Mode Label</h3>
            
            <div className="space-y-4">
              <div className="bg-slate-900/50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold text-slate-300">Community Comments</h4>
                    <button 
                        onClick={handleAnalyzeFeedback}
                        disabled={isAnalyzing || feedback.length === 0}
                        className="inline-flex items-center text-xs font-semibold bg-indigo-600/50 text-indigo-200 px-3 py-1 rounded-full hover:bg-indigo-600/80 transition-colors disabled:bg-slate-600/50 disabled:text-slate-400 disabled:cursor-not-allowed"
                    >
                       {isAnalyzing ? (
                         <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                       ) : <GeminiLogo className="w-4 h-4 mr-2" /> }
                      {isAnalyzing ? 'Analyzing...' : 'Analyze with AI'}
                    </button>
                </div>
                
                {isAnalyzing && analysisTraceId && (
                  <div className="text-center mb-3 p-2 bg-slate-700/50 rounded-md">
                      <p className="text-sm text-slate-300">Analyzing feedback... <span className="font-mono text-xs">Trace ID: <span className="text-indigo-300">{analysisTraceId}</span></span></p>
                  </div>
                )}
                
                {analysisResult && (
                  <div className="mb-4 p-3 bg-slate-700/50 border border-slate-600 rounded-md text-sm text-slate-300 prose prose-sm prose-invert max-w-none">
                    <p className="font-semibold text-indigo-300 flex items-center gap-2"><GeminiLogo className="w-4 h-4"/> AI Summary</p>
                    <div dangerouslySetInnerHTML={{ __html: marked.parse(analysisResult) }} />
                    {analysisTraceId && <p className="text-xs text-slate-500 font-mono mt-2 pt-2 border-t border-slate-600">Trace ID: {analysisTraceId}</p>}
                  </div>
                )}
                {analysisError && (
                    <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-md text-sm text-rose-400">
                      <p className="font-semibold">Analysis Failed</p>
                      <p>{analysisError}</p>
                      {analysisTraceId && <p className="text-xs text-rose-400/70 font-mono mt-2">Trace ID: {analysisTraceId}</p>}
                    </div>
                )}


                <div className="space-y-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                  {feedback.length > 0 ? feedback.map((f, i) => (
                    <p key={i} className="text-sm text-slate-300 bg-slate-700/50 p-3 rounded-md">{f.comment}</p>
                  )) : (
                    <p className="text-sm text-slate-400 italic">No feedback submitted yet for this component.</p>
                  )}
                </div>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-2">
                <label htmlFor="feedback-comment" className="sr-only">Your Feedback</label>
                <textarea
                  id="feedback-comment"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={`Is the label "${label}" accurate or clear?`}
                  rows={3}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500/80 transition"
                  aria-label="Provide feedback on the Deaf Mode label"
                />
                <button 
                  type="submit" 
                  disabled={!newComment.trim()}
                  className="w-full bg-pink-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-pink-500 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-pink-500 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:scale-100"
                >
                  Submit Feedback
                </button>
              </form>
            </div>
          </div>
        )}
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
            width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(0,0,0,0.1);
            border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #4a5568; /* slate-600 */
            border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #718096; /* slate-500 */
        }
        .prose-invert p { margin-top: 0.5em; margin-bottom: 0.5em; }
      `}</style>
    </div>
  );
};

export default NodeDetailModal;