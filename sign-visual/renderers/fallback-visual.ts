/**
 * Fallback Visual - Icons and motion for low-bandwidth scenarios
 * 
 * Provides visual feedback when full sign rendering is not available
 */

import { StateEvent, AgentState } from '../engine/stateMachine.js';

export interface FallbackVisualConfig {
  useAnimations?: boolean;
  iconSize?: 'small' | 'medium' | 'large';
}

export interface VisualRepresentation {
  icon: string;
  color: string;
  animation?: string;
  label: string;
}

const stateVisuals: Record<AgentState, VisualRepresentation> = {
  idle: {
    icon: '⏸️',
    color: '#666',
    animation: 'none',
    label: 'Ready'
  },
  listening: {
    icon: '👂',
    color: '#4a9eff',
    animation: 'pulse',
    label: 'Listening'
  },
  processing: {
    icon: '🔄',
    color: '#9d4eff',
    animation: 'rotate',
    label: 'Processing'
  },
  validating: {
    icon: '✓',
    color: '#ff9d4e',
    animation: 'pulse',
    label: 'Validating'
  },
  deciding: {
    icon: '🤔',
    color: '#ffdd4e',
    animation: 'bounce',
    label: 'Deciding'
  },
  executing: {
    icon: '⚡',
    color: '#4eff9d',
    animation: 'flash',
    label: 'Executing'
  },
  completed: {
    icon: '✅',
    color: '#00cc66',
    animation: 'bounce',
    label: 'Completed'
  },
  error: {
    icon: '❌',
    color: '#ff4e4e',
    animation: 'shake',
    label: 'Error'
  },
  needs_input: {
    icon: '❓',
    color: '#ffa500',
    animation: 'pulse',
    label: 'Needs Input'
  }
};

export class FallbackVisual {
  private config: FallbackVisualConfig;

  constructor(config: FallbackVisualConfig = {}) {
    this.config = {
      useAnimations: config.useAnimations ?? true,
      iconSize: config.iconSize ?? 'medium'
    };
  }

  /**
   * Get visual representation for state
   */
  getVisual(event: StateEvent): VisualRepresentation {
    const visual = stateVisuals[event.state];
    
    // Disable animation if configured
    if (!this.config.useAnimations) {
      return { ...visual, animation: 'none' };
    }
    
    return visual;
  }

  /**
   * Render as HTML element
   */
  renderHTML(event: StateEvent): string {
    const visual = this.getVisual(event);
    const sizeMap = { small: '24px', medium: '48px', large: '72px' };
    const size = sizeMap[this.config.iconSize || 'medium'];

    return `
      <div class="fallback-visual" style="
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        padding: 16px;
      ">
        <div style="
          font-size: ${size};
          animation: ${visual.animation || 'none'} 1s ease-in-out infinite;
        ">
          ${visual.icon}
        </div>
        <div style="
          color: ${visual.color};
          font-weight: 600;
          font-size: 14px;
        ">
          ${visual.label}
        </div>
        ${event.actor ? `
          <div style="
            color: #999;
            font-size: 12px;
          ">
            ${event.actor}
          </div>
        ` : ''}
      </div>
    `;
  }

  /**
   * Get CSS animations
   */
  static getAnimationCSS(): string {
    return `
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
      
      @keyframes rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      
      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
      
      @keyframes flash {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
      }
      
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
      }
    `;
  }
}
