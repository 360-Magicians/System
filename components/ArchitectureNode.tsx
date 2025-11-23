import { FC } from 'react';
import { Node, ComponentType } from '../types';
import { 
  UserInterfaceIcon, BackendApiIcon, AiCoreIcon, AiAgentIcon, DatabaseIcon, MessagingIcon, AnalyticsIcon, EcosystemServiceIcon, AccessibilityIcon, EthicsIcon, ExternalApiIcon, GovernanceIcon, InfrastructureIcon, MonitoringIcon, AiModelIcon, AuthServiceIcon
} from './icons';

interface ArchitectureNodeProps {
  node: Node;
  isDeafMode: boolean;
  cloudProvider: 'default' | 'gcp' | 'aws' | 'azure';
  isHighlighted: boolean;
  isDimmed: boolean;
  onClick: (node: Node) => void;
}

const typeDetails: { [key in ComponentType]: { Icon: FC<any>; color: string; } } = {
    [ComponentType.USER_INTERFACE]: { Icon: UserInterfaceIcon, color: '#38bdf8' },
    [ComponentType.BACKEND_API]: { Icon: BackendApiIcon, color: '#2dd4bf' },
    [ComponentType.AI_CORE]: { Icon: AiCoreIcon, color: '#c084fc' },
    [ComponentType.AI_AGENT]: { Icon: AiAgentIcon, color: '#c084fc' },
    [ComponentType.DATABASE]: { Icon: DatabaseIcon, color: '#facc15' },
    [ComponentType.MESSAGING]: { Icon: MessagingIcon, color: '#fb923c' },
    [ComponentType.ANALYTICS]: { Icon: AnalyticsIcon, color: '#a3e635' },
    [ComponentType.ECOSYSTEM_SERVICE]: { Icon: EcosystemServiceIcon, color: '#818cf8' },
    [ComponentType.ACCESSIBILITY]: { Icon: AccessibilityIcon, color: '#f472b6' },
    [ComponentType.ETHICS]: { Icon: EthicsIcon, color: '#ef4444' },
    [ComponentType.EXTERNAL_API]: { Icon: ExternalApiIcon, color: '#22d3ee' },
    [ComponentType.GOVERNANCE]: { Icon: GovernanceIcon, color: '#a78bfa' },
    [ComponentType.INFRASTRUCTURE]: { Icon: InfrastructureIcon, color: '#94a3b8' },
    [ComponentType.MONITORING]: { Icon: MonitoringIcon, color: '#fde047' },
    [ComponentType.AI_MODEL]: { Icon: AiModelIcon, color: '#c084fc' },
    [ComponentType.AUTH_SERVICE]: { Icon: AuthServiceIcon, color: '#34d399' },
};

const statusColors = {
  idle: '#64748b',
  active: '#34d399',
  warning: '#f59e0b',
  error: '#f43f5e',
};

const ArchitectureNode: FC<ArchitectureNodeProps> = ({ node, isDeafMode, cloudProvider, isHighlighted, isDimmed, onClick }) => {
  const details = typeDetails[node.type];
  const Icon = details.Icon;
  const color = details.color;
  const statusColor = node.status ? statusColors[node.status] : color;
  
  const labelText = (() => {
    if (isDeafMode) return node.labelDeaf;
    if (cloudProvider !== 'default' && node.equivalents?.[cloudProvider]) {
      return node.equivalents[cloudProvider];
    }
    return node.label;
  })();

  const strokeColor = (() => {
    if (isHighlighted) {
      return '#f472b6'; // Highlight pink takes highest precedence
    }
    if (node.id === 'svc-fibonrose') {
      return '#ef4444'; // Red for FibonRose
    }
    const isAiComponent = [
      ComponentType.AI_CORE,
      ComponentType.AI_AGENT,
      ComponentType.AI_MODEL,
    ].includes(node.type);

    if (isAiComponent) {
      return '#c084fc'; // Purple for AI components
    }
    // Fallback to the original logic
    return statusColor;
  })();

  return (
    <g
      transform={`translate(${node.position.x}, ${node.position.y})`}
      onClick={() => onClick(node)}
      className="cursor-pointer group"
      style={{ opacity: isDimmed ? 0.3 : 1, transition: 'opacity 0.3s ease-in-out' }}
    >
      <rect
        width="240"
        height="100"
        rx="8"
        ry="8"
        fill="#1e293b"
        stroke={strokeColor}
        strokeWidth="2"
        className="transition-all duration-300 group-hover:stroke-pink-500 group-hover:scale-[1.02] origin-center"
      />
      <foreignObject x="15" y="15" width="30" height="30">
        <Icon style={{ color: color, width: '100%', height: '100%' }} />
      </foreignObject>
      <text x="55" y="35" fill="white" fontSize="16" fontWeight="bold" className="font-sans select-none">
        {node.name}
      </text>
      <text
        x="55"
        y="60"
        fill="#94a3b8"
        fontSize="12"
        className={`font-mono select-none ${isDeafMode ? 'uppercase tracking-wider font-semibold' : ''}`}
      >
        {labelText}
      </text>
      
      {node.status && (
        <g>
          {['warning', 'error'].includes(node.status) && (
            <circle
              cx="220"
              cy="20"
              r="6"
              fill={statusColor}
              className={node.status === 'warning' ? 'pulse-warning' : 'pulse-error'}
            />
          )}
          <circle cx="220" cy="20" r="6" fill={statusColor}>
            <title>Status: {node.status}</title>
          </circle>
        </g>
      )}
    </g>
  );
};

export default ArchitectureNode;
