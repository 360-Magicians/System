/**
 * StateIndicator - Visual representation of agent state
 * 
 * States: listening | processing | deciding | executing | error
 */

import React from 'react';
import { AgentState } from '../engine/stateMachine.js';

export interface StateIndicatorProps {
  state: AgentState;
  actor: string;
}

const stateConfig: Record<AgentState, { label: string; icon: string; color: string; signDescription: string }> = {
  idle: {
    label: 'Idle',
    icon: '⏸️',
    color: '#666',
    signDescription: 'Agent is waiting and ready'
  },
  listening: {
    label: 'Listening',
    icon: '👂',
    color: '#4a9eff',
    signDescription: 'Agent is receiving input'
  },
  processing: {
    label: 'Processing',
    icon: '🔄',
    color: '#9d4eff',
    signDescription: 'Agent is thinking'
  },
  validating: {
    label: 'Validating',
    icon: '✓',
    color: '#ff9d4e',
    signDescription: 'Agent is checking and validating'
  },
  deciding: {
    label: 'Deciding',
    icon: '🤔',
    color: '#ffdd4e',
    signDescription: 'Agent is making a decision'
  },
  executing: {
    label: 'Executing',
    icon: '⚡',
    color: '#4eff9d',
    signDescription: 'Agent is taking action'
  },
  completed: {
    label: 'Completed',
    icon: '✅',
    color: '#00cc66',
    signDescription: 'Task is complete'
  },
  error: {
    label: 'Error',
    icon: '❌',
    color: '#ff4e4e',
    signDescription: 'An error occurred'
  },
  needs_input: {
    label: 'Needs Input',
    icon: '❓',
    color: '#ffa500',
    signDescription: 'Agent needs your input to continue'
  }
};

export const StateIndicator: React.FC<StateIndicatorProps> = ({ state, actor }) => {
  const config = stateConfig[state];

  return (
    <div
      className="state-indicator"
      style={{
        padding: '16px',
        backgroundColor: '#2a2a2a',
        borderRadius: '8px',
        borderLeft: `4px solid ${config.color}`
      }}
      data-testid="state-indicator"
      data-state={state}
    >
      {/* Icon and Label */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '8px'
        }}
      >
        <span
          style={{
            fontSize: '32px',
            lineHeight: 1
          }}
          role="img"
          aria-label={config.label}
        >
          {config.icon}
        </span>
        <div>
          <div
            style={{
              fontSize: '18px',
              fontWeight: 600,
              color: config.color
            }}
          >
            {config.label}
          </div>
          <div
            style={{
              fontSize: '12px',
              color: '#999'
            }}
          >
            {actor}
          </div>
        </div>
      </div>

      {/* Sign Description */}
      <div
        style={{
          fontSize: '14px',
          color: '#ccc',
          marginTop: '8px',
          paddingTop: '8px',
          borderTop: '1px solid #3a3a3a'
        }}
      >
        {config.signDescription}
      </div>

      {/* Visual pulse animation for active states */}
      {['listening', 'processing', 'validating', 'deciding', 'executing'].includes(state) && (
        <div
          style={{
            marginTop: '12px',
            height: '4px',
            backgroundColor: '#1a1a1a',
            borderRadius: '2px',
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: '30%',
              backgroundColor: config.color,
              animation: 'pulse 1.5s ease-in-out infinite',
              borderRadius: '2px'
            }}
          />
        </div>
      )}

      <style>
        {`
          @keyframes pulse {
            0% {
              left: -30%;
            }
            100% {
              left: 100%;
            }
          }
        `}
      </style>
    </div>
  );
};
