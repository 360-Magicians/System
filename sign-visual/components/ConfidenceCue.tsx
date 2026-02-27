/**
 * ConfidenceCue - Visual representation of certainty/uncertainty/warning
 * 
 * Shows agent confidence level and contextual cues
 */

import React from 'react';

export interface ConfidenceCueProps {
  confidence: number; // 0-1
  showNumeric?: boolean;
}

const getConfidenceLevel = (confidence: number): {
  level: string;
  color: string;
  icon: string;
  description: string;
} => {
  if (confidence >= 0.9) {
    return {
      level: 'Very High',
      color: '#00cc66',
      icon: '💯',
      description: 'Agent is very confident'
    };
  } else if (confidence >= 0.7) {
    return {
      level: 'High',
      color: '#4eff9d',
      icon: '✓',
      description: 'Agent is confident'
    };
  } else if (confidence >= 0.5) {
    return {
      level: 'Moderate',
      color: '#ffdd4e',
      icon: '~',
      description: 'Agent has moderate confidence'
    };
  } else if (confidence >= 0.3) {
    return {
      level: 'Low',
      color: '#ff9d4e',
      icon: '⚠️',
      description: 'Agent has low confidence'
    };
  } else {
    return {
      level: 'Very Low',
      color: '#ff4e4e',
      icon: '❗',
      description: 'Agent is uncertain'
    };
  }
};

export const ConfidenceCue: React.FC<ConfidenceCueProps> = ({
  confidence,
  showNumeric = true
}) => {
  const { level, color, icon, description } = getConfidenceLevel(confidence);
  const percentage = Math.round(confidence * 100);

  return (
    <div
      className="confidence-cue"
      style={{
        padding: '12px',
        backgroundColor: '#2a2a2a',
        borderRadius: '6px',
        borderLeft: `3px solid ${color}`
      }}
      data-testid="confidence-cue"
      data-confidence={confidence}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '8px'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span style={{ fontSize: '20px' }} role="img" aria-label={level}>
            {icon}
          </span>
          <span
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: color
            }}
          >
            {level} Confidence
          </span>
        </div>
        {showNumeric && (
          <span
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: color
            }}
          >
            {percentage}%
          </span>
        )}
      </div>

      {/* Progress Bar */}
      <div
        style={{
          height: '6px',
          backgroundColor: '#1a1a1a',
          borderRadius: '3px',
          overflow: 'hidden',
          marginBottom: '8px'
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${percentage}%`,
            backgroundColor: color,
            transition: 'width 0.3s ease',
            borderRadius: '3px'
          }}
        />
      </div>

      {/* Description */}
      <div
        style={{
          fontSize: '12px',
          color: '#999'
        }}
      >
        {description}
      </div>
    </div>
  );
};
