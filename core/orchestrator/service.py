"""Main orchestrator service.

This module manages the lifecycle and coordination of all Magician nodes
in the distributed agent system.
"""

from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta
import asyncio
from shared.models import (
    Task, TaskResult, TaskStatus, MagicianType, 
    HealthCheck, HealthStatus
)
from shared.utils.logger import StructuredLogger
from shared.utils.config import ConfigManager


class MagicianOrchestrator:
    """Core orchestrator for managing Magician nodes."""
    
    def __init__(self, config: Optional[ConfigManager] = None):
        """Initialize the orchestrator.
        
        Args:
            config: Configuration manager instance
        """
        self.config = config or ConfigManager()
        self.logger = StructuredLogger("orchestrator")
        self.registered_nodes: Dict[str, Dict[str, Any]] = {}
        self.task_queue: List[Task] = []
        self.active_tasks: Dict[str, Task] = {}
        self.task_results: Dict[str, TaskResult] = {}
        self.running = False
        
        self.logger.info("Orchestrator initialized")
    
    def register_node(
        self, 
        node_id: str, 
        magician_type: MagicianType,
        webhook_url: str,
        metadata: Optional[Dict[str, Any]] = None
    ) -> bool:
        """Register a Magician node with the orchestrator.
        
        Args:
            node_id: Unique identifier for the node
            magician_type: Type of Magician
            webhook_url: Webhook endpoint URL
            metadata: Optional metadata
            
        Returns:
            True if registration successful
        """
        self.registered_nodes[node_id] = {
            "node_id": node_id,
            "magician_type": magician_type,
            "webhook_url": webhook_url,
            "metadata": metadata or {},
            "status": "active",
            "registered_at": datetime.utcnow(),
            "last_heartbeat": datetime.utcnow()
        }
        
        self.logger.info(
            f"Node registered: {node_id}",
            node_id=node_id,
            magician_type=magician_type.value
        )
        return True
    
    def unregister_node(self, node_id: str) -> bool:
        """Unregister a Magician node.
        
        Args:
            node_id: Node identifier
            
        Returns:
            True if unregistration successful
        """
        if node_id in self.registered_nodes:
            del self.registered_nodes[node_id]
            self.logger.info(f"Node unregistered: {node_id}", node_id=node_id)
            return True
        return False
    
    def get_nodes_by_type(self, magician_type: MagicianType) -> List[Dict[str, Any]]:
        """Get all registered nodes of a specific type.
        
        Args:
            magician_type: Type of Magician
            
        Returns:
            List of node information dictionaries
        """
        return [
            node for node in self.registered_nodes.values()
            if node["magician_type"] == magician_type
        ]
    
    def submit_task(self, task: Task) -> str:
        """Submit a task for execution.
        
        Args:
            task: Task to execute
            
        Returns:
            Task ID
        """
        self.task_queue.append(task)
        self.logger.info(
            f"Task submitted: {task.task_id}",
            task_id=task.task_id,
            magician_type=task.magician_type.value,
            action=task.action
        )
        return task.task_id
    
    async def execute_task(self, task: Task) -> TaskResult:
        """Execute a task on the appropriate Magician node.
        
        Args:
            task: Task to execute
            
        Returns:
            Task result
        """
        self.active_tasks[task.task_id] = task
        start_time = datetime.utcnow()
        
        try:
            # Get available nodes for this task type
            nodes = self.get_nodes_by_type(task.magician_type)
            
            if not nodes:
                self.logger.error(
                    f"No nodes available for task",
                    task_id=task.task_id,
                    magician_type=task.magician_type.value
                )
                return TaskResult(
                    task_id=task.task_id,
                    status=TaskStatus.FAILURE,
                    error=f"No {task.magician_type.value} nodes available",
                    started_at=start_time,
                    completed_at=datetime.utcnow()
                )
            
            # Select node (simple round-robin for now)
            node = nodes[0]
            
            self.logger.info(
                f"Executing task on node",
                task_id=task.task_id,
                node_id=node["node_id"]
            )
            
            # Simulate task execution (actual webhook call would go here)
            await asyncio.sleep(0.1)
            
            result = TaskResult(
                task_id=task.task_id,
                status=TaskStatus.SUCCESS,
                result={"message": "Task executed successfully"},
                started_at=start_time,
                completed_at=datetime.utcnow(),
                duration_ms=int((datetime.utcnow() - start_time).total_seconds() * 1000)
            )
            
            self.task_results[task.task_id] = result
            return result
            
        except Exception as e:
            self.logger.error(
                f"Task execution failed",
                task_id=task.task_id,
                error=str(e)
            )
            return TaskResult(
                task_id=task.task_id,
                status=TaskStatus.FAILURE,
                error=str(e),
                started_at=start_time,
                completed_at=datetime.utcnow()
            )
        finally:
            if task.task_id in self.active_tasks:
                del self.active_tasks[task.task_id]
    
    def get_task_result(self, task_id: str) -> Optional[TaskResult]:
        """Get result of a completed task.
        
        Args:
            task_id: Task identifier
            
        Returns:
            Task result or None if not found
        """
        return self.task_results.get(task_id)
    
    def healthcheck_nodes(self) -> Dict[str, HealthCheck]:
        """Check health of all registered nodes.
        
        Returns:
            Dictionary of node health checks
        """
        health_checks = {}
        current_time = datetime.utcnow()
        
        for node_id, node_info in self.registered_nodes.items():
            last_heartbeat = node_info.get("last_heartbeat")
            uptime = (current_time - node_info["registered_at"]).total_seconds()
            
            # Determine health status based on heartbeat
            if last_heartbeat:
                time_since_heartbeat = (current_time - last_heartbeat).total_seconds()
                if time_since_heartbeat < 30:
                    status = HealthStatus.HEALTHY
                elif time_since_heartbeat < 60:
                    status = HealthStatus.DEGRADED
                else:
                    status = HealthStatus.UNHEALTHY
            else:
                status = HealthStatus.UNHEALTHY
            
            health_checks[node_id] = HealthCheck(
                node_id=node_id,
                status=status,
                uptime_seconds=uptime,
                last_heartbeat=last_heartbeat
            )
        
        return health_checks
    
    async def start(self) -> None:
        """Start the orchestrator."""
        self.running = True
        self.logger.info("Orchestrator started")
        
        while self.running:
            # Process task queue
            while self.task_queue:
                task = self.task_queue.pop(0)
                await self.execute_task(task)
            
            await asyncio.sleep(0.1)
    
    def stop(self) -> None:
        """Stop the orchestrator."""
        self.running = False
        self.logger.info("Orchestrator stopped")
