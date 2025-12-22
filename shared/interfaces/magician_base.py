"""Base interface for all Magician nodes.

This module defines the standard interface that all Magician nodes must implement
to ensure consistent communication and lifecycle management across the distributed system.
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
from datetime import datetime


class MagicianNode(ABC):
    """Abstract base class for all Magician nodes.
    
    Each Magician must implement this interface to participate in the
    unified distributed agent system.
    """
    
    def __init__(self, node_id: str, config: Optional[Dict[str, Any]] = None):
        """Initialize the Magician node.
        
        Args:
            node_id: Unique identifier for this Magician instance
            config: Optional configuration dictionary
        """
        self.node_id = node_id
        self.config = config or {}
        self.status = "initialized"
        self.created_at = datetime.utcnow()
        self.last_heartbeat = None
    
    @abstractmethod
    def initialize(self, config: Dict[str, Any]) -> bool:
        """Initialize the Magician with configuration.
        
        Args:
            config: Configuration dictionary containing necessary settings
            
        Returns:
            True if initialization successful, False otherwise
        """
        pass
    
    @abstractmethod
    def execute(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Execute a task assigned to this Magician.
        
        Args:
            task: Task dictionary containing:
                - task_id: Unique task identifier
                - action: Action to perform
                - payload: Task-specific data
                - context: Execution context
                
        Returns:
            Result dictionary containing:
                - task_id: Original task identifier
                - status: "success", "failure", or "pending"
                - result: Task result data
                - error: Error message if status is "failure"
        """
        pass
    
    @abstractmethod
    def webhook_endpoint(self) -> str:
        """Return the webhook endpoint URL for this Magician.
        
        Returns:
            Webhook URL as string
        """
        pass
    
    @abstractmethod
    def healthcheck(self) -> Dict[str, Any]:
        """Perform health check and return status.
        
        Returns:
            Health status dictionary containing:
                - status: "healthy", "degraded", or "unhealthy"
                - uptime: Time since initialization
                - metrics: Optional performance metrics
        """
        pass
    
    @abstractmethod
    def shutdown(self) -> bool:
        """Gracefully shutdown the Magician node.
        
        Returns:
            True if shutdown successful, False otherwise
        """
        pass
    
    def heartbeat(self) -> Dict[str, Any]:
        """Send heartbeat signal.
        
        Returns:
            Heartbeat data including timestamp and status
        """
        self.last_heartbeat = datetime.utcnow()
        return {
            "node_id": self.node_id,
            "timestamp": self.last_heartbeat.isoformat(),
            "status": self.status
        }
