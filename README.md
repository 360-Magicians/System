# 360 Magicians System - Unified Distributed Agent System

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)
![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)
![Docker](https://img.shields.io/badge/docker-ready-blue.svg)

This project is a **unified, distributed agent system** that consolidates specialized AI agents (Magicians) into a cohesive microservices architecture. Each Magician operates as a specialized node with webhook-based communication, pathway routing, and containerized deployment options.

The system is designed with a **"Deaf First"** philosophy, supporting Deaf and Hard-of-Hearing individuals in entrepreneurship, creative arts, employment, and technical development through ASL-native, accessible interfaces.

## Core Philosophy: "Deaf First"

Unlike traditional applications that add accessibility as an afterthought, this system is built from a "Deaf First" perspective:

-   **ASL-Native Design:** All interfaces and communications prioritize American Sign Language
-   **Visual Communication:** Heavy emphasis on visual feedback, notifications, and status indicators
-   **Accessibility Built-In:** Accessibility is a core architectural principle, not an add-on
-   **Community-Centric:** Designed specifically for Deaf entrepreneurs, creators, and developers
-   **Multimodal Communication:** Seamless translation between signed, spoken, and written language

## Architecture Overview

The system is organized into a microservices-based, distributed agent architecture:

### Core Components

1. **Core Orchestrator** (`core/orchestrator/`)
   - Central coordinator managing all Magician nodes
   - Service discovery and registration
   - Task queue and routing
   - Health monitoring

2. **Pathway Engine** (`core/pathway-engine/`)
   - Multi-step workflow execution
   - Sequential and parallel task routing
   - Conditional branching
   - Retry and error handling

3. **Magician Nodes** (`magicians/`)
   - **Business Magician**: Business operations, formation, strategy, and analytics
   - **Job Magician**: Task management, workflow execution, career services
   - **Developer Magician**: Code generation, ASL-first accessibility validation
   - **Creative Magician**: Content creation, design, and ideation
   - **DocuHand Magician**: Document processing and management
   - **Sync Magician**: Data synchronization and integration
   - **Fibonrose Magician**: Database operations and data flows

4. **Shared Infrastructure** (`shared/`)
   - Common interfaces and base classes
   - Data models and types
   - Utilities (logging, configuration)

### Communication Patterns

- **Webhook-based**: RESTful API endpoints for task execution
- **Event-driven**: Pub/Sub messaging for async communication
- **Health monitoring**: Regular health checks and heartbeats
- **Structured logging**: JSON-formatted logs with traceability

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Python 3.11+
- Git

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/360-Magicians/System.git
   cd System
   ```

2. **Create environment configuration:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start services with Docker Compose:**
   ```bash
   docker-compose up -d
   ```

4. **Verify deployment:**
   ```bash
   # Check orchestrator
   curl http://localhost:8000/health
   
   # Check Business Magician
   curl http://localhost:8001/health
   ```

5. **Submit a test task:**
   ```bash
   curl -X POST http://localhost:8000/api/v1/tasks \
     -H "Content-Type: application/json" \
     -d '{
       "magician_type": "business",
       "action": "validate-business-idea",
       "payload": {
         "idea": "ASL education platform",
         "target_market": "Deaf students"
       }
     }'
   ```

### Python SDK Usage

```python
from magician_client import MagicianClient

client = MagicianClient(base_url="http://localhost:8000")

# Submit task
task = client.submit_task(
    magician_type="business",
    action="validate-business-idea",
    payload={
        "idea": "ASL tutoring platform",
        "target_market": "Deaf community"
    }
)

# Get result
result = client.get_task_result(task.task_id)
print(result)
```

## The Handoff: From Visualization to Reality

The "Deploy Agents" and "Ready to Build" buttons in the AI-generated summary represent the critical handoff from conceptual architecture to tangible, cloud-native infrastructure. Here’s how that process is envisioned to work on the backend:

### The Magic Wand: PinkFlow CLI

At the heart of this automation is the **`PinkFlow CLI`**, the system's command-line powerhouse. It's the "magic wand" that developers and the `DeveloperMagician API` use to bring the architecture to life. It's more than just a deployment script; it's a comprehensive automation and governance engine.

-   **Infrastructure as Code (IaC):** When a build is triggered, `PinkFlow` reads the system definition from `Source Control` and uses tools like Terraform to provision every piece of infrastructure—databases, serverless functions, Kubernetes clusters, and networking.
-   **Policy Enforcement:** Before deploying, `PinkFlow` consults the **`FibonRose`** ethics engine. It checks the IaC templates against predefined policies to ensure security best practices, cost controls, and ethical guidelines are met. A deployment that violates policy is automatically halted.
-   **Security Automation:** It integrates security scanning directly into the pipeline, checking for vulnerabilities in container images, dependencies, and infrastructure configurations before they ever reach production.
-   **Automated Deployment Plans:** `PinkFlow` intelligently generates deployment plans, understanding the dependencies between services (`EDGES`) to ensure components are created in the correct order.

This CLI turns the abstract visualization into a repeatable, secure, and automated reality.

### "Deploy Agents" -> Agent Management Platform

When a user clicks **"Deploy Agents"**, they are redirected to a conceptual service like `https://agents.mbtq.dev`. This action isn't just a link; it's a handoff of the *AI agent configuration* to a specialized backend platform responsible for their lifecycle management.

1.  **Handoff:** The user's browser sends the configuration (the list of agents like `IdeaMagician`, `FundingMagician`, etc., and the chosen cloud partner) to the Agent Management Platform.
2.  **Provisioning:** The platform's backend uses an IaC tool (like Terraform) to provision serverless infrastructure for each agent (e.g., Google Cloud Functions, AWS Lambda).
3.  **Orchestration Setup:** It configures the `MagicianCore` (e.g., a Google Workflow or AWS Step Function) to correctly route requests to the appropriate agent function.
4.  **Monitoring & Management:** The user is presented with a dashboard on `agents.mbtq.dev` to monitor invocations, view logs, manage versions, and analyze costs for their deployed agents. This provides a serverless, managed environment for the "brains" of the operation.

### "Ready to Build" -> Full Infrastructure Scaffolding

Clicking **"Ready to Build"** is a more comprehensive step, handing off the *entire system architecture* to a scaffolding engine at a conceptual service like `https://build.mbtq.dev`.

1.  **Handoff:** The entire system definition (all `NODES` and `EDGES` from `constants.ts`) and the chosen cloud partner are sent to the Scaffolding Platform.
2.  **IaC Generation:** The platform's backend analyzes the architecture and generates a complete set of Infrastructure as Code scripts (e.g., Terraform, Pulumi, or CloudFormation). These scripts define every component:
    -   **Databases:** `Cloud SQL` / `RDS` instances.
    -   **APIs:** `Cloud Run` / `Lambda` services with `API Gateway` configurations.
    -   **Messaging:** `Pub/Sub` topics / `SNS` topics.
    -   **Networking & Security:** VPCs, firewalls, and IAM roles (`DeafAuth`).
3.  **CI/CD Pipeline:** The generated code is committed to a new Git repository, and a CI/CD pipeline (e.g., GitLab CI, GitHub Actions) is triggered.
4.  **Deployment:** The pipeline runs the IaC scripts, building out the entire, interconnected infrastructure in the user's own cloud account. The result is a fully provisioned, "empty" backend, ready for developers to implement the specific business logic for each microservice.

## Architecture Overview

The diagram is organized into logical layers, representing a modern, microservices-based, AI-driven platform.

-   **User Interaction Layer:** The web and mobile frontends (`ui-web-mobile`).
-   **Core Services & Gateways:** The central pillars of the system: `DeafAuth` (Identity), `PinkSync` (Accessibility), and `FibonRose` (Ethics).
-   **Microservice APIs:** Domain-specific gateways for different user pathways (Creative, Business, Job, Developer).
-   **AI Magician Agents:** A suite of specialized AI agents (e.g., `IdeaMagician`, `BuilderMagician`, `FundingMagician`) that perform complex, goal-oriented tasks.
-   **Data & Intelligence Layer:** The persistence and messaging backbone, including databases (`Supabase`), caches (`Upstash`), event buses (`Syix`), and analytics warehouses (`BigQuery`).
-   **Infrastructure & Observability:** The foundational layer for hosting AI models (`Vertex AI`), managing source code (`GitLab`), and monitoring the entire system's health.

## Technical Deep Dive: The Build-less Approach

This project intentionally avoids a traditional Node.js/npm-based build setup (like Webpack or Vite). Instead, it relies on modern browser features:

-   **ES Modules (ESM):** All code is written in standard JavaScript modules, which modern browsers can load natively.
-   **`importmap`:** The `index.html` file contains an `importmap` script tag. This tells the browser how to resolve "bare" import specifiers (like `import React from 'react'`) to full URLs, pointing to a CDN like `esm.sh`.

This approach offers several advantages for a project of this nature:
-   **Zero Setup:** No `npm install` is needed. You can clone the repository and run it immediately with a local server.
-   **Simplicity:** The "toolchain" is just the browser itself, making the codebase easier to understand and debug.
-   **Fast Iteration:** Changes are reflected instantly on browser refresh without any bundling delays.

## Tech Stack

-   **Core Language**: Python 3.11+
-   **API Framework**: FastAPI
-   **Async Runtime**: asyncio, uvicorn
-   **Data Models**: Pydantic
-   **Containerization**: Docker, Docker Compose
-   **Orchestration**: Kubernetes
-   **Messaging**: Redis (event bus)
-   **Database**: PostgreSQL
-   **Logging**: Structured JSON logging
-   **Monitoring**: Prometheus, Grafana

## Project Structure

```
360-Magicians/System/
├── core/
│   ├── orchestrator/          # Main system orchestrator
│   │   ├── service.py         # Orchestrator service
│   │   └── api.py             # REST API
│   ├── pathway-engine/        # Routing and workflow engine
│   │   └── engine.py          # Pathway execution engine
│   ├── webhook-gateway/       # API gateway (future)
│   └── event-bus/             # Event messaging (future)
├── magicians/
│   ├── business/              # Business Magician node
│   │   └── service.py
│   ├── job/                   # Job Magician (future)
│   ├── developer/             # Developer Magician (future)
│   ├── creative/              # Creative Magician (future)
│   ├── docuhand/              # DocuHand Magician (future)
│   ├── sync/                  # Sync Magician (future)
│   └── fibonrose/             # Fibonrose Magician (future)
├── shared/
│   ├── models/                # Shared data models
│   ├── utils/                 # Common utilities
│   │   ├── logger.py          # Structured logging
│   │   └── config.py          # Configuration management
│   └── interfaces/            # Standard interfaces
│       └── magician_base.py   # Base Magician class
├── infrastructure/
│   ├── docker/                # Docker configurations
│   │   ├── Dockerfile.orchestrator
│   │   └── Dockerfile.business
│   └── kubernetes/            # K8s manifests
│       ├── orchestrator-deployment.yaml
│       ├── business-magician-deployment.yaml
│       └── ingress.yaml
├── docs/
│   ├── architecture.md        # Architecture documentation
│   ├── api-reference.md       # API reference
│   └── deployment-guide.md    # Deployment guide
├── examples/
│   └── pathways/              # Example pathway configurations
│       ├── business-formation.yml
│       └── creative-content.yml
├── docker-compose.yml         # Local development setup
├── requirements.txt           # Python dependencies
└── README.md                  # This file
```

## Key Features

### Microservices Architecture
- Independent, scalable Magician nodes
- Service discovery and registration
- Health monitoring and auto-recovery
- Horizontal and vertical scaling

### Pathway System
- Multi-step workflow execution
- Sequential and parallel processing
- Conditional routing and branching
- Automatic retry with configurable attempts
- Error handling and fallback strategies

### Webhook Communication
- RESTful API endpoints
- Event-driven messaging
- CloudEvents standard support
- Request/response tracing

### Containerization
- Docker containers for all services
- Docker Compose for local development
- Kubernetes manifests for production
- Helm charts for configuration

### Observability
- Structured JSON logging
- Prometheus metrics
- Grafana dashboards
- Health check endpoints
- Request tracing

### Security
- JWT-based authentication
- Service-to-service auth
- RBAC authorization
- Network policies
- TLS encryption

## Deployment Options

### Local Development (Docker Compose)
```bash
docker-compose up -d
```

### Kubernetes
```bash
kubectl apply -f infrastructure/kubernetes/
```

### MBTQ.dev Integration
Deploy within MBTQ.dev infrastructure with shared authentication, monitoring, and database services.

See [Deployment Guide](docs/deployment-guide.md) for detailed instructions.

## Contributing

Contributions are welcome! If you have ideas for new features, components, or improvements to the architecture or code, please feel free to:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add some feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a new Pull Request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Documentation

- **[Architecture Documentation](docs/architecture.md)** - Comprehensive system architecture overview
- **[API Reference](docs/api-reference.md)** - Complete API documentation with examples
- **[Deployment Guide](docs/deployment-guide.md)** - Step-by-step deployment instructions
- **[Pathway Examples](examples/pathways/)** - Sample pathway configurations

## Examples

### Business Formation Pathway

See [examples/pathways/business-formation.yml](examples/pathways/business-formation.yml) for a complete example of a multi-step pathway that guides a Deaf entrepreneur through business formation.

### Creative Content Generation

See [examples/pathways/creative-content.yml](examples/pathways/creative-content.yml) for parallel creative task execution.

## API Examples

### Submit a Task

```bash
curl -X POST http://localhost:8000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "magician_type": "business",
    "action": "validate-business-idea",
    "payload": {
      "idea": "ASL-native customer service platform",
      "target_market": "Deaf community businesses"
    }
  }'
```

### Execute a Pathway

```bash
curl -X POST http://localhost:8000/api/v1/pathways/execute \
  -H "Content-Type: application/json" \
  -d @examples/pathways/business-formation.yml
```

## Development

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Run Tests

```bash
pytest
```

### Run Orchestrator Locally

```bash
python -m core.orchestrator.api
```

### Run Business Magician Locally

```bash
uvicorn magicians.business.service:app --port 8001
```

## Roadmap

### Phase 1: Core Infrastructure ✅
- [x] Core orchestrator service
- [x] Pathway routing engine
- [x] Shared interfaces and models
- [x] Business Magician implementation
- [x] Docker containerization
- [x] Kubernetes manifests

### Phase 2: Additional Magicians (In Progress)
- [ ] Job Magician
- [ ] Developer Magician with ASL-first accessibility validation
- [ ] Creative Magician
- [ ] DocuHand Magician
- [ ] Sync Magician
- [ ] Fibonrose Magician

### Phase 3: Enhanced Features
- [ ] Advanced pathway conditionals
- [ ] Machine learning-based routing
- [ ] Real-time monitoring dashboard
- [ ] Webhook gateway with rate limiting
- [ ] Event bus with Redis Streams

### Phase 4: Production Ready
- [ ] Full test coverage
- [ ] Performance optimization
- [ ] Security hardening
- [ ] MBTQ.dev integration
- [ ] Production deployment

## Contributing

Contributions are welcome! We especially encourage contributions from members of the Deaf community.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code follows the existing style and includes appropriate tests.

## Support & Community

- **GitHub Issues**: Report bugs and request features
- **Discussions**: Ask questions and share ideas
- **Documentation**: Comprehensive docs in the `docs/` directory

## Acknowledgments

This system is built with a "Deaf First" philosophy, designed to empower Deaf entrepreneurs, creators, and developers. Special thanks to the Deaf community for inspiration and guidance.

