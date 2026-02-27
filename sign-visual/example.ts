/**
 * Example: Using the Sign Visual System
 * 
 * This demonstrates how to integrate the sign visual system with an agent
 */

import { eventBus } from './engine/eventBus.js';
import { SignerAvatar } from './renderers/signer-avatar.js';
import { realtimeProvider } from './providers/realtime.js';

// Example 1: Simple agent that emits state changes
class ExampleAgent {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  async processTask(taskDescription: string): Promise<void> {
    // Start listening
    eventBus.startListening(this.name);
    await this.delay(1000);

    // Process the input
    eventBus.startProcessing(this.name, 0.8);
    await this.delay(2000);

    // Validate the approach
    eventBus.startValidating(this.name, 0.85);
    await this.delay(1500);

    // Make a decision
    eventBus.startDeciding(this.name, 0.9);
    await this.delay(1000);

    // Execute the task
    eventBus.startExecuting(this.name);
    await this.delay(3000);

    // Complete
    eventBus.complete(this.name);
  }

  async handleError(errorMessage: string): Promise<void> {
    eventBus.error(this.name, errorMessage);
  }

  async requestInput(prompt: string): Promise<void> {
    eventBus.needsInput(this.name, prompt);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Example 2: Setting up the signer avatar
const setupSignerAvatar = () => {
  const avatar = new SignerAvatar({
    mode: 'stub', // Start with stub, can upgrade to video or generative
    size: { width: 320, height: 480 },
    language: 'ASL'
  });

  // Subscribe to state changes
  realtimeProvider.subscribe(event => {
    avatar.update(event);
  });

  return avatar;
};

// Example 3: Running a demo
export const runDemo = async () => {
  console.log('Starting Sign Visual System Demo...\n');

  // Setup avatar
  const avatar = setupSignerAvatar();

  // Create an agent
  const agent = new ExampleAgent('IdeaMagician');

  // Subscribe to log all state changes
  eventBus.subscribe(event => {
    console.log(`[${new Date(event.timestamp).toLocaleTimeString()}] ${event.actor}: ${event.state}`, 
      event.confidence ? `(confidence: ${event.confidence})` : ''
    );
  });

  // Run a task
  try {
    console.log('\n--- Task 1: Normal Flow ---');
    await agent.processTask('Validate business idea');

    console.log('\n--- Task 2: Error Flow ---');
    await agent.handleError('Invalid input provided');

    console.log('\n--- Task 3: Needs Input ---');
    await agent.requestInput('Please provide more details');

    console.log('\n--- Demo Complete ---');
  } catch (error) {
    console.error('Demo error:', error);
  }
};

// Run demo if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runDemo();
}
