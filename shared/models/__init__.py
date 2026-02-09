"""Shared data models for the Magician system."""

from datetime import datetime
from enum import Enum
from typing import Dict, Any, Optional, List
from pydantic import BaseModel, Field


class TaskStatus(str, Enum):
    """Task execution status."""
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    SUCCESS = "success"
    FAILURE = "failure"
    CANCELLED = "cancelled"


class HealthStatus(str, Enum):
    """Health check status."""
    HEALTHY = "healthy"
    DEGRADED = "degraded"
    UNHEALTHY = "unhealthy"


class MagicianType(str, Enum):
    """Types of Magician nodes."""
    BUSINESS = "business"
    JOB = "job"
    DEVELOPER = "developer"
    CREATIVE = "creative"
    DOCUHAND = "docuhand"
    SYNC = "sync"
    FIBONROSE = "fibonrose"


class Task(BaseModel):
    """Task model for Magician execution."""
    task_id: str = Field(..., description="Unique task identifier")
    magician_type: MagicianType = Field(..., description="Target Magician type")
    action: str = Field(..., description="Action to perform")
    payload: Dict[str, Any] = Field(default_factory=dict, description="Task data")
    context: Dict[str, Any] = Field(default_factory=dict, description="Execution context")
    priority: int = Field(default=5, ge=1, le=10, description="Task priority (1-10)")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    timeout: Optional[int] = Field(default=300, description="Timeout in seconds")
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class TaskResult(BaseModel):
    """Task execution result."""
    task_id: str
    status: TaskStatus
    result: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    duration_ms: Optional[int] = None
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class HealthCheck(BaseModel):
    """Health check response."""
    node_id: str
    status: HealthStatus
    uptime_seconds: float
    last_heartbeat: Optional[datetime] = None
    metrics: Dict[str, Any] = Field(default_factory=dict)
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class WebhookEvent(BaseModel):
    """Webhook event model."""
    event_id: str = Field(..., description="Unique event identifier")
    event_type: str = Field(..., description="Type of event")
    source: str = Field(..., description="Source Magician node")
    target: Optional[str] = Field(None, description="Target Magician node")
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    payload: Dict[str, Any] = Field(default_factory=dict)
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class PathwayStep(BaseModel):
    """Single step in a pathway."""
    magician: MagicianType
    action: str
    condition: Optional[str] = None
    timeout: Optional[int] = None
    retry_count: int = Field(default=3)
    on_success: Optional[str] = Field(None, description="Next step on success")
    on_failure: Optional[str] = Field(None, description="Next step on failure")


class Pathway(BaseModel):
    """Pathway definition for chaining Magicians."""
    pathway_id: str
    name: str
    description: Optional[str] = None
    steps: List[PathwayStep]
    parallel: bool = Field(default=False, description="Execute steps in parallel")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }
