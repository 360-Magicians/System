/**
 * SignerPanel - Persistent, dockable panel for sign language visualization
 * 
 * Core principle: Part of the conversation surface, not a help layer
 */

import React, { useState, useEffect, useCallback } from 'react';
import { eventBus } from '../engine/eventBus.js';
import { StateEvent } from '../engine/stateMachine.js';
import { StateIndicator } from './StateIndicator.js';
import { ConfidenceCue } from './ConfidenceCue.js';

export interface SignerPanelProps {
  defaultPosition?: 'left' | 'right' | 'bottom';
  defaultSize?: { width: number; height: number };
  resizable?: boolean;
  draggable?: boolean;
}

export const SignerPanel: React.FC<SignerPanelProps> = ({
  defaultPosition = 'right',
  defaultSize = { width: 320, height: 480 },
  resizable = true,
  draggable = true
}) => {
  const [currentEvent, setCurrentEvent] = useState<StateEvent | null>(null);
  const [position, setPosition] = useState(defaultPosition);
  const [size, setSize] = useState(defaultSize);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    // Subscribe to state changes
    const unsubscribe = eventBus.subscribe((event: StateEvent) => {
      setCurrentEvent(event);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleMinimize = useCallback(() => {
    setIsMinimized(!isMinimized);
  }, [isMinimized]);

  const positionStyles: Record<string, React.CSSProperties> = {
    left: {
      position: 'fixed',
      left: 0,
      top: 0,
      height: '100vh'
    },
    right: {
      position: 'fixed',
      right: 0,
      top: 0,
      height: '100vh'
    },
    bottom: {
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: '200px'
    }
  };

  return (
    <div
      className="signer-panel"
      style={{
        ...positionStyles[position],
        width: position === 'bottom' ? '100%' : `${size.width}px`,
        height: position === 'bottom' ? `${size.height}px` : '100vh',
        backgroundColor: '#1a1a1a',
        borderLeft: position === 'right' ? '1px solid #333' : 'none',
        borderRight: position === 'left' ? '1px solid #333' : 'none',
        borderTop: position === 'bottom' ? '1px solid #333' : 'none',
        color: '#fff',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.3s ease'
      }}
      data-testid="signer-panel"
    >
      {/* Header */}
      <div
        style={{
          padding: '16px',
          borderBottom: '1px solid #333',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>
          Sign State
        </h3>
        <button
          onClick={handleMinimize}
          style={{
            background: 'none',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '18px'
          }}
          aria-label={isMinimized ? 'Maximize' : 'Minimize'}
        >
          {isMinimized ? '▲' : '▼'}
        </button>
      </div>

      {/* Content */}
      {!isMinimized && (
        <div
          style={{
            flex: 1,
            padding: '16px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          {currentEvent ? (
            <>
              {/* State Indicator */}
              <StateIndicator state={currentEvent.state} actor={currentEvent.actor} />

              {/* Confidence Cue */}
              {currentEvent.confidence !== undefined && (
                <ConfidenceCue confidence={currentEvent.confidence} />
              )}

              {/* Message */}
              {currentEvent.message && (
                <div
                  style={{
                    padding: '12px',
                    backgroundColor: '#2a2a2a',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                >
                  {currentEvent.message}
                </div>
              )}

              {/* User Action Required */}
              {currentEvent.requiresUser && (
                <div
                  style={{
                    padding: '12px',
                    backgroundColor: '#4a3a00',
                    border: '2px solid #ffa500',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontWeight: 600
                  }}
                >
                  ⚠️ Your input needed
                </div>
              )}

              {/* Metadata */}
              {currentEvent.metadata && (
                <details
                  style={{
                    fontSize: '12px',
                    color: '#999'
                  }}
                >
                  <summary style={{ cursor: 'pointer' }}>Debug Info</summary>
                  <pre
                    style={{
                      marginTop: '8px',
                      padding: '8px',
                      backgroundColor: '#0a0a0a',
                      borderRadius: '4px',
                      overflow: 'auto'
                    }}
                  >
                    {JSON.stringify(currentEvent.metadata, null, 2)}
                  </pre>
                </details>
              )}
            </>
          ) : (
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#666',
                fontSize: '14px'
              }}
            >
              Waiting for agent activity...
            </div>
          )}
        </div>
      )}

      {/* Footer with controls */}
      {!isMinimized && (
        <div
          style={{
            padding: '12px 16px',
            borderTop: '1px solid #333',
            fontSize: '12px',
            color: '#999',
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <span>Sign visual system active</span>
          {currentEvent && (
            <span>
              {new Date(currentEvent.timestamp).toLocaleTimeString()}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
