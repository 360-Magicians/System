#!/usr/bin/env python3
"""
Integration test script for the 360 Magicians System.

This script demonstrates the core functionality of the distributed agent system
by starting services and executing sample pathways.
"""

import asyncio
import sys
from datetime import datetime

from core.orchestrator.service import MagicianOrchestrator
from core.pathway_engine.engine import PathwayEngine
from shared.models import Task, Pathway, PathwayStep, MagicianType
from shared.utils.logger import StructuredLogger

logger = StructuredLogger("integration-test")


async def test_basic_task_execution():
    """Test basic task execution."""
    logger.info("=== Test 1: Basic Task Execution ===")
    
    orchestrator = MagicianOrchestrator()
    
    # Register Business Magician node
    orchestrator.register_node(
        node_id="business-01",
        magician_type=MagicianType.BUSINESS,
        webhook_url="http://localhost:8001/webhook"
    )
    
    # Create and submit task
    task = Task(
        task_id="test-task-001",
        magician_type=MagicianType.BUSINESS,
        action="validate-business-idea",
        payload={
            "idea": "ASL-native customer service platform for Deaf-owned businesses",
            "target_market": "Deaf entrepreneurs and small businesses"
        }
    )
    
    # Execute task
    result = await orchestrator.execute_task(task)
    
    logger.info(
        "Task executed",
        task_id=result.task_id,
        status=result.status.value,
        duration_ms=result.duration_ms
    )
    
    if result.result:
        logger.info(
            "Validation result",
            score=result.result.get('validation_score'),
            feedback=result.result.get('feedback')
        )
    
    return result.status.value == "success"


async def test_pathway_execution():
    """Test multi-step pathway execution."""
    logger.info("=== Test 2: Pathway Execution ===")
    
    orchestrator = MagicianOrchestrator()
    pathway_engine = PathwayEngine(orchestrator)
    
    # Register multiple Magician nodes
    orchestrator.register_node(
        node_id="business-01",
        magician_type=MagicianType.BUSINESS,
        webhook_url="http://localhost:8001/webhook"
    )
    
    orchestrator.register_node(
        node_id="creative-01",
        magician_type=MagicianType.CREATIVE,
        webhook_url="http://localhost:8004/webhook"
    )
    
    # Create a simple pathway
    pathway = Pathway(
        pathway_id="test-pathway-001",
        name="Business Validation and Branding",
        steps=[
            PathwayStep(
                magician=MagicianType.BUSINESS,
                action="validate-business-idea",
                retry_count=2
            ),
            PathwayStep(
                magician=MagicianType.BUSINESS,
                action="analyze-market",
                retry_count=2
            )
        ],
        parallel=False
    )
    
    # Execute pathway
    initial_payload = {
        "idea": "Deaf-first video conferencing platform",
        "target_market": "Deaf professionals and businesses",
        "industry": "technology"
    }
    
    result = await pathway_engine.execute_pathway(pathway, initial_payload)
    
    logger.info(
        "Pathway executed",
        pathway_id=result["pathway_id"],
        status=result["status"],
        steps_completed=len(result.get("steps", []))
    )
    
    for idx, step in enumerate(result.get("steps", [])):
        logger.info(
            f"Step {idx + 1} result",
            magician=step.get("magician"),
            action=step.get("action"),
            status=step.get("status")
        )
    
    return result["status"] == "completed"


async def test_node_health_monitoring():
    """Test node health monitoring."""
    logger.info("=== Test 3: Health Monitoring ===")
    
    orchestrator = MagicianOrchestrator()
    
    # Register multiple nodes
    for magician_type in [MagicianType.BUSINESS, MagicianType.JOB, MagicianType.DEVELOPER]:
        orchestrator.register_node(
            node_id=f"{magician_type.value}-01",
            magician_type=magician_type,
            webhook_url=f"http://localhost:800{ord(magician_type.value[0]) % 10}/webhook"
        )
    
    # Check health
    health_checks = orchestrator.healthcheck_nodes()
    
    logger.info(f"Registered nodes: {len(health_checks)}")
    
    for node_id, health in health_checks.items():
        logger.info(
            "Node health",
            node_id=node_id,
            status=health.status.value,
            uptime_seconds=health.uptime_seconds
        )
    
    all_healthy = all(h.status.value == "healthy" for h in health_checks.values())
    return all_healthy


async def main():
    """Run all integration tests."""
    logger.info("Starting 360 Magicians System Integration Tests")
    logger.info(f"Timestamp: {datetime.utcnow().isoformat()}")
    logger.info("=" * 60)
    
    tests = [
        ("Basic Task Execution", test_basic_task_execution),
        ("Pathway Execution", test_pathway_execution),
        ("Health Monitoring", test_node_health_monitoring)
    ]
    
    results = []
    
    for test_name, test_func in tests:
        try:
            logger.info(f"Running test: {test_name}")
            result = await test_func()
            results.append((test_name, "PASSED" if result else "FAILED"))
            logger.info(f"Test result: {'PASSED' if result else 'FAILED'}")
        except Exception as e:
            logger.error(f"Test failed with exception", test_name=test_name, error=str(e))
            results.append((test_name, "ERROR"))
        
        logger.info("-" * 60)
    
    # Summary
    logger.info("=" * 60)
    logger.info("Test Summary")
    logger.info("=" * 60)
    
    for test_name, result in results:
        status_emoji = "✅" if result == "PASSED" else "❌"
        logger.info(f"{status_emoji} {test_name}: {result}")
    
    passed = sum(1 for _, r in results if r == "PASSED")
    total = len(results)
    
    logger.info(f"Tests passed: {passed}/{total}")
    
    return 0 if passed == total else 1


if __name__ == "__main__":
    exit_code = asyncio.run(main())
    sys.exit(exit_code)
