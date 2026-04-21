/**
 * useSignState - React hook for consuming sign visual state
 * 
 * Connects components to the sign visual system
 */

import { useState, useEffect, useCallback } from 'react';
import { eventBus } from '../../sign-visual/engine/eventBus.js';
import { StateEvent, AgentState } from '../../sign-visual/engine/stateMachine.js';

export interface UseSignStateReturn {
  currentState: StateEvent | null;
  history: StateEvent[];
  emitAction: (actor: string, action: string, options?: {
    confidence?: number;
    requiresUser?: boolean;
    context?: Record<string, any>;
  }) => void;
}

export const useSignState = (): UseSignStateReturn => {
  const [currentState, setCurrentState] = useState<StateEvent | null>(null);
  const [history, setHistory] = useState<StateEvent[]>([]);

  useEffect(() => {
    const unsubscribe = eventBus.subscribe((event: StateEvent) => {
      setCurrentState(event);
      setHistory(prev => [...prev, event].slice(-50)); // Keep last 50 events
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const emitAction = useCallback((
    actor: string,
    action: string,
    options?: {
      confidence?: number;
      requiresUser?: boolean;
      context?: Record<string, any>;
    }
  ) => {
    eventBus.emitAction({
      actor,
      action,
      confidence: options?.confidence,
      requiresUser: options?.requiresUser,
      context: options?.context
    });
  }, []);

  return {
    currentState,
    history,
    emitAction
  };
};
