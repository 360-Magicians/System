/**
 * Playback Provider - Async/replay functionality
 * 
 * Allows replaying state history and async state visualization
 */

import { stateMachine, StateEvent } from '../engine/stateMachine.js';

export interface PlaybackConfig {
  speed?: number; // 1.0 = normal, 2.0 = 2x, etc.
  loop?: boolean;
  startFrom?: number; // timestamp or index
}

export class PlaybackProvider {
  private isPlaying: boolean = false;
  private playbackSpeed: number = 1.0;
  private currentIndex: number = 0;
  private playbackTimer: NodeJS.Timeout | null = null;

  /**
   * Replay state history
   */
  async replay(
    events: StateEvent[],
    callback: (event: StateEvent, index: number) => void,
    config: PlaybackConfig = {}
  ): Promise<void> {
    if (this.isPlaying) {
      throw new Error('Playback already in progress');
    }

    this.isPlaying = true;
    this.playbackSpeed = config.speed ?? 1.0;
    this.currentIndex = 0;

    const loop = config.loop ?? false;

    const playNext = () => {
      if (!this.isPlaying) return;

      if (this.currentIndex >= events.length) {
        if (loop) {
          this.currentIndex = 0;
        } else {
          this.stop();
          return;
        }
      }

      const event = events[this.currentIndex];
      callback(event, this.currentIndex);
      this.currentIndex++;

      // Calculate delay based on speed
      const baseDelay = 500; // ms between events
      const delay = baseDelay / this.playbackSpeed;

      this.playbackTimer = setTimeout(playNext, delay);
    };

    playNext();
  }

  /**
   * Stop playback
   */
  stop(): void {
    this.isPlaying = false;
    if (this.playbackTimer) {
      clearTimeout(this.playbackTimer);
      this.playbackTimer = null;
    }
  }

  /**
   * Pause playback
   */
  pause(): void {
    this.isPlaying = false;
    if (this.playbackTimer) {
      clearTimeout(this.playbackTimer);
      this.playbackTimer = null;
    }
  }

  /**
   * Resume playback
   */
  resume(): void {
    this.isPlaying = true;
  }

  /**
   * Set playback speed
   */
  setSpeed(speed: number): void {
    this.playbackSpeed = speed;
  }

  /**
   * Get current playback state
   */
  getState(): { isPlaying: boolean; currentIndex: number; speed: number } {
    return {
      isPlaying: this.isPlaying,
      currentIndex: this.currentIndex,
      speed: this.playbackSpeed
    };
  }

  /**
   * Load and replay from state machine history
   */
  async replayHistory(
    callback: (event: StateEvent, index: number) => void,
    config: PlaybackConfig = {}
  ): Promise<void> {
    const history = stateMachine.getHistory();
    await this.replay(history, callback, config);
  }
}

// Default instance
export const playbackProvider = new PlaybackProvider();
