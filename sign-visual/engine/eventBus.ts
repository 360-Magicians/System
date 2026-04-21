/**
 * Event Bus - Emits state changes throughout the system
 * 
 * This is the communication layer between agents and the sign visual system.
 * All agent actions flow through here to ensure visibility.
 */

import { stateMachine, StateEvent, AgentState } from './stateMachine.js';

export interface AgentAction {
  actor: string;
  action: string;
  confidence?: number;
  requiresUser?: boolean;
  context?: Record<string, any>;
}

/**
 * Map agent actions to visual states
 */
const actionToStateMap: Record<string, AgentState> = {
  'start_listening': 'listening',
  'processing_input': 'processing',
  'validating_idea': 'validating',
  'making_decision': 'deciding',
  'executing_task': 'executing',
  'task_complete': 'completed',
  'error_occurred': 'error',
  'awaiting_input': 'needs_input',
  'idle': 'idle'
};

class EventBus {
  /**
   * Emit an agent action - automatically converts to state event
   */
  emitAction(action: AgentAction): void {
    const state = actionToStateMap[action.action] || 'processing';
    
    stateMachine.emit({
      actor: action.actor,
      state,
      confidence: action.confidence,
      requiresUser: action.requiresUser ?? false,
      message: action.action,
      metadata: action.context
    });
  }

  /**
   * Emit a direct state event
   */
  emitState(event: Omit<StateEvent, 'timestamp'>): void {
    stateMachine.emit(event);
  }

  /**
   * Subscribe to all state changes
   */
  subscribe(listener: (event: StateEvent) => void): () => void {
    return stateMachine.subscribe(listener);
  }

  /**
   * Convenience methods for common agent actions
   */
  
  startListening(actor: string): void {
    this.emitAction({
      actor,
      action: 'start_listening',
      requiresUser: false
    });
  }

  startProcessing(actor: string, confidence?: number): void {
    this.emitAction({
      actor,
      action: 'processing_input',
      confidence,
      requiresUser: false
    });
  }

  startValidating(actor: string, confidence?: number): void {
    this.emitAction({
      actor,
      action: 'validating_idea',
      confidence,
      requiresUser: false
    });
  }

  startDeciding(actor: string, confidence?: number): void {
    this.emitAction({
      actor,
      action: 'making_decision',
      confidence,
      requiresUser: false
    });
  }

  startExecuting(actor: string): void {
    this.emitAction({
      actor,
      action: 'executing_task',
      requiresUser: false
    });
  }

  complete(actor: string): void {
    this.emitAction({
      actor,
      action: 'task_complete',
      requiresUser: false
    });
  }

  error(actor: string, message?: string): void {
    this.emitAction({
      actor,
      action: 'error_occurred',
      requiresUser: true,
      context: { error: message }
    });
  }

  needsInput(actor: string, message?: string): void {
    this.emitAction({
      actor,
      action: 'awaiting_input',
      requiresUser: true,
      context: { prompt: message }
    });
  }

  idle(actor: string): void {
    this.emitAction({
      actor,
      action: 'idle',
      requiresUser: false
    });
  }
}

// Singleton instance
export const eventBus = new EventBus();
