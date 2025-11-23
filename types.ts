export enum ComponentType {
  USER_INTERFACE = 'USER_INTERFACE',
  BACKEND_API = 'BACKEND_API',
  AI_CORE = 'AI_CORE',
  AI_AGENT = 'AI_AGENT',
  DATABASE = 'DATABASE',
  MESSAGING = 'MESSAGING',
  ANALYTICS = 'ANALYTICS',
  ECOSYSTEM_SERVICE = 'ECOSYSTEM_SERVICE',
  ACCESSIBILITY = 'ACCESSIBILITY',
  ETHICS = 'ETHICS',
  EXTERNAL_API = 'EXTERNAL_API',
  GOVERNANCE = 'GOVERNANCE',
  INFRASTRUCTURE = 'INFRASTRUCTURE',
  MONITORING = 'MONITORING',
  AI_MODEL = 'AI_MODEL',
  AUTH_SERVICE = 'AUTH_SERVICE',
}

export type VerificationStatus = 'verified' | 'partial' | 'pending' | 'failed' | 'unverified';

export interface VerificationRequirement {
  description: string;
  status: 'verified' | 'pending' | 'failed';
}

export interface MetricDataPoint {
  time: string;
  value: number;
}

export interface NodeMetrics {
  latency?: string;
  errorRate?: string;
  cpu?: string;
  cost?: string;
  latencyHistory?: MetricDataPoint[];
  errorRateHistory?: MetricDataPoint[];
  cpuHistory?: MetricDataPoint[];
  costHistory?: MetricDataPoint[];
}

export interface ApiExample {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  requestPayload: object;
  responsePayload: object;
  schemaUrl?: string;
  documentationUrl?: string;
}

export interface FundingOpportunity {
  name: string;
  type: 'Grant' | 'Loan' | 'Investment' | 'DAO Treasury';
  amount: string;
  status: 'Matching' | 'Applied' | 'Secured';
  url: string;
}

export interface Node {
  id: string;
  name: string;
  label: string;
  labelDeaf: string;
  type: ComponentType;
  description: string;
  descriptionDeaf: string;
  position: { x: number; y: number; };
  status?: 'idle' | 'active' | 'warning' | 'error';
  equivalents?: {
    gcp?: string;
    aws?: string;
    azure?: string;
  };
  verification?: {
    status: VerificationStatus;
    lastChecked: string;
    requirements?: VerificationRequirement[];
  };
  metrics?: NodeMetrics;
  apiExample?: ApiExample;
  fundingOpportunities?: FundingOpportunity[];
}

export interface Edge {
  id:string;
  source: string;
  target: string;
}