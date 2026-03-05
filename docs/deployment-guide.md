# Deployment Guide

## Prerequisites

### Required Tools
- Docker (v20.10+)
- Docker Compose (v2.0+)
- kubectl (v1.24+) for Kubernetes deployment
- Python 3.11+
- Git

### System Requirements
- 4GB RAM minimum (8GB recommended)
- 10GB free disk space
- Linux, macOS, or Windows with WSL2

## Local Development Deployment

### 1. Clone Repository

```bash
git clone https://github.com/360-Magicians/System.git
cd System
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```bash
# Core Configuration
ORCHESTRATOR_HOST=0.0.0.0
ORCHESTRATOR_PORT=8000
LOG_LEVEL=INFO

# Database
POSTGRES_USER=magician
POSTGRES_PASSWORD=magician_pass
POSTGRES_DB=magician_system
DATABASE_URL=postgresql://magician:magician_pass@postgres:5432/magician_system

# Redis
REDIS_URL=redis://redis:6379

# Authentication (if using DeafAuth)
DEAFAUTH_URL=https://deafauth.mbtq.dev
API_KEY=your-api-key-here

# Monitoring
ENABLE_METRICS=true
PROMETHEUS_PORT=9090
```

### 3. Build and Start Services

```bash
# Build all containers
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Check status
docker-compose ps
```

### 4. Verify Deployment

```bash
# Check orchestrator health
curl http://localhost:8000/health

# Check Business Magician health
curl http://localhost:8001/health

# View all running services
docker-compose ps
```

### 5. Test the System

```bash
# Submit a test task
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

## Kubernetes Deployment

### 1. Create Namespace

```bash
kubectl create namespace magician-system
```

### 2. Create ConfigMap

```bash
kubectl create configmap magician-config \
  --from-file=config/settings.yaml \
  --namespace=magician-system
```

### 3. Create Secrets

```bash
kubectl create secret generic magician-secrets \
  --from-literal=database-password=your-password \
  --from-literal=api-key=your-api-key \
  --namespace=magician-system
```

### 4. Apply Kubernetes Manifests

```bash
# Apply all manifests
kubectl apply -f infrastructure/kubernetes/ --namespace=magician-system

# Check deployment status
kubectl get deployments --namespace=magician-system

# Check pods
kubectl get pods --namespace=magician-system

# Check services
kubectl get services --namespace=magician-system
```

### 5. Configure Ingress

```bash
# Apply ingress configuration
kubectl apply -f infrastructure/kubernetes/ingress.yaml --namespace=magician-system

# Get ingress IP
kubectl get ingress --namespace=magician-system
```

### 6. Verify Deployment

```bash
# Check orchestrator logs
kubectl logs -f deployment/orchestrator --namespace=magician-system

# Check Business Magician logs
kubectl logs -f deployment/business-magician --namespace=magician-system

# Port forward for testing
kubectl port-forward service/orchestrator 8000:8000 --namespace=magician-system
```

## MBTQ.dev Integration

### 1. Prerequisites

- Access to MBTQ.dev infrastructure
- DeafAuth credentials
- VPN access (if required)

### 2. Configure Integration

Update `config/mbtq-integration.yaml`:

```yaml
mbtq:
  environment: production
  region: us-central1
  
  deafauth:
    url: https://deafauth.mbtq.dev
    client_id: your-client-id
    client_secret: ${DEAFAUTH_CLIENT_SECRET}
  
  database:
    host: postgres.mbtq.dev
    port: 5432
    database: magician_system
    schema: magicians
    
  monitoring:
    prometheus_url: https://prometheus.mbtq.dev
    grafana_url: https://grafana.mbtq.dev
    
  logging:
    elasticsearch_url: https://elasticsearch.mbtq.dev
    log_level: INFO
```

### 3. Deploy to MBTQ.dev

```bash
# Set context to MBTQ.dev cluster
kubectl config use-context mbtq-production

# Apply configurations
kubectl apply -f config/mbtq-integration.yaml

# Deploy services
kubectl apply -f infrastructure/kubernetes/ --namespace=magician-system

# Verify
kubectl get all --namespace=magician-system
```

## Helm Deployment

### 1. Install Helm Chart

```bash
# Add repository
helm repo add magician-system ./infrastructure/helm

# Install chart
helm install magician-system magician-system/magician-system \
  --namespace=magician-system \
  --create-namespace \
  --values=infrastructure/helm/values-production.yaml
```

### 2. Update Deployment

```bash
# Update values
helm upgrade magician-system magician-system/magician-system \
  --namespace=magician-system \
  --values=infrastructure/helm/values-production.yaml

# Rollback if needed
helm rollback magician-system --namespace=magician-system
```

### 3. Uninstall

```bash
helm uninstall magician-system --namespace=magician-system
```

## Scaling

### Horizontal Scaling

#### Docker Compose
```bash
# Scale Business Magician to 3 instances
docker-compose up -d --scale business-magician=3

# Scale multiple services
docker-compose up -d \
  --scale business-magician=3 \
  --scale job-magician=2 \
  --scale developer-magician=2
```

#### Kubernetes
```bash
# Scale deployment
kubectl scale deployment business-magician \
  --replicas=3 \
  --namespace=magician-system

# Auto-scaling
kubectl autoscale deployment business-magician \
  --min=2 \
  --max=10 \
  --cpu-percent=70 \
  --namespace=magician-system
```

### Vertical Scaling

Update resource limits in `docker-compose.yml`:

```yaml
business-magician:
  deploy:
    resources:
      limits:
        cpus: '2'
        memory: 2G
      reservations:
        cpus: '1'
        memory: 1G
```

Or in Kubernetes manifests:

```yaml
resources:
  limits:
    cpu: "2"
    memory: "2Gi"
  requests:
    cpu: "1"
    memory: "1Gi"
```

## Monitoring Setup

### Prometheus

```bash
# Deploy Prometheus
kubectl apply -f infrastructure/kubernetes/monitoring/prometheus.yaml

# Access Prometheus UI
kubectl port-forward service/prometheus 9090:9090 --namespace=magician-system
```

### Grafana

```bash
# Deploy Grafana
kubectl apply -f infrastructure/kubernetes/monitoring/grafana.yaml

# Access Grafana UI
kubectl port-forward service/grafana 3000:3000 --namespace=magician-system

# Default credentials: admin/admin
```

### Import Dashboards

1. Open Grafana: http://localhost:3000
2. Navigate to Dashboards → Import
3. Upload dashboard JSON from `infrastructure/monitoring/dashboards/`

## Backup and Recovery

### Database Backup

```bash
# Backup PostgreSQL
docker-compose exec postgres pg_dump \
  -U magician magician_system > backup.sql

# Restore from backup
docker-compose exec -T postgres psql \
  -U magician magician_system < backup.sql
```

### Configuration Backup

```bash
# Backup all configurations
kubectl get all --namespace=magician-system -o yaml > backup-config.yaml

# Restore
kubectl apply -f backup-config.yaml
```

## Troubleshooting

### Service Won't Start

```bash
# Check logs
docker-compose logs business-magician

# Check container status
docker-compose ps

# Restart service
docker-compose restart business-magician
```

### Database Connection Issues

```bash
# Test database connection
docker-compose exec postgres psql -U magician -d magician_system

# Check environment variables
docker-compose exec business-magician env | grep DATABASE
```

### Network Issues

```bash
# Inspect network
docker network inspect magician-system_magician-network

# Test connectivity
docker-compose exec business-magician ping orchestrator
```

### Performance Issues

```bash
# Check resource usage
docker stats

# Check Kubernetes resource usage
kubectl top pods --namespace=magician-system

# View metrics
curl http://localhost:8000/metrics
```

## Security Hardening

### 1. Use Secrets Management

```bash
# Use Kubernetes secrets
kubectl create secret generic api-keys \
  --from-file=api-key.txt \
  --namespace=magician-system
```

### 2. Enable TLS

Update ingress configuration:

```yaml
spec:
  tls:
    - hosts:
        - magician-system.mbtq.dev
      secretName: tls-secret
```

### 3. Network Policies

```bash
# Apply network policies
kubectl apply -f infrastructure/kubernetes/network-policies.yaml
```

### 4. RBAC Configuration

```bash
# Apply RBAC rules
kubectl apply -f infrastructure/kubernetes/rbac.yaml
```

## Update and Maintenance

### Rolling Update

```bash
# Docker Compose
docker-compose pull
docker-compose up -d --no-deps --build business-magician

# Kubernetes
kubectl set image deployment/business-magician \
  business-magician=360magicians/business-magician:v1.1.0 \
  --namespace=magician-system
```

### Zero-Downtime Deployment

```bash
# Update deployment with rolling update strategy
kubectl apply -f infrastructure/kubernetes/deployment.yaml \
  --namespace=magician-system

# Monitor rollout
kubectl rollout status deployment/business-magician \
  --namespace=magician-system
```

## Health Checks

### Liveness Probe
Checks if container is alive:
```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 8001
  initialDelaySeconds: 30
  periodSeconds: 10
```

### Readiness Probe
Checks if container is ready to serve traffic:
```yaml
readinessProbe:
  httpGet:
    path: /health
    port: 8001
  initialDelaySeconds: 10
  periodSeconds: 5
```

## Support

For deployment issues:
- GitHub Issues: https://github.com/360-Magicians/System/issues
- Documentation: https://docs.360magicians.com
- Community Slack: https://360magicians.slack.com

## Additional Resources

- [Architecture Documentation](architecture.md)
- [API Reference](api-reference.md)
- [Development Guide](development-guide.md)
- [Security Best Practices](security.md)
