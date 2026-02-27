/**
 * Basic tests for Sign Visual System
 * 
 * Tests core functionality of state machine and event bus
 */

import { stateMachine, StateEvent, AgentState } from '../sign-visual/engine/stateMachine';
import { eventBus } from '../sign-visual/engine/eventBus';

// Simple test framework
const tests: { name: string; fn: () => void | Promise<void> }[] = [];
let passed = 0;
let failed = 0;

function test(name: string, fn: () => void | Promise<void>) {
  tests.push({ name, fn });
}

function assertEquals<T>(actual: T, expected: T, message?: string) {
  if (actual !== expected) {
    throw new Error(
      message || `Expected ${expected}, but got ${actual}`
    );
  }
}

function assertDefined<T>(value: T | null | undefined, message?: string) {
  if (value === null || value === undefined) {
    throw new Error(message || 'Expected value to be defined');
  }
}

// Tests
test('State machine emits events', () => {
  let receivedEvent: StateEvent | null = null;
  
  const unsubscribe = stateMachine.subscribe((event) => {
    receivedEvent = event;
  });

  stateMachine.emit({
    actor: 'TestAgent',
    state: 'processing',
    requiresUser: false
  });

  assertDefined(receivedEvent, 'Event should be received');
  assertEquals(receivedEvent!.actor, 'TestAgent');
  assertEquals(receivedEvent!.state, 'processing');
  
  unsubscribe();
});

test('State machine stores history', () => {
  stateMachine.clearHistory();
  
  stateMachine.emit({
    actor: 'Agent1',
    state: 'idle',
    requiresUser: false
  });

  stateMachine.emit({
    actor: 'Agent1',
    state: 'processing',
    requiresUser: false
  });

  const history = stateMachine.getHistory();
  assertEquals(history.length, 2);
  assertEquals(history[0].state, 'idle');
  assertEquals(history[1].state, 'processing');
});

test('Event bus converts actions to states', () => {
  let receivedEvent: StateEvent | null = null;
  
  const unsubscribe = eventBus.subscribe((event) => {
    receivedEvent = event;
  });

  eventBus.startProcessing('TestAgent', 0.8);

  assertDefined(receivedEvent);
  assertEquals(receivedEvent!.state, 'processing');
  assertEquals(receivedEvent!.confidence, 0.8);
  
  unsubscribe();
});

test('Event bus convenience methods work', () => {
  const events: StateEvent[] = [];
  
  const unsubscribe = eventBus.subscribe((event) => {
    events.push(event);
  });

  eventBus.startListening('Agent');
  eventBus.startProcessing('Agent');
  eventBus.startValidating('Agent');
  eventBus.complete('Agent');

  assertEquals(events.length, 4);
  assertEquals(events[0].state, 'listening');
  assertEquals(events[1].state, 'processing');
  assertEquals(events[2].state, 'validating');
  assertEquals(events[3].state, 'completed');
  
  unsubscribe();
});

test('Error states require user action', () => {
  let receivedEvent: StateEvent | null = null;
  
  const unsubscribe = eventBus.subscribe((event) => {
    receivedEvent = event;
  });

  eventBus.error('Agent', 'Something went wrong');

  assertDefined(receivedEvent);
  assertEquals(receivedEvent!.state, 'error');
  assertEquals(receivedEvent!.requiresUser, true);
  
  unsubscribe();
});

test('State machine can be reset', () => {
  stateMachine.emit({
    actor: 'Agent',
    state: 'processing',
    requiresUser: false
  });

  assertEquals(stateMachine.getCurrentState(), 'processing');

  stateMachine.reset();

  assertEquals(stateMachine.getCurrentState(), 'idle');
});

// Run all tests
async function runTests() {
  console.log('Running Sign Visual System Tests...\n');

  for (const { name, fn } of tests) {
    try {
      await fn();
      console.log(`✅ ${name}`);
      passed++;
    } catch (error) {
      console.error(`❌ ${name}`);
      console.error(`   ${error.message}`);
      failed++;
    }
  }

  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}

runTests();
