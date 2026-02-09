# Architecture Documentation

## System Overview

The 360 Magicians System is a unified, distributed agent system that consolidates specialized AI agents (Magicians) into a cohesive microservices architecture. Each Magician operates as a specialized node with webhook-based communication, pathway routing, and containerized deployment options.

## Core Philosophy: Deaf First

This system is built with a "Deaf First" philosophy:

- **ASL-First Design**: All interfaces and communications prioritize American Sign Language
- **Visual Communication**: Heavy emphasis on visual feedback and notifications
- **Accessibility Built-In**: Accessibility is not an add-on but a core architectural principle
- **Community-Centric**: Designed specifically for Deaf entrepreneurs and creators

## Architecture Components

### 1. Core Orchestrator

**Location**: `core/orchestrator/`

The orchestrator is the central coordinator that:
- Manages lifecycle of all Magician nodes
- Handles service discovery and registration
- Routes tasks to appropriate Magicians
- Monitors health of all nodes
- Coordinates multi-Magician workflows

**Key Features**:
- Task queue management
- Node registration and discovery
- Health monitoring
- Centralized logging

### 2. Pathway Engine

**Location**: `core/pathway-engine/`

The pathway engine enables complex multi-step workflows:
- Sequential execution of tasks across Magicians
- Parallel execution for independent tasks
- Conditional routing based on results
- Retry mechanisms with configurable attempts
- Error handling and fallback strategies

**Key Features**:
- YAML-based pathway definitions
- Support for conditional branching
- Automatic retry with exponential backoff
- Execution context tracking

### 3. Magician Nodes

**Location**: `magicians/`

Each Magician is a specialized microservice:

#### Business Magician (`magicians/business/`)
- Business idea validation
- Business plan creation
- Market analysis
- Funding opportunity discovery
- Business registration assistance

#### Job Magician (`magicians/job/`)
- Job posting management
- Candidate matching
- Career path planning
- Skills assessment
- Interview scheduling

#### Developer Magician (`magicians/developer/`)
- Code generation
- ASL-first accessibility validation
- Technical documentation
- Debugging assistance
- API integration

#### Creative Magician (`magicians/creative/`)
- Brand design
- Content creation
- Visual asset generation
- Marketing materials
- Social media content

#### DocuHand Magician (`magicians/docuhand/`)
- Document processing
- PDF generation
- Template management
- Document signing workflows
- Format conversion

#### Sync Magician (`magicians/sync/`)
- Data synchronization
- Real-time updates
- Multi-platform integration
- State management
- Change detection

#### Fibonrose Magician (`magicians/fibonrose/`)
- Database operations
- Data migrations
- Query optimization
- Schema management
- Data analytics

### 4. Shared Components

**Location**: `shared/`

#### Interfaces (`shared/interfaces/`)
- `MagicianNode`: Base class for all Magicians
- Standard lifecycle methods
- Consistent API contracts

#### Models (`shared/models/`)
- `Task`: Task definition model
- `TaskResult`: Execution result model
- `Pathway`: Workflow definition
- `WebhookEvent`: Event model
- Common enums and types

#### Utilities (`shared/utils/`)
- `StructuredLogger`: JSON-based logging
- `ConfigManager`: Environment and file-based configuration
- Common helper functions

## Communication Patterns

### 1. Webhook-Based Communication

Each Magician exposes a webhook endpoint:
```
POST /webhook
{
  "task_id": "unique-id",
  "action": "action-name",
  "payload": { ... },
  "context": { ... }
}
```

### 2. Event Bus (Pub/Sub)

Redis-based event bus for:
- Broadcasting status updates
- Notifying multiple Magicians
- Async communication
- Event sourcing

### 3. Direct API Calls

RESTful APIs for:
- Health checks: `GET /health`
- Configuration: `POST /initialize`
- Graceful shutdown: `POST /shutdown`

## Data Flow

```
User Request → Orchestrator → Task Queue → Magician Node → Result
                    ↓
              Pathway Engine (for multi-step workflows)
                    ↓
              Task Routing → Multiple Magicians → Aggregated Results
```

## Deployment Architecture

### Local Development
- Docker Compose orchestration
- Shared network for inter-service communication
- Volume mounts for development
- Hot reload support

### Production (Kubernetes)
- Separate deployments per Magician
- Horizontal pod autoscaling
- Service mesh for inter-service communication
- Ingress for external access
- Persistent volumes for shared data

### MBTQ.dev Integration
- Deploy within existing infrastructure
- Shared authentication via DeafAuth
- Centralized monitoring and logging
- Common database instances
- Unified API gateway

## Security

### Authentication
- JWT-based tokens
- Service-to-service authentication
- API key management
- OAuth2 integration for external services

### Authorization
- Role-Based Access Control (RBAC)
- Per-Magician permissions
- Resource-level access control
- Audit logging

### Network Security
- TLS encryption for all communications
- Network policies in Kubernetes
- Firewall rules
- DDoS protection

## Monitoring & Observability

### Logging
- Structured JSON logs
- Centralized log aggregation
- Log levels: DEBUG, INFO, WARNING, ERROR, CRITICAL
- Request/response tracing

### Metrics
- Prometheus metrics collection
- Grafana dashboards
- Custom business metrics
- Performance monitoring

### Health Checks
- Liveness probes
- Readiness probes
- Startup probes
- Dependency health checks

## Scalability

### Horizontal Scaling
- Multiple instances per Magician
- Load balancing across instances
- Stateless design
- Shared data stores

### Vertical Scaling
- Resource limits per container
- Auto-scaling based on metrics
- Memory and CPU optimization

### Performance Optimization
- Task queuing and batching
- Caching strategies
- Database indexing
- CDN for static assets

## Accessibility Features

### ASL-First Interface
- Video-based communication support
- Visual feedback mechanisms
- Sign language avatar integration
- Minimal text-heavy interfaces

### Visual Alerts
- Color-coded status indicators
- Animation-based notifications
- Progress visualization
- Error highlighting

### Cultural Sensitivity
- Deaf community terminology
- Cultural context awareness
- Community-driven design
- Inclusive user testing

## Future Enhancements

### Mini-Magician Variants
- Lightweight versions for edge deployment
- Serverless function versions
- Mobile-optimized variants
- Reduced feature sets for specific use cases

### Advanced Pathways
- Machine learning-based routing
- Dynamic pathway generation
- A/B testing of pathways
- Optimization algorithms

### Enhanced Monitoring
- Predictive failure detection
- Anomaly detection
- Performance recommendations
- Cost optimization

## References

- [API Reference](api-reference.md)
- [Deployment Guide](deployment-guide.md)
- [Development Guide](development-guide.md)
- [Pathway Examples](../examples/pathways/)
