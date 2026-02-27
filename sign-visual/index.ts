/**
 * Sign Visual System - Main Entry Point
 * 
 * Export all public APIs for the sign visual system
 */

// Engine
export { stateMachine, type StateEvent, type AgentState } from './engine/stateMachine.js';
export { eventBus, type AgentAction } from './engine/eventBus.js';

// Components
export { SignerPanel, type SignerPanelProps } from './components/SignerPanel.js';
export { StateIndicator, type StateIndicatorProps } from './components/StateIndicator.js';
export { ConfidenceCue, type ConfidenceCueProps } from './components/ConfidenceCue.js';

// Providers
export { RealtimeProvider, realtimeProvider, type RealtimeConfig } from './providers/realtime.js';
export { PlaybackProvider, playbackProvider, type PlaybackConfig } from './providers/playback.js';

// Renderers
export { SignerAvatar, type SignerAvatarConfig } from './renderers/signer-avatar.js';
export { FallbackVisual, type FallbackVisualConfig } from './renderers/fallback-visual.js';
