# Sign Visual System

> **Sign language as a primary interaction layer for agentic systems.**  
> Not translation. State + intent visualization.

## Core Principle

Sign visuals reflect system state, not just output text.

**Text = optional**  
**Sign = authoritative**

## Philosophy

**If the system thinks, it signs.**  
**If it cannot sign, it should not act.**

## Quick Start

```typescript
import { eventBus, SignerPanel } from '@360magicians/sign-visual-system';

// In your agent
eventBus.startProcessing('MyAgent', 0.85);

// In your React app
<SignerPanel defaultPosition="right" />
```

## Architecture

```
/sign-visual
  /engine
    stateMachine.ts       # Single source of truth for agent state
    eventBus.ts           # Emits state changes
  /components
    SignerPanel.tsx       # Persistent, dockable panel
    StateIndicator.tsx    # Visual state representation
    ConfidenceCue.tsx     # Certainty/uncertainty/warning
  /states
    *.json                # State definitions and semantics
  /semantics
    intent.map.json       # User intent → sign semantic
    system.map.json       # System action → sign semantic
  /providers
    realtime.ts           # Live agent state stream
    playback.ts           # Async/replay
  /renderers
    signer-avatar.ts      # Visual rendering (stub → video → generative)
    fallback-visual.ts    # Icons + motion for low-bandwidth
```

## Integration Examples

### Basic Agent Integration

```typescript
import { eventBus } from '@360magicians/sign-visual-system';

class MyAgent {
  async processTask() {
    // Every action emits a state
    eventBus.startListening('MyAgent');
    // ... receive input
    
    eventBus.startProcessing('MyAgent', 0.8);
    // ... process
    
    eventBus.startValidating('MyAgent', 0.9);
    // ... validate
    
    eventBus.complete('MyAgent');
  }
}
```

### React Component Integration

```typescript
import { SignerPanel, useSignState } from '@360magicians/sign-visual-system';

function MyApp() {
  const { currentState, emitAction } = useSignState();
  
  return (
    <div>
      <SignerPanel defaultPosition="right" resizable draggable />
      <button onClick={() => emitAction('User', 'start_listening')}>
        Start
      </button>
    </div>
  );
}
```

### Error Handling

```typescript
// Errors are ALWAYS visible
eventBus.error('Agent', 'Invalid input provided');

// System will show:
// - Error state indicator
// - User action required flag
// - Clear error message
```

## States

The system recognizes these states:

- **idle** - Ready and waiting
- **listening** - Receiving input
- **processing** - Thinking and analyzing
- **validating** - Checking and confirming
- **deciding** - Making decisions
- **executing** - Taking action
- **completed** - Task finished
- **error** - Error occurred (requires user action)
- **needs_input** - Waiting for user input

## Sign Rendering Rules

1. **No word-for-word translation**
2. **Use semantic chunks**
3. **Always expose:**
   - what the system is doing
   - why it paused
   - what it needs next

## Governance

All sign semantic mappings are:
- Approved by Deaf community reviewers
- Versioned with semantic versioning
- Breaking changes require major version bump
- Documented in `/governance`

See `governance/sign-feedback.json` for the approval process.

## Accessibility Contract

- Sign panel **never** hidden behind modals
- User controls size, speed, replay
- Works async-first (no forced realtime)
- All states have visual + semantic representation

## Definition of Done

✅ Deaf user understands system state without reading text  
✅ No action happens without a visible sign state  
✅ System silence is never ambiguous

## Non-Goals

❌ Not subtitles  
❌ Not decorative avatars  
❌ Not post-hoc translation

## Development

```bash
# Run example
npm run demo

# Run tests
npm test
```

## ChatGPT App Store

This system can be deployed as a ChatGPT capability:
- Category: **Agent Transparency / Visual Reasoning**
- Not positioned as "accessibility"
- Primary interaction primitive

See `chatgpt-app/manifest.json` for details.

## License

MIT

## Contributing

See `governance/sign-feedback.json` for the contribution process.  
All semantic changes must be approved by Deaf community reviewers.
