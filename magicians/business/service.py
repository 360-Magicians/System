"""Business Magician - Business operations, formation, strategy, and analytics.

This Magician specializes in business-related tasks including:
- Business formation and registration
- Business strategy and planning
- Financial analytics
- Market research
- Funding assistance
"""

from typing import Dict, Any, Optional
from datetime import datetime, timedelta
from fastapi import FastAPI, HTTPException
from shared.interfaces.magician_base import MagicianNode
from shared.models import Task, TaskResult, TaskStatus, HealthStatus, WebhookEvent
from shared.utils.logger import StructuredLogger
from shared.utils.config import ConfigManager


class BusinessMagician(MagicianNode):
    """Business Magician implementation."""
    
    def __init__(self, node_id: str = "business-magician-01", config: Optional[Dict[str, Any]] = None):
        """Initialize Business Magician.
        
        Args:
            node_id: Unique identifier for this instance
            config: Optional configuration
        """
        super().__init__(node_id, config)
        self.logger = StructuredLogger(node_id)
        self.config_manager = ConfigManager()
        self._webhook_url = self.config_manager.get('webhook.url', f'http://localhost:8001/webhook')
        self.tasks_executed = 0
        self.last_task_time: Optional[datetime] = None
        
        self.logger.info("Business Magician initialized", node_id=node_id)
    
    def initialize(self, config: Dict[str, Any]) -> bool:
        """Initialize with configuration.
        
        Args:
            config: Configuration dictionary
            
        Returns:
            True if successful
        """
        try:
            self.config.update(config)
            self.status = "ready"
            self.logger.info("Business Magician configuration applied")
            return True
        except Exception as e:
            self.logger.error(f"Initialization failed: {str(e)}")
            return False
    
    def execute(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Execute a business task.
        
        Args:
            task: Task dictionary with action and payload
            
        Returns:
            Execution result
        """
        start_time = datetime.utcnow()
        task_id = task.get('task_id', 'unknown')
        action = task.get('action', '')
        payload = task.get('payload', {})
        
        self.logger.info(
            f"Executing task: {action}",
            task_id=task_id,
            action=action
        )
        
        try:
            # Route to appropriate handler
            if action == 'validate-business-idea':
                result = self._validate_business_idea(payload)
            elif action == 'create-business-plan':
                result = self._create_business_plan(payload)
            elif action == 'analyze-market':
                result = self._analyze_market(payload)
            elif action == 'find-funding':
                result = self._find_funding(payload)
            elif action == 'register-business':
                result = self._register_business(payload)
            else:
                raise ValueError(f"Unknown action: {action}")
            
            self.tasks_executed += 1
            self.last_task_time = datetime.utcnow()
            
            duration_ms = int((datetime.utcnow() - start_time).total_seconds() * 1000)
            
            self.logger.info(
                f"Task completed successfully",
                task_id=task_id,
                duration_ms=duration_ms
            )
            
            return {
                'task_id': task_id,
                'status': 'success',
                'result': result,
                'duration_ms': duration_ms
            }
            
        except Exception as e:
            self.logger.error(
                f"Task execution failed",
                task_id=task_id,
                error=str(e)
            )
            
            return {
                'task_id': task_id,
                'status': 'failure',
                'error': str(e)
            }
    
    def _validate_business_idea(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Validate a business idea.
        
        Args:
            payload: Business idea details
            
        Returns:
            Validation result
        """
        idea = payload.get('idea', '')
        target_market = payload.get('target_market', '')
        
        # Simplified validation logic
        validation_score = 0.0
        feedback = []
        
        if len(idea) > 50:
            validation_score += 0.3
            feedback.append("Idea is well-described")
        else:
            feedback.append("Idea needs more detail")
        
        if target_market:
            validation_score += 0.3
            feedback.append("Target market identified")
        else:
            feedback.append("Target market needs definition")
        
        # Check for accessibility focus
        if any(keyword in idea.lower() for keyword in ['deaf', 'asl', 'accessibility', 'inclusive']):
            validation_score += 0.4
            feedback.append("Excellent focus on accessibility and Deaf community")
        
        return {
            'validation_score': min(validation_score, 1.0),
            'feedback': feedback,
            'recommended_next_steps': [
                'Create detailed business plan',
                'Conduct market research',
                'Identify funding sources'
            ]
        }
    
    def _create_business_plan(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Create a business plan.
        
        Args:
            payload: Business details
            
        Returns:
            Business plan outline
        """
        return {
            'plan_outline': {
                'executive_summary': 'Generated summary',
                'market_analysis': 'Market research findings',
                'financial_projections': {
                    'year_1_revenue': 100000,
                    'year_1_expenses': 80000,
                    'break_even_month': 8
                },
                'marketing_strategy': 'Target Deaf community first',
                'operations_plan': 'ASL-first customer service'
            }
        }
    
    def _analyze_market(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze market for business opportunity.
        
        Args:
            payload: Market analysis parameters
            
        Returns:
            Market analysis results
        """
        industry = payload.get('industry', 'general')
        
        return {
            'market_size': 'Growing',
            'competition_level': 'Moderate',
            'opportunities': [
                'Untapped Deaf market segment',
                'ASL-native services gap',
                'Accessibility consulting demand'
            ],
            'threats': [
                'Limited awareness',
                'Funding challenges'
            ],
            'recommendations': [
                'Focus on Deaf-first approach',
                'Build community partnerships',
                'Leverage accessibility standards'
            ]
        }
    
    def _find_funding(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Find funding opportunities.
        
        Args:
            payload: Business funding requirements
            
        Returns:
            Funding opportunities
        """
        amount_needed = payload.get('amount', 0)
        business_type = payload.get('business_type', '')
        
        return {
            'funding_options': [
                {
                    'source': 'SBA Microloan Program',
                    'amount_range': '0-50000',
                    'type': 'loan',
                    'application_url': 'https://sba.gov'
                },
                {
                    'source': 'Access Ventures Deaf Entrepreneur Grant',
                    'amount_range': '10000-25000',
                    'type': 'grant',
                    'application_url': 'https://example.com/deaf-grants'
                },
                {
                    'source': 'Community Development Financial Institutions',
                    'amount_range': '5000-100000',
                    'type': 'loan',
                    'application_url': 'https://example.com/cdfi'
                }
            ],
            'total_available': 175000
        }
    
    def _register_business(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Assist with business registration.
        
        Args:
            payload: Business registration details
            
        Returns:
            Registration guidance
        """
        state = payload.get('state', '')
        business_name = payload.get('business_name', '')
        
        return {
            'registration_steps': [
                'Choose business structure (LLC, Corporation, etc.)',
                'Register with state',
                'Obtain EIN from IRS',
                'Register for state taxes',
                'Obtain necessary licenses and permits'
            ],
            'estimated_cost': 500,
            'estimated_time_days': 14,
            'next_action': 'Complete business structure selection'
        }
    
    def webhook_endpoint(self) -> str:
        """Get webhook endpoint URL.
        
        Returns:
            Webhook URL
        """
        return self._webhook_url
    
    def healthcheck(self) -> Dict[str, Any]:
        """Perform health check.
        
        Returns:
            Health status
        """
        uptime = (datetime.utcnow() - self.created_at).total_seconds()
        
        # Determine health status
        if self.status == "ready":
            health_status = HealthStatus.HEALTHY
        elif self.status == "initialized":
            health_status = HealthStatus.DEGRADED
        else:
            health_status = HealthStatus.UNHEALTHY
        
        return {
            'status': health_status.value,
            'uptime': uptime,
            'tasks_executed': self.tasks_executed,
            'last_task_time': self.last_task_time.isoformat() if self.last_task_time else None,
            'metrics': {
                'tasks_per_minute': self.tasks_executed / (uptime / 60) if uptime > 0 else 0
            }
        }
    
    def shutdown(self) -> bool:
        """Gracefully shutdown.
        
        Returns:
            True if successful
        """
        self.logger.info("Business Magician shutting down")
        self.status = "shutdown"
        return True


# FastAPI application for Business Magician
app = FastAPI(
    title="Business Magician",
    description="Business operations, formation, strategy, and analytics",
    version="1.0.0"
)

magician = BusinessMagician()


@app.post("/webhook")
async def webhook(event: Dict[str, Any]):
    """Webhook endpoint for receiving tasks."""
    result = magician.execute(event)
    return result


@app.get("/health")
async def health():
    """Health check endpoint."""
    return magician.healthcheck()


@app.post("/initialize")
async def initialize(config: Dict[str, Any]):
    """Initialize magician with configuration."""
    success = magician.initialize(config)
    if success:
        return {"status": "initialized"}
    else:
        raise HTTPException(status_code=500, detail="Initialization failed")


@app.post("/shutdown")
async def shutdown():
    """Shutdown endpoint."""
    success = magician.shutdown()
    if success:
        return {"status": "shutdown"}
    else:
        raise HTTPException(status_code=500, detail="Shutdown failed")
