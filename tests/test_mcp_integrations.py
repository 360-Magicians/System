"""
360 Magicians System - Unit Tests
Tests for the aggregator API and MCP configurations
"""

import json
import pytest
from pathlib import Path


class TestMCPConfiguration:
    """Tests for MCP server configurations"""
    
    def test_mcp_servers_config_exists(self):
        """Verify MCP servers configuration file exists"""
        config_path = Path("mcp-config/mcp-servers.json")
        assert config_path.exists(), "MCP servers configuration file should exist"
    
    def test_mcp_servers_config_valid_json(self):
        """Verify MCP servers configuration is valid JSON"""
        config_path = Path("mcp-config/mcp-servers.json")
        with open(config_path) as f:
            config = json.load(f)
        assert "mcpServers" in config, "Configuration should have mcpServers key"
    
    def test_mcp_servers_has_required_servers(self):
        """Verify all required MCP servers are configured"""
        config_path = Path("mcp-config/mcp-servers.json")
        with open(config_path) as f:
            config = json.load(f)
        
        required_servers = ["github", "n8n", "context7", "playwright", "markitdown"]
        configured_servers = list(config["mcpServers"].keys())
        
        for server in required_servers:
            assert server in configured_servers, f"MCP server '{server}' should be configured"
    
    def test_mcp_server_has_command(self):
        """Verify each MCP server has a command defined"""
        config_path = Path("mcp-config/mcp-servers.json")
        with open(config_path) as f:
            config = json.load(f)
        
        for server_name, server_config in config["mcpServers"].items():
            assert "command" in server_config, f"Server '{server_name}' should have a command"
            assert "args" in server_config, f"Server '{server_name}' should have args"


class TestIntegrationsConfiguration:
    """Tests for integrations YAML configuration"""
    
    def test_integrations_config_exists(self):
        """Verify integrations configuration file exists"""
        config_path = Path("mcp-config/integrations.yaml")
        assert config_path.exists(), "Integrations configuration file should exist"
    
    def test_integrations_config_valid_yaml(self):
        """Verify integrations configuration is valid YAML"""
        import yaml
        config_path = Path("mcp-config/integrations.yaml")
        with open(config_path) as f:
            config = yaml.safe_load(f)
        assert "integrations" in config, "Configuration should have integrations key"
        assert "automation" in config, "Configuration should have automation key"
    
    def test_automation_features_enabled(self):
        """Verify automation features are configured"""
        import yaml
        config_path = Path("mcp-config/integrations.yaml")
        with open(config_path) as f:
            config = yaml.safe_load(f)
        
        automation = config["automation"]
        required_features = [
            "auto_test",
            "auto_devops",
            "auto_security",
            "auto_verification",
            "auto_support",
            "auto_updates"
        ]
        
        for feature in required_features:
            assert feature in automation, f"Automation feature '{feature}' should be configured"
            assert automation[feature]["enabled"], f"Automation feature '{feature}' should be enabled"


class TestGitHubWorkflows:
    """Tests for GitHub Actions workflows"""
    
    @pytest.fixture
    def workflows_dir(self):
        return Path(".github/workflows")
    
    def test_workflows_directory_exists(self, workflows_dir):
        """Verify workflows directory exists"""
        assert workflows_dir.exists(), "GitHub workflows directory should exist"
    
    def test_auto_test_workflow_exists(self, workflows_dir):
        """Verify auto-test workflow exists"""
        workflow = workflows_dir / "auto-test.yml"
        assert workflow.exists(), "Auto-test workflow should exist"
    
    def test_security_scan_workflow_exists(self, workflows_dir):
        """Verify security-scan workflow exists"""
        workflow = workflows_dir / "security-scan.yml"
        assert workflow.exists(), "Security-scan workflow should exist"
    
    def test_auto_devops_workflow_exists(self, workflows_dir):
        """Verify auto-devops workflow exists"""
        workflow = workflows_dir / "auto-devops.yml"
        assert workflow.exists(), "Auto-devops workflow should exist"
    
    def test_auto_updates_workflow_exists(self, workflows_dir):
        """Verify auto-updates workflow exists"""
        workflow = workflows_dir / "auto-updates.yml"
        assert workflow.exists(), "Auto-updates workflow should exist"
    
    def test_auto_verification_workflow_exists(self, workflows_dir):
        """Verify auto-verification workflow exists"""
        workflow = workflows_dir / "auto-verification.yml"
        assert workflow.exists(), "Auto-verification workflow should exist"
    
    def test_auto_support_workflow_exists(self, workflows_dir):
        """Verify auto-support workflow exists"""
        workflow = workflows_dir / "auto-support.yml"
        assert workflow.exists(), "Auto-support workflow should exist"


class TestDependabotConfiguration:
    """Tests for Dependabot configuration"""
    
    def test_dependabot_config_exists(self):
        """Verify Dependabot configuration exists"""
        config_path = Path(".github/dependabot.yml")
        assert config_path.exists(), "Dependabot configuration should exist"
    
    def test_dependabot_config_valid_yaml(self):
        """Verify Dependabot configuration is valid YAML"""
        import yaml
        config_path = Path(".github/dependabot.yml")
        with open(config_path) as f:
            config = yaml.safe_load(f)
        assert config["version"] == 2, "Dependabot version should be 2"
        assert "updates" in config, "Dependabot should have updates configured"


class TestAggregatorAPI:
    """Tests for the Aggregator FastAPI application"""
    
    def test_aggregator_file_exists(self):
        """Verify aggregator.py exists"""
        assert Path("aggregator.py").exists(), "aggregator.py should exist"
    
    def test_aggregator_imports_correctly(self):
        """Verify aggregator can be imported"""
        from aggregator import app
        assert app is not None, "FastAPI app should be importable"
    
    def test_aggregator_has_docs_endpoint(self):
        """Verify aggregator has /docs/aggregate endpoint"""
        from aggregator import app
        routes = [route.path for route in app.routes]
        assert "/docs/aggregate" in routes, "Aggregator should have /docs/aggregate endpoint"


class TestN8nWorkflowConfiguration:
    """Tests for n8n workflow configurations"""
    
    def test_n8n_workflows_config_exists(self):
        """Verify n8n workflows configuration exists"""
        config_path = Path("mcp-config/n8n-workflows.yaml")
        assert config_path.exists(), "n8n workflows configuration should exist"
    
    def test_n8n_workflows_valid_yaml(self):
        """Verify n8n workflows configuration is valid YAML"""
        import yaml
        config_path = Path("mcp-config/n8n-workflows.yaml")
        with open(config_path) as f:
            config = yaml.safe_load(f)
        assert "workflows" in config, "Configuration should have workflows key"
    
    def test_n8n_has_required_workflows(self):
        """Verify required n8n workflows are defined"""
        import yaml
        config_path = Path("mcp-config/n8n-workflows.yaml")
        with open(config_path) as f:
            config = yaml.safe_load(f)
        
        required_workflows = ["ai-code-review", "issue-triage", "deployment-pipeline"]
        configured_workflows = list(config["workflows"].keys())
        
        for workflow in required_workflows:
            assert workflow in configured_workflows, f"Workflow '{workflow}' should be configured"


class TestPlaywrightConfiguration:
    """Tests for Playwright configuration"""
    
    def test_playwright_config_exists(self):
        """Verify Playwright configuration exists"""
        config_path = Path("mcp-config/playwright-config.yaml")
        assert config_path.exists(), "Playwright configuration should exist"
    
    def test_playwright_config_valid_yaml(self):
        """Verify Playwright configuration is valid YAML"""
        import yaml
        config_path = Path("mcp-config/playwright-config.yaml")
        with open(config_path) as f:
            config = yaml.safe_load(f)
        assert "browsers" in config, "Configuration should have browsers key"
        assert "testing" in config, "Configuration should have testing key"
    
    def test_playwright_accessibility_testing_enabled(self):
        """Verify accessibility testing is enabled"""
        import yaml
        config_path = Path("mcp-config/playwright-config.yaml")
        with open(config_path) as f:
            config = yaml.safe_load(f)
        
        assert config["testing"]["accessibility"]["enabled"], "Accessibility testing should be enabled"
