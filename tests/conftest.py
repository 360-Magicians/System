"""
360 Magicians System - Test Configuration
Pytest fixtures and configuration
"""

import pytest
import os
import sys

# Add the project root to the path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


@pytest.fixture(scope="session")
def project_root():
    """Return the project root directory"""
    return os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


@pytest.fixture(scope="session")
def mcp_config_dir(project_root):
    """Return the MCP configuration directory"""
    return os.path.join(project_root, "mcp-config")


@pytest.fixture(scope="session")
def github_workflows_dir(project_root):
    """Return the GitHub workflows directory"""
    return os.path.join(project_root, ".github", "workflows")
