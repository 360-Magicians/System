/**
 * useIntentMap - React hook for mapping user intents to sign semantics
 * 
 * Loads and provides intent to sign mappings
 */

import { useState, useEffect } from 'react';
import intentMapData from '../../../sign-visual/semantics/intent.map.json';
import systemMapData from '../../../sign-visual/semantics/system.map.json';

export interface IntentMapping {
  signGloss: string;
  semanticChunks: string[];
  confidence: number;
}

export interface SystemMapping {
  signGloss: string;
  semanticChunks: string[];
  visualPriority: string;
}

export interface UseIntentMapReturn {
  getIntentMapping: (intent: string) => IntentMapping | null;
  getSystemMapping: (action: string) => SystemMapping | null;
  intentMap: Record<string, IntentMapping>;
  systemMap: Record<string, SystemMapping>;
}

export const useIntentMap = (): UseIntentMapReturn => {
  const [intentMap] = useState<Record<string, IntentMapping>>(
    intentMapData.mappings as Record<string, IntentMapping>
  );
  
  const [systemMap] = useState<Record<string, SystemMapping>>(
    systemMapData.mappings as Record<string, SystemMapping>
  );

  const getIntentMapping = (intent: string): IntentMapping | null => {
    return intentMap[intent] || null;
  };

  const getSystemMapping = (action: string): SystemMapping | null => {
    return systemMap[action] || null;
  };

  return {
    getIntentMapping,
    getSystemMapping,
    intentMap,
    systemMap
  };
};
