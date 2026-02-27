/**
 * State Machine - Single source of truth for agent state
 * 
 * Core principle: If the system thinks, it signs.
 * Every state change must be visible to the user.
 */

export type AgentState = 
  | 'idle'
  | 'listening'
  | 'processing'
  | 'validating'
  | 'deciding'
  | 'executing'
  | 'completed'
  | 'error'
  | 'needs_input';

export interface StateEvent {
  actor: string;           // Who is acting (e.g., "MagicianCore", "Validator")
  state: AgentState;       // Current state
  confidence?: number;     // 0-1, certainty level
  requiresUser: boolean;   // Does this state need user action?
  message?: string;        // Optional semantic context
  timestamp: number;       // When this state was entered
  metadata?: Record<string, any>; // Additional context
}

export type StateListener = (event: StateEvent) => void;

class StateMachine {
  private currentState: AgentState = 'idle';
  private listeners: Set<StateListener> = new Set();
  private stateHistory: StateEvent[] = [];
  private maxHistorySize = 100;

  /**
   * Emit a state change event
   * This is the core API - all agent actions flow through here
   */
  emit(event: Omit<StateEvent, 'timestamp'>): void {
    const fullEvent: StateEvent = {
      ...event,
      timestamp: Date.now()
    };

    // Update current state
    this.currentState = event.state;

    // Store in history
    this.stateHistory.push(fullEvent);
    if (this.stateHistory.length > this.maxHistorySize) {
      this.stateHistory.shift();
    }

    // Notify all listeners
    this.listeners.forEach(listener => {
      try {
        listener(fullEvent);
      } catch (error) {
        console.error('State listener error:', error);
      }
    });
  }

  /**
   * Subscribe to state changes
   */
  subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Get current state
   */
  getCurrentState(): AgentState {
    return this.currentState;
  }

  /**
   * Get state history
   */
  getHistory(): StateEvent[] {
    return [...this.stateHistory];
  }

  /**
   * Get last N state events
   */
  getRecentHistory(count: number): StateEvent[] {
    return this.stateHistory.slice(-count);
  }

  /**
   * Clear history (for testing or reset)
   */
  clearHistory(): void {
    this.stateHistory = [];
  }

  /**
   * Reset to idle state
   */
  reset(): void {
    this.emit({
      actor: 'System',
      state: 'idle',
      requiresUser: false,
      message: 'System reset'
    });
  }
}

// Singleton instance
export const stateMachine = new StateMachine();
