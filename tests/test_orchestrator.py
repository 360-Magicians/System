"""Test file for core orchestrator functionality."""

import pytest
from datetime import datetime
from shared.models import Task, MagicianType, TaskStatus
from core.orchestrator.service import MagicianOrchestrator


def test_orchestrator_initialization():
    """Test orchestrator initializes correctly."""
    orchestrator = MagicianOrchestrator()
    assert orchestrator is not None
    assert len(orchestrator.registered_nodes) == 0
    assert len(orchestrator.task_queue) == 0


def test_node_registration():
    """Test node registration."""
    orchestrator = MagicianOrchestrator()
    
    success = orchestrator.register_node(
        node_id="test-node-01",
        magician_type=MagicianType.BUSINESS,
        webhook_url="http://localhost:8001/webhook"
    )
    
    assert success is True
    assert len(orchestrator.registered_nodes) == 1
    assert "test-node-01" in orchestrator.registered_nodes


def test_node_unregistration():
    """Test node unregistration."""
    orchestrator = MagicianOrchestrator()
    
    orchestrator.register_node(
        node_id="test-node-01",
        magician_type=MagicianType.BUSINESS,
        webhook_url="http://localhost:8001/webhook"
    )
    
    success = orchestrator.unregister_node("test-node-01")
    assert success is True
    assert len(orchestrator.registered_nodes) == 0


def test_get_nodes_by_type():
    """Test getting nodes by type."""
    orchestrator = MagicianOrchestrator()
    
    orchestrator.register_node(
        node_id="business-01",
        magician_type=MagicianType.BUSINESS,
        webhook_url="http://localhost:8001/webhook"
    )
    
    orchestrator.register_node(
        node_id="job-01",
        magician_type=MagicianType.JOB,
        webhook_url="http://localhost:8002/webhook"
    )
    
    business_nodes = orchestrator.get_nodes_by_type(MagicianType.BUSINESS)
    assert len(business_nodes) == 1
    assert business_nodes[0]["node_id"] == "business-01"
    
    job_nodes = orchestrator.get_nodes_by_type(MagicianType.JOB)
    assert len(job_nodes) == 1


def test_task_submission():
    """Test task submission."""
    orchestrator = MagicianOrchestrator()
    
    task = Task(
        task_id="test-task-01",
        magician_type=MagicianType.BUSINESS,
        action="validate-business-idea",
        payload={"idea": "Test idea"}
    )
    
    task_id = orchestrator.submit_task(task)
    assert task_id == "test-task-01"
    assert len(orchestrator.task_queue) == 1


@pytest.mark.asyncio
async def test_task_execution():
    """Test task execution."""
    orchestrator = MagicianOrchestrator()
    
    # Register a node
    orchestrator.register_node(
        node_id="business-01",
        magician_type=MagicianType.BUSINESS,
        webhook_url="http://localhost:8001/webhook"
    )
    
    # Create task
    task = Task(
        task_id="test-task-01",
        magician_type=MagicianType.BUSINESS,
        action="validate-business-idea",
        payload={"idea": "Test idea"}
    )
    
    # Execute task
    result = await orchestrator.execute_task(task)
    
    assert result is not None
    assert result.task_id == "test-task-01"
    assert result.status == TaskStatus.SUCCESS


def test_healthcheck_nodes():
    """Test health check of nodes."""
    orchestrator = MagicianOrchestrator()
    
    orchestrator.register_node(
        node_id="business-01",
        magician_type=MagicianType.BUSINESS,
        webhook_url="http://localhost:8001/webhook"
    )
    
    health_checks = orchestrator.healthcheck_nodes()
    assert len(health_checks) == 1
    assert "business-01" in health_checks


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
