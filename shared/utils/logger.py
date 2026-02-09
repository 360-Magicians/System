"""Structured logging utility for the Magician system."""

import logging
import json
import sys
from datetime import datetime
from typing import Any, Dict, Optional


class StructuredLogger:
    """Structured logger for consistent logging across Magicians."""
    
    def __init__(self, node_id: str, level: str = "INFO"):
        """Initialize structured logger.
        
        Args:
            node_id: Identifier of the Magician node
            level: Logging level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
        """
        self.node_id = node_id
        self.logger = logging.getLogger(node_id)
        self.logger.setLevel(getattr(logging, level.upper()))
        
        # Remove existing handlers
        self.logger.handlers = []
        
        # Create console handler with structured format
        handler = logging.StreamHandler(sys.stdout)
        handler.setLevel(getattr(logging, level.upper()))
        
        # Use JSON formatter
        formatter = logging.Formatter('%(message)s')
        handler.setFormatter(formatter)
        
        self.logger.addHandler(handler)
    
    def _format_log(self, level: str, message: str, **kwargs: Any) -> str:
        """Format log message as JSON.
        
        Args:
            level: Log level
            message: Log message
            **kwargs: Additional fields
            
        Returns:
            JSON formatted log string
        """
        log_data = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": level,
            "node_id": self.node_id,
            "message": message,
        }
        log_data.update(kwargs)
        return json.dumps(log_data)
    
    def debug(self, message: str, **kwargs: Any) -> None:
        """Log debug message."""
        self.logger.debug(self._format_log("DEBUG", message, **kwargs))
    
    def info(self, message: str, **kwargs: Any) -> None:
        """Log info message."""
        self.logger.info(self._format_log("INFO", message, **kwargs))
    
    def warning(self, message: str, **kwargs: Any) -> None:
        """Log warning message."""
        self.logger.warning(self._format_log("WARNING", message, **kwargs))
    
    def error(self, message: str, **kwargs: Any) -> None:
        """Log error message."""
        self.logger.error(self._format_log("ERROR", message, **kwargs))
    
    def critical(self, message: str, **kwargs: Any) -> None:
        """Log critical message."""
        self.logger.critical(self._format_log("CRITICAL", message, **kwargs))
