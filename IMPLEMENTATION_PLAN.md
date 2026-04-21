# IMPLEMENTATION_PLAN.md

## Phase 1 — Make it Real (MVP, no excuses)

### Engine Layer

```
/sign-visual
  /engine
    stateMachine.ts    # single source of truth for agent state
    eventBus.ts        # emits state changes
  /renderers
    signer-avatar.ts   # stub → video → generative later
    fallback-visual.ts # icons + motion for low-bandwidth
```

### Rules

- Every agent action MUST emit a state event
- No silent processing
- No hidden waits

### Example Event

```typescript
stateMachine.emit({
  actor: "MagicianCore",
  state: "validating",
  confidence: 0.82,
  requiresUser: false
})
```

**Signer listens to events, not text.**

---

## Phase 2 — Wire to Agent Core

```
/core/magician-core
  hooks/useSignState.ts
  hooks/useIntentMap.ts
```

### Flow

```
user intent
  → agent reasoning
    → stateMachine update
      → sign renderer
        → (optional) text confirmation
```

**Text never leads.**  
**Sign always reflects truth.**

---

## Phase 3 — Deaf Engagement Loop (Governance)

```
/governance
  sign-feedback.json
  semantic-overrides.json
```

- Deaf contributors approve semantic mappings
- No auto-updates without sign review
- Versioned sign semantics (breaking changes = major version bump)

---

## Phase 4 — ChatGPT App Store Surface

```
/chatgpt-app
  manifest.json
```

### Declare capability

```json
{
  "capabilities": {
    "sign_visual_state": {
      "primary": true,
      "modes": ["realtime", "async", "replay"]
    }
  }
}
```

### Positioning

- Not "accessibility"
- Category: **Agent Transparency / Visual Reasoning**

---

## Definition of Success

Deaf user can tell:
- what the agent is doing
- why it stopped
- what it needs from them
- when the task is complete

**Without reading a single word.**
