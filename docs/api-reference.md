# API Reference

## Core Orchestrator API

Base URL: `http://localhost:8000`

### Register Magician Node

Register a new Magician node with the orchestrator.

**Endpoint**: `POST /api/v1/nodes/register`

**Request Body**:
```json
{
  "node_id": "business-magician-01",
  "magician_type": "business",
  "webhook_url": "http://business-magician:8001/webhook",
  "metadata": {
    "version": "1.0.0",
    "capabilities": ["validate-idea", "create-plan"]
  }
}
```

**Response**:
```json
{
  "status": "registered",
  "node_id": "business-magician-01",
  "registered_at": "2024-01-01T00:00:00Z"
}
```

### Submit Task

Submit a task for execution.

**Endpoint**: `POST /api/v1/tasks`

**Request Body**:
```json
{
  "magician_type": "business",
  "action": "validate-business-idea",
  "payload": {
    "idea": "ASL-native customer service platform",
    "target_market": "Deaf community businesses"
  },
  "priority": 5,
  "timeout": 300
}
```

**Response**:
```json
{
  "task_id": "task-123456",
  "status": "pending",
  "created_at": "2024-01-01T00:00:00Z"
}
```

### Get Task Result

Get the result of a task.

**Endpoint**: `GET /api/v1/tasks/{task_id}`

**Response**:
```json
{
  "task_id": "task-123456",
  "status": "success",
  "result": {
    "validation_score": 0.85,
    "feedback": ["Excellent focus on accessibility"],
    "recommended_next_steps": ["Create business plan"]
  },
  "started_at": "2024-01-01T00:00:00Z",
  "completed_at": "2024-01-01T00:00:05Z",
  "duration_ms": 5000
}
```

### Execute Pathway

Execute a multi-step pathway.

**Endpoint**: `POST /api/v1/pathways/execute`

**Request Body**:
```json
{
  "pathway_id": "business-formation-001",
  "name": "business-formation-flow",
  "steps": [
    {
      "magician": "business",
      "action": "validate-business-idea",
      "retry_count": 2
    },
    {
      "magician": "creative",
      "action": "generate-branding",
      "retry_count": 2
    }
  ],
  "initial_payload": {
    "business_idea": "ASL education platform"
  }
}
```

**Response**:
```json
{
  "pathway_id": "business-formation-001",
  "status": "running",
  "started_at": "2024-01-01T00:00:00Z",
  "steps_completed": 0,
  "steps_total": 2
}
```

### Get Health Status

Get health status of all nodes.

**Endpoint**: `GET /api/v1/health`

**Response**:
```json
{
  "orchestrator": {
    "status": "healthy",
    "uptime_seconds": 3600
  },
  "nodes": {
    "business-magician-01": {
      "status": "healthy",
      "uptime_seconds": 3500,
      "last_heartbeat": "2024-01-01T00:00:00Z"
    }
  }
}
```

## Business Magician API

Base URL: `http://localhost:8001`

### Webhook Endpoint

Receive and execute tasks.

**Endpoint**: `POST /webhook`

**Request Body**:
```json
{
  "task_id": "task-123",
  "action": "validate-business-idea",
  "payload": {
    "idea": "Deaf-owned coffee shop",
    "target_market": "Local Deaf community"
  }
}
```

**Response**:
```json
{
  "task_id": "task-123",
  "status": "success",
  "result": {
    "validation_score": 0.75,
    "feedback": ["Good local focus", "Consider accessibility features"]
  }
}
```

### Supported Actions

#### validate-business-idea

Validates a business idea and provides feedback.

**Payload**:
```json
{
  "idea": "string",
  "target_market": "string",
  "budget": "number (optional)"
}
```

**Result**:
```json
{
  "validation_score": 0.85,
  "feedback": ["array of strings"],
  "recommended_next_steps": ["array of strings"]
}
```

#### create-business-plan

Creates a comprehensive business plan.

**Payload**:
```json
{
  "business_name": "string",
  "industry": "string",
  "target_market": "string"
}
```

**Result**:
```json
{
  "plan_outline": {
    "executive_summary": "string",
    "market_analysis": "string",
    "financial_projections": {},
    "marketing_strategy": "string",
    "operations_plan": "string"
  }
}
```

#### analyze-market

Analyzes market opportunity.

**Payload**:
```json
{
  "industry": "string",
  "geographic_area": "string (optional)",
  "target_demographic": "string (optional)"
}
```

**Result**:
```json
{
  "market_size": "string",
  "competition_level": "string",
  "opportunities": ["array of strings"],
  "threats": ["array of strings"],
  "recommendations": ["array of strings"]
}
```

#### find-funding

Finds funding opportunities.

**Payload**:
```json
{
  "amount": "number",
  "business_type": "string",
  "stage": "string (startup, growth, expansion)"
}
```

**Result**:
```json
{
  "funding_options": [
    {
      "source": "string",
      "amount_range": "string",
      "type": "loan|grant|investment",
      "application_url": "string"
    }
  ],
  "total_available": "number"
}
```

#### register-business

Provides business registration guidance.

**Payload**:
```json
{
  "business_name": "string",
  "state": "string",
  "business_type": "LLC|Corporation|Sole Proprietorship"
}
```

**Result**:
```json
{
  "registration_steps": ["array of strings"],
  "estimated_cost": "number",
  "estimated_time_days": "number",
  "next_action": "string"
}
```

### Health Check

**Endpoint**: `GET /health`

**Response**:
```json
{
  "status": "healthy",
  "uptime": 3600,
  "tasks_executed": 150,
  "last_task_time": "2024-01-01T00:00:00Z",
  "metrics": {
    "tasks_per_minute": 2.5
  }
}
```

### Initialize

**Endpoint**: `POST /initialize`

**Request Body**:
```json
{
  "config": {
    "log_level": "INFO",
    "timeout": 300,
    "custom_settings": {}
  }
}
```

**Response**:
```json
{
  "status": "initialized"
}
```

### Shutdown

**Endpoint**: `POST /shutdown`

**Response**:
```json
{
  "status": "shutdown"
}
```

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

### Common Error Codes

- `INVALID_REQUEST`: Request validation failed
- `NODE_NOT_FOUND`: Magician node not found
- `TASK_TIMEOUT`: Task execution timeout
- `INTERNAL_ERROR`: Internal server error
- `SERVICE_UNAVAILABLE`: Service temporarily unavailable

## Rate Limiting

All API endpoints are rate-limited:
- 100 requests per minute per IP
- 1000 requests per hour per API key
- Burst allowance: 20 requests

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## Authentication

### API Key Authentication

Include API key in header:
```
Authorization: Bearer YOUR_API_KEY
```

### JWT Authentication

Include JWT token in header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

## Webhooks

Magicians can send webhook events to subscribed endpoints.

### Event Format

```json
{
  "event_id": "event-123",
  "event_type": "task.completed",
  "source": "business-magician-01",
  "timestamp": "2024-01-01T00:00:00Z",
  "payload": {
    "task_id": "task-123",
    "result": {}
  }
}
```

### Event Types

- `task.started`: Task execution started
- `task.completed`: Task execution completed
- `task.failed`: Task execution failed
- `node.registered`: Node registered with orchestrator
- `node.unhealthy`: Node health degraded
- `pathway.started`: Pathway execution started
- `pathway.completed`: Pathway execution completed

## SDK Examples

### Python

```python
from magician_client import MagicianClient

client = MagicianClient(
    base_url="http://localhost:8000",
    api_key="your-api-key"
)

# Submit task
task = client.submit_task(
    magician_type="business",
    action="validate-business-idea",
    payload={
        "idea": "ASL tutoring platform",
        "target_market": "Hearing parents of Deaf children"
    }
)

# Get result
result = client.get_task_result(task.task_id)
print(result.result)
```

### JavaScript/TypeScript

```typescript
import { MagicianClient } from '@360magicians/client';

const client = new MagicianClient({
  baseUrl: 'http://localhost:8000',
  apiKey: 'your-api-key'
});

// Submit task
const task = await client.submitTask({
  magicianType: 'business',
  action: 'validate-business-idea',
  payload: {
    idea: 'ASL tutoring platform',
    targetMarket: 'Hearing parents of Deaf children'
  }
});

// Get result
const result = await client.getTaskResult(task.taskId);
console.log(result.result);
```

## Versioning

API versions are specified in the URL path:
- Current version: `v1`
- Base path: `/api/v1`

Deprecated versions remain available for 6 months after deprecation notice.
