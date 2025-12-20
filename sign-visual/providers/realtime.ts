/**
 * Realtime Provider - Live agent state streaming
 * 
 * Connects to the event bus and provides real-time state updates
 */

import { eventBus } from '../engine/eventBus.js';
import { StateEvent } from '../engine/stateMachine.js';

export interface RealtimeConfig {
  bufferSize?: number;
  debounceMs?: number;
  enableLogging?: boolean;
}

export class RealtimeProvider {
  private buffer: StateEvent[] = [];
  private maxBufferSize: number;
  private debounceMs: number;
  private enableLogging: boolean;
  private debounceTimer: NodeJS.Timeout | null = null;

  constructor(config: RealtimeConfig = {}) {
    this.maxBufferSize = config.bufferSize ?? 50;
    this.debounceMs = config.debounceMs ?? 100;
    this.enableLogging = config.enableLogging ?? false;
  }

  /**
   * Subscribe to realtime state updates
   */
  subscribe(callback: (event: StateEvent) => void): () => void {
    const unsubscribe = eventBus.subscribe((event: StateEvent) => {
      // Add to buffer
      this.buffer.push(event);
      if (this.buffer.length > this.maxBufferSize) {
        this.buffer.shift();
      }

      // Log if enabled
      if (this.enableLogging) {
        console.log('[RealtimeProvider]', event);
      }

      // Debounce callback
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
      }

      this.debounceTimer = setTimeout(() => {
        callback(event);
      }, this.debounceMs);
    });

    return () => {
      unsubscribe();
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
      }
    };
  }

  /**
   * Get buffered events
   */
  getBuffer(): StateEvent[] {
    return [...this.buffer];
  }

  /**
   * Clear buffer
   */
  clearBuffer(): void {
    this.buffer = [];
  }

  /**
   * Get latest event
   */
  getLatest(): StateEvent | null {
    return this.buffer[this.buffer.length - 1] || null;
  }
}

// Default instance
export const realtimeProvider = new RealtimeProvider();
