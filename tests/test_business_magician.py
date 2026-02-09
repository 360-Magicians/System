"""Test file for Business Magician."""

import pytest
from magicians.business.service import BusinessMagician


def test_business_magician_initialization():
    """Test Business Magician initializes correctly."""
    magician = BusinessMagician()
    assert magician is not None
    assert magician.node_id == "business-magician-01"
    assert magician.status == "initialized"


def test_business_magician_initialize():
    """Test initialization with config."""
    magician = BusinessMagician()
    config = {"timeout": 300, "log_level": "INFO"}
    
    success = magician.initialize(config)
    assert success is True
    assert magician.status == "ready"


def test_validate_business_idea():
    """Test business idea validation."""
    magician = BusinessMagician()
    magician.initialize({})
    
    task = {
        "task_id": "test-001",
        "action": "validate-business-idea",
        "payload": {
            "idea": "ASL education platform for hearing parents",
            "target_market": "Hearing parents of Deaf children"
        }
    }
    
    result = magician.execute(task)
    
    assert result["status"] == "success"
    assert "validation_score" in result["result"]
    assert "feedback" in result["result"]


def test_create_business_plan():
    """Test business plan creation."""
    magician = BusinessMagician()
    magician.initialize({})
    
    task = {
        "task_id": "test-002",
        "action": "create-business-plan",
        "payload": {
            "business_name": "DeafFirst Solutions",
            "industry": "Technology"
        }
    }
    
    result = magician.execute(task)
    
    assert result["status"] == "success"
    assert "plan_outline" in result["result"]


def test_analyze_market():
    """Test market analysis."""
    magician = BusinessMagician()
    magician.initialize({})
    
    task = {
        "task_id": "test-003",
        "action": "analyze-market",
        "payload": {
            "industry": "accessibility"
        }
    }
    
    result = magician.execute(task)
    
    assert result["status"] == "success"
    assert "market_size" in result["result"]
    assert "opportunities" in result["result"]


def test_find_funding():
    """Test funding opportunities search."""
    magician = BusinessMagician()
    magician.initialize({})
    
    task = {
        "task_id": "test-004",
        "action": "find-funding",
        "payload": {
            "amount": 50000,
            "business_type": "startup"
        }
    }
    
    result = magician.execute(task)
    
    assert result["status"] == "success"
    assert "funding_options" in result["result"]


def test_healthcheck():
    """Test health check."""
    magician = BusinessMagician()
    magician.initialize({})
    
    health = magician.healthcheck()
    
    assert health["status"] == "healthy"
    assert "uptime" in health


def test_webhook_endpoint():
    """Test webhook endpoint."""
    magician = BusinessMagician()
    
    endpoint = magician.webhook_endpoint()
    assert endpoint is not None
    assert "webhook" in endpoint


def test_shutdown():
    """Test graceful shutdown."""
    magician = BusinessMagician()
    magician.initialize({})
    
    success = magician.shutdown()
    assert success is True
    assert magician.status == "shutdown"


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
