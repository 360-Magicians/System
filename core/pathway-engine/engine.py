"""Pathway engine for routing and chaining Magician tasks.

This module implements the routing logic for executing multi-step
pathways across different Magician nodes.
"""

from typing import Dict, Any, List, Optional
from datetime import datetime
import asyncio
from shared.models import (
    Pathway, PathwayStep, Task, TaskResult, 
    TaskStatus, MagicianType
)
from shared.utils.logger import StructuredLogger


class PathwayEngine:
    """Engine for executing pathways across Magician nodes."""
    
    def __init__(self, orchestrator):
        """Initialize pathway engine.
        
        Args:
            orchestrator: Reference to the main orchestrator
        """
        self.orchestrator = orchestrator
        self.logger = StructuredLogger("pathway-engine")
        self.active_pathways: Dict[str, Dict[str, Any]] = {}
    
    async def execute_pathway(
        self, 
        pathway: Pathway,
        initial_payload: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Execute a complete pathway.
        
        Args:
            pathway: Pathway definition
            initial_payload: Initial data for the pathway
            
        Returns:
            Pathway execution result with all step results
        """
        pathway_id = pathway.pathway_id
        self.logger.info(
            f"Starting pathway execution: {pathway.name}",
            pathway_id=pathway_id,
            steps=len(pathway.steps)
        )
        
        execution_context = {
            "pathway_id": pathway_id,
            "name": pathway.name,
            "started_at": datetime.utcnow(),
            "steps": [],
            "status": "running"
        }
        
        self.active_pathways[pathway_id] = execution_context
        
        try:
            if pathway.parallel:
                # Execute steps in parallel
                results = await self._execute_parallel(
                    pathway.steps, 
                    initial_payload,
                    execution_context
                )
            else:
                # Execute steps sequentially
                results = await self._execute_sequential(
                    pathway.steps,
                    initial_payload,
                    execution_context
                )
            
            execution_context["status"] = "completed"
            execution_context["completed_at"] = datetime.utcnow()
            execution_context["results"] = results
            
            self.logger.info(
                f"Pathway execution completed: {pathway.name}",
                pathway_id=pathway_id
            )
            
            return execution_context
            
        except Exception as e:
            execution_context["status"] = "failed"
            execution_context["error"] = str(e)
            execution_context["completed_at"] = datetime.utcnow()
            
            self.logger.error(
                f"Pathway execution failed: {pathway.name}",
                pathway_id=pathway_id,
                error=str(e)
            )
            
            return execution_context
        
        finally:
            if pathway_id in self.active_pathways:
                del self.active_pathways[pathway_id]
    
    async def _execute_sequential(
        self,
        steps: List[PathwayStep],
        initial_payload: Dict[str, Any],
        execution_context: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        """Execute pathway steps sequentially.
        
        Args:
            steps: List of pathway steps
            initial_payload: Initial data
            execution_context: Execution context
            
        Returns:
            List of step results
        """
        results = []
        payload = initial_payload.copy()
        
        for idx, step in enumerate(steps):
            step_result = await self._execute_step(
                step,
                payload,
                execution_context,
                step_index=idx
            )
            
            results.append(step_result)
            execution_context["steps"].append(step_result)
            
            # Check if step failed
            if step_result["status"] == TaskStatus.FAILURE:
                if step.on_failure:
                    self.logger.info(
                        f"Step failed, routing to failure handler",
                        step_index=idx,
                        next_step=step.on_failure
                    )
                else:
                    # Stop execution on failure
                    self.logger.warning(
                        f"Step failed, stopping pathway execution",
                        step_index=idx
                    )
                    break
            
            # Update payload with step result for next step
            if step_result.get("result"):
                payload.update(step_result["result"])
        
        return results
    
    async def _execute_parallel(
        self,
        steps: List[PathwayStep],
        initial_payload: Dict[str, Any],
        execution_context: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        """Execute pathway steps in parallel.
        
        Args:
            steps: List of pathway steps
            initial_payload: Initial data
            execution_context: Execution context
            
        Returns:
            List of step results
        """
        tasks = []
        
        for idx, step in enumerate(steps):
            task = self._execute_step(
                step,
                initial_payload.copy(),
                execution_context,
                step_index=idx
            )
            tasks.append(task)
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        for result in results:
            execution_context["steps"].append(result)
        
        return results
    
    async def _execute_step(
        self,
        step: PathwayStep,
        payload: Dict[str, Any],
        execution_context: Dict[str, Any],
        step_index: int
    ) -> Dict[str, Any]:
        """Execute a single pathway step.
        
        Args:
            step: Pathway step to execute
            payload: Step payload
            execution_context: Execution context
            step_index: Index of step in pathway
            
        Returns:
            Step execution result
        """
        self.logger.info(
            f"Executing step {step_index}",
            magician=step.magician.value,
            action=step.action
        )
        
        # Check condition if present
        if step.condition:
            # Simplified condition evaluation (would need proper parser)
            if not self._evaluate_condition(step.condition, payload):
                self.logger.info(
                    f"Step condition not met, skipping",
                    step_index=step_index
                )
                return {
                    "step_index": step_index,
                    "magician": step.magician.value,
                    "action": step.action,
                    "status": "skipped",
                    "reason": "condition_not_met"
                }
        
        # Create task for this step
        task = Task(
            task_id=f"{execution_context['pathway_id']}_step_{step_index}",
            magician_type=step.magician,
            action=step.action,
            payload=payload,
            timeout=step.timeout
        )
        
        # Execute with retries
        retry_count = 0
        last_error = None
        
        while retry_count <= step.retry_count:
            try:
                result = await self.orchestrator.execute_task(task)
                
                if result.status == TaskStatus.SUCCESS:
                    return {
                        "step_index": step_index,
                        "magician": step.magician.value,
                        "action": step.action,
                        "status": result.status,
                        "result": result.result,
                        "duration_ms": result.duration_ms
                    }
                else:
                    last_error = result.error
                    retry_count += 1
                    
                    if retry_count <= step.retry_count:
                        self.logger.warning(
                            f"Step failed, retrying ({retry_count}/{step.retry_count})",
                            step_index=step_index
                        )
                        await asyncio.sleep(1)  # Wait before retry
                    
            except Exception as e:
                last_error = str(e)
                retry_count += 1
                
                if retry_count <= step.retry_count:
                    self.logger.warning(
                        f"Step failed, retrying ({retry_count}/{step.retry_count})",
                        step_index=step_index,
                        error=str(e)
                    )
                    await asyncio.sleep(1)
        
        # All retries exhausted
        return {
            "step_index": step_index,
            "magician": step.magician.value,
            "action": step.action,
            "status": TaskStatus.FAILURE,
            "error": last_error
        }
    
    def _evaluate_condition(self, condition: str, payload: Dict[str, Any]) -> bool:
        """Evaluate a step condition.
        
        Args:
            condition: Condition string
            payload: Payload data
            
        Returns:
            True if condition met, False otherwise
        """
        # Simple condition evaluation (would need proper parser in production)
        try:
            # WARNING: Using eval is dangerous in production!
            # This is a simplified example. Use a proper expression parser.
            return bool(eval(condition, {"__builtins__": {}}, payload))
        except Exception:
            self.logger.warning(
                f"Failed to evaluate condition: {condition}",
                condition=condition
            )
            return False
    
    def get_pathway_status(self, pathway_id: str) -> Optional[Dict[str, Any]]:
        """Get status of an active pathway.
        
        Args:
            pathway_id: Pathway identifier
            
        Returns:
            Pathway status or None if not found
        """
        return self.active_pathways.get(pathway_id)
