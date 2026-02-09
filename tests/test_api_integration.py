"""
360 Magicians System - API Integration Tests
Tests for the aggregator API endpoints
"""

import pytest
from httpx import AsyncClient, ASGITransport
from aggregator import app


class TestAggregatorAPI:
    """Integration tests for the Aggregator API"""
    
    @pytest.mark.asyncio
    async def test_docs_aggregate_endpoint_exists(self):
        """Test that the /docs/aggregate endpoint exists and responds"""
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.get("/docs/aggregate")
            # Should return 200 even if external services fail
            assert response.status_code == 200
    
    @pytest.mark.asyncio
    async def test_docs_aggregate_returns_dict(self):
        """Test that the /docs/aggregate endpoint returns a dictionary"""
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.get("/docs/aggregate")
            assert response.status_code == 200
            data = response.json()
            assert isinstance(data, dict), "Response should be a dictionary"
    
    @pytest.mark.asyncio
    async def test_docs_aggregate_has_service_keys(self):
        """Test that the response has expected service keys"""
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.get("/docs/aggregate")
            assert response.status_code == 200
            data = response.json()
            # Should have entries for DeafAuth and PinkSync
            assert "DeafAuth" in data, "Response should have DeafAuth key"
            assert "PinkSync" in data, "Response should have PinkSync key"
    
    @pytest.mark.asyncio
    async def test_openapi_schema_exists(self):
        """Test that OpenAPI schema is available"""
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.get("/openapi.json")
            assert response.status_code == 200
            data = response.json()
            assert "openapi" in data, "Should have OpenAPI version"
            assert "info" in data, "Should have info section"
