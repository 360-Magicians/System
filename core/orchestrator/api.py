"""FastAPI application for the Core Orchestrator.

This module provides the REST API endpoints for the orchestrator service.
"""

from typing import Dict, Any, List, Optional
from datetime import datetime
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from core.orchestrator.service import MagicianOrchestrator
from core.pathway_engine.engine import PathwayEngine
from shared.models import (
    Task, TaskResult, TaskStatus, MagicianType,
    Pathway, PathwayStep, HealthCheck
)
from shared.utils.config import ConfigManager
from shared.utils.logger import StructuredLogger


# API Models
class NodeRegistration(BaseModel):
    node_id: str
    magician_type: MagicianType
    webhook_url: str
    metadata: Optional[Dict[str, Any]] = None


class TaskSubmission(BaseModel):
    magician_type: MagicianType
    action: str
    payload: Dict[str, Any] = {}
    priority: int = 5
    timeout: Optional[int] = 300


class PathwayExecution(BaseModel):
    pathway: Pathway
    initial_payload: Dict[str, Any]


# Initialize FastAPI app
app = FastAPI(
    title="Magician System Orchestrator",
    description="Core orchestrator for the 360 Magicians distributed agent system",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
config = ConfigManager()
logger = StructuredLogger("orchestrator-api")
orchestrator = MagicianOrchestrator(config)
pathway_engine = PathwayEngine(orchestrator)


@app.on_event("startup")
async def startup_event():
    """Initialize services on startup."""
    logger.info("Starting orchestrator API")


@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown."""
    logger.info("Shutting down orchestrator API")
    orchestrator.stop()


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "service": "Magician System Orchestrator",
        "version": "1.0.0",
        "status": "operational"
    }


@app.get("/health")
async def health():
    """Health check endpoint."""
    node_health = orchestrator.healthcheck_nodes()
    
    all_healthy = all(
        health.status == "healthy" 
        for health in node_health.values()
    )
    
    return {
        "status": "healthy" if all_healthy else "degraded",
        "timestamp": datetime.utcnow().isoformat(),
        "nodes": {
            node_id: {
                "status": health.status,
                "uptime_seconds": health.uptime_seconds
            }
            for node_id, health in node_health.items()
        }
    }


@app.post("/api/v1/nodes/register", status_code=status.HTTP_201_CREATED)
async def register_node(registration: NodeRegistration):
    """Register a Magician node."""
    success = orchestrator.register_node(
        node_id=registration.node_id,
        magician_type=registration.magician_type,
        webhook_url=registration.webhook_url,
        metadata=registration.metadata
    )
    
    if success:
        return {
            "status": "registered",
            "node_id": registration.node_id,
            "registered_at": datetime.utcnow().isoformat()
        }
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to register node"
        )


@app.delete("/api/v1/nodes/{node_id}")
async def unregister_node(node_id: str):
    """Unregister a Magician node."""
    success = orchestrator.unregister_node(node_id)
    
    if success:
        return {
            "status": "unregistered",
            "node_id": node_id
        }
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Node {node_id} not found"
        )


@app.get("/api/v1/nodes")
async def list_nodes():
    """List all registered nodes."""
    return {
        "nodes": list(orchestrator.registered_nodes.values())
    }


@app.get("/api/v1/nodes/{node_id}")
async def get_node(node_id: str):
    """Get information about a specific node."""
    node = orchestrator.registered_nodes.get(node_id)
    
    if node:
        return node
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Node {node_id} not found"
        )


@app.post("/api/v1/tasks", status_code=status.HTTP_202_ACCEPTED)
async def submit_task(submission: TaskSubmission):
    """Submit a task for execution."""
    task = Task(
        task_id=f"task-{datetime.utcnow().timestamp()}",
        magician_type=submission.magician_type,
        action=submission.action,
        payload=submission.payload,
        priority=submission.priority,
        timeout=submission.timeout
    )
    
    task_id = orchestrator.submit_task(task)
    
    return {
        "task_id": task_id,
        "status": "pending",
        "created_at": datetime.utcnow().isoformat()
    }


@app.get("/api/v1/tasks/{task_id}")
async def get_task_result(task_id: str):
    """Get the result of a task."""
    result = orchestrator.get_task_result(task_id)
    
    if result:
        return result.dict()
    else:
        # Check if task is still active
        if task_id in orchestrator.active_tasks:
            return {
                "task_id": task_id,
                "status": "in_progress"
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Task {task_id} not found"
            )


@app.post("/api/v1/pathways/execute", status_code=status.HTTP_202_ACCEPTED)
async def execute_pathway(execution: PathwayExecution):
    """Execute a multi-step pathway."""
    pathway_id = execution.pathway.pathway_id
    
    # Start pathway execution asynchronously
    import asyncio
    asyncio.create_task(
        pathway_engine.execute_pathway(
            execution.pathway,
            execution.initial_payload
        )
    )
    
    return {
        "pathway_id": pathway_id,
        "status": "running",
        "started_at": datetime.utcnow().isoformat()
    }


@app.get("/api/v1/pathways/{pathway_id}")
async def get_pathway_status(pathway_id: str):
    """Get the status of a pathway execution."""
    status_info = pathway_engine.get_pathway_status(pathway_id)
    
    if status_info:
        return status_info
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pathway {pathway_id} not found or completed"
        )


@app.get("/api/v1/metrics")
async def get_metrics():
    """Get system metrics."""
    return {
        "registered_nodes": len(orchestrator.registered_nodes),
        "active_tasks": len(orchestrator.active_tasks),
        "completed_tasks": len(orchestrator.task_results),
        "queued_tasks": len(orchestrator.task_queue),
        "active_pathways": len(pathway_engine.active_pathways)
    }


if __name__ == "__main__":
    import uvicorn
    
    host = config.get("orchestrator.host", "0.0.0.0")
    port = int(config.get("orchestrator.port", "8000"))
    
    logger.info(f"Starting orchestrator on {host}:{port}")
    
    uvicorn.run(
        app,
        host=host,
        port=port,
        log_level="info"
    )
