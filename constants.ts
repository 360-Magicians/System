import { Node, Edge, ComponentType } from './types';

export const NODE_WIDTH = 240;
export const NODE_HEIGHT = 100;
export const AUDIO_EXPLANATION_URL = 'https://storage.googleapis.com/magicians-deaf-first-assets/system-explanation.mp3';

export const NODES: Node[] = [
  // User Interaction Layer (Y = 100)
  {
    id: 'ui-web-mobile', name: 'Web & Mobile UI', label: 'Next.js / Flutter', labelDeaf: 'SEE / TOUCH APP', type: ComponentType.USER_INTERFACE,
    description: 'Your window to opportunity. A clean, beautiful, and accessible space designed for your journey, on any device.',
    descriptionDeaf: 'YOUR SCREEN. YOUR JOURNEY. EASY SEE, EASY USE.',
    position: { x: 780, y: 100 },
    verification: { status: 'verified', lastChecked: '2 min ago' }
  },
  // Gateway Layer (Y = 250)
  {
    id: 'ai-local-offline',
    name: 'LocalMagician',
    label: 'On-Device AI Engine',
    labelDeaf: 'PHONE AI-WORKER',
    type: ComponentType.AI_MODEL,
    description: "The silent sorcerer in your pocket. This on-device AI provides instant, offline magic for essential tasks like quick translations or UI guidance, ensuring support is always at hand, connected or not.",
    descriptionDeaf: "YOUR-POCKET-WIZARD. AI ON PHONE, WORKS NO-INTERNET. INSTANT-MAGIC ALWAYS.",
    position: { x: 180, y: 250 },
    status: 'active',
    equivalents: { gcp: 'TensorFlow Lite', aws: 'SageMaker Edge', azure: 'Azure Percept' },
  },
  {
    id: 'svc-deafauth', name: 'DeafAuth Gateway', label: 'Identity Provider (IdP)', labelDeaf: 'LOGIN SAFE', type: ComponentType.AUTH_SERVICE,
    description: 'Your personal key to this world. Acts as the central Identity Provider (IdP), managing user profiles and validating short-lived access tokens for all backend services to enforce zero-trust security.',
    descriptionDeaf: 'YOUR KEY. SAFE, FAST. PROVES WHO-YOU-ARE.',
    position: { x: 780, y: 250 },
    equivalents: { gcp: 'Identity Platform / IAM', aws: 'Cognito / IAM', azure: 'Entra ID (Azure AD B2C)' }, status: 'idle',
  },
  {
    id: 'svc-pinksync', name: 'PinkSync', label: 'Multimodal Accessibility Hub', labelDeaf: 'VIDEO-TEXT-VOICE-ASL HUB', type: ComponentType.ACCESSIBILITY,
    description: 'The heart of our communication. Where every voice, sign, and text is understood, ensuring no one is left out of the conversation.',
    descriptionDeaf: 'OUR HEART. SIGN, VOICE, TEXT BECOME ONE. ALL-TOGETHER NOW.',
    position: { x: 480, y: 250 },
    equivalents: { gcp: 'Workflows + Video AI', aws: 'Step Functions + Rekognition', azure: 'Logic Apps + Video Analyzer' },
  },
  {
    id: 'svc-fibonrose', name: 'FibonRose', label: 'Ethics & Trust Engine', labelDeaf: 'AI FAIR? TRUST', type: ComponentType.ETHICS,
    description: 'Our promise of fairness. An ethical compass ensuring every AI acts with integrity, so you can trust the guidance you receive.',
    descriptionDeaf: 'OUR PROMISE. AI MUST BE FAIR. EARN YOUR TRUST.',
    position: { x: 1080, y: 250 },
  },
  // API Layer (Y = 400)
  {
    id: 'api-creative', name: 'CreativeMagician API', label: 'Creativity & Arts Gateway', labelDeaf: 'MANAGE ART IDEA', type: ComponentType.BACKEND_API,
    description: 'The gateway to your artistry. Manages the journey of your creative spark, from a simple idea to a celebrated masterpiece.',
    descriptionDeaf: 'YOUR ART-GATEWAY. IDEA BECOME REAL. SELL YOUR PASSION.',
    position: { x: 330, y: 400 },
    equivalents: { gcp: 'Cloud Run / API Gateway', aws: 'Lambda / API Gateway', azure: 'Functions / API Management' }, 
    metrics: { 
      latency: '120ms', errorRate: '0.1%',
      latencyHistory: [ { time: '12:00', value: 115 }, { time: '12:05', value: 121 }, { time: '12:10', value: 119 }, { time: '12:15', value: 125 }, { time: '12:20', value: 120 } ],
      errorRateHistory: [ { time: 'Day 1', value: 0.12 }, { time: 'Day 2', value: 0.1 }, { time: 'Day 3', value: 0.11 }, { time: 'Day 4', value: 0.09 }, { time: 'Day 5', value: 0.1 } ],
    },
    apiExample: {
        endpoint: '/projects/{projectId}/feedback',
        method: 'POST',
        requestPayload: { assetId: 'asset-sb-001', feedbackType: 'composition' },
        responsePayload: { feedback: "Strong composition in panel 3. Consider increasing the contrast in panel 1...", sentiment: 'Positive' },
        schemaUrl: '#',
        documentationUrl: '#',
    }
  },
  {
    id: 'api-business', name: 'BusinessMagician API', label: 'Entrepreneurship Gateway', labelDeaf: 'MANAGE BUSINESS IDEA', type: ComponentType.BACKEND_API,
    description: 'The portal for entrepreneurs. Manages the lifecycle of a business idea, from validation and risk assessment to generating a full MVP roadmap.',
    descriptionDeaf: 'YOUR BUSINESS-GATEWAY. IDEA TO PLAN. MANAGE YOUR DREAM.',
    position: { x: 630, y: 400 },
    equivalents: { gcp: 'Cloud Run / API Gateway', aws: 'Lambda / API Gateway', azure: 'Functions / API Management' },
    fundingOpportunities: [
        { name: 'Deaf-Led Innovation Grant', type: 'Grant', amount: '$25,000', status: 'Matching', url: '#' },
        { name: 'SBA Microloan Program', type: 'Loan', amount: 'Up to $50,000', status: 'Applied', url: '#' },
    ]
  },
  {
    id: 'api-job', name: 'JobMagician API', label: 'Employment Gateway', labelDeaf: 'MANAGE JOB SEARCH', type: ComponentType.BACKEND_API,
    description: 'Your bridge to a new career. Manages job searches, resume parsing, skill matching, and interview scheduling to connect you with inclusive employers.',
    descriptionDeaf: 'YOUR CAREER-BRIDGE. FIND-JOB, FIX-RESUME, GET-INTERVIEW.',
    position: { x: 930, y: 400 },
    equivalents: { gcp: 'Cloud Run / API Gateway', aws: 'Lambda / API Gateway', azure: 'Functions / API Management' },
    verification: { 
        status: 'partial', 
        lastChecked: '8 hours ago',
        requirements: [
            { description: 'WCAG 2.1 AA Compliance', status: 'verified' },
            { description: 'Fair Hiring Practices Audit', status: 'pending' },
            { description: 'Data Privacy (GDPR/CCPA)', status: 'verified' },
        ]
    }
  },
  {
    id: 'api-developer', name: 'DeveloperMagician API', label: 'Developer & Sandbox Gateway', labelDeaf: 'MANAGE CODE-PLAYGROUND', type: ComponentType.BACKEND_API,
    description: "The developer's command center. Manages sandbox environments, API key generation, and provides access to system logs for building and testing new integrations.",
    descriptionDeaf: "YOUR CODE-CENTER. GET-API-KEY. TEST YOUR-IDEAS.",
    position: { x: 1230, y: 400 }, status: 'active',
    equivalents: { gcp: 'Cloud Run / API Gateway', aws: 'Lambda / API Gateway', azure: 'Functions / API Management' },
    metrics: { cpu: '91%', cost: '$1,250' },
    apiExample: {
      endpoint: '/system/nodes',
      method: 'GET',
      requestPayload: {},
      responsePayload: [
          {
              "id": "ui-web-mobile",
              "name": "Web & Mobile UI",
              "type": "USER_INTERFACE",
              "...": "..."
          },
      ],
      schemaUrl: '#',
      documentationUrl: '#',
    }
  },
  // AI Core Layer (Y = 550)
  {
    id: 'ai-core-orchestrator', name: 'MagicianCore', label: 'AI Agent Orchestrator', labelDeaf: 'AI-TEAM LEADER', type: ComponentType.AI_CORE,
    description: "The Grand Conductor of our magical orchestra. MagicianCore is the central intelligence that interprets your goals, then summons and directs the perfect ensemble of specialized AI agents to make your vision a reality. It's the silent, powerful force ensuring every spell is cast flawlessly.",
    descriptionDeaf: "THE-MASTER-CONDUCTOR. UNDERSTANDS YOUR-GOAL. SUMMONS-LEADS AI-TEAM. PERFECT-MAGIC EVERY-TIME.",
    position: { x: 780, y: 550 },
    equivalents: { gcp: 'Workflows', aws: 'Step Functions', azure: 'Logic Apps' },
  },
  // AI Agent Layer (Y = 700)
  {
    id: 'agent-idea', name: 'IdeaMagician', label: 'Idea Validation Agent', labelDeaf: 'AI-HELPER IDEA', type: ComponentType.AI_AGENT,
    description: "Your personal muse for innovation. This creative AI partner helps you conjure, refine, and validate brilliant ideas. It acts as a sounding board, a market analyst, and a co-writer, turning a fleeting spark of inspiration into a solid, actionable concept.",
    descriptionDeaf: "YOUR-MUSE. HELPS-YOU CREATE, REFINE, VALIDATE IDEAS. SPARK BECOME REAL.",
    position: { x: 30, y: 700 }, status: 'idle',
  },
  {
    id: 'agent-builder', name: 'BuilderMagician', label: 'Roadmap Generation Agent', labelDeaf: 'AI-HELPER BUILD', type: ComponentType.AI_AGENT,
    description: "The master architect for your dreams. This AI agent transforms your validated idea into a tangible blueprint, generating step-by-step roadmaps, technical plans, and resource lists to guide you through the construction of your project or MVP.",
    descriptionDeaf: "THE-ARCHITECT. IDEA BECOME BLUEPRINT. GIVES-YOU STEP-BY-STEP PLAN TO-BUILD.",
    position: { x: 280, y: 700 }, status: 'idle',
  },
  {
    id: 'agent-funding', name: 'FundingMagician', label: 'Funding Opportunity Agent', labelDeaf: 'AI-HELPER MONEY', type: ComponentType.AI_AGENT,
    description: "Your mystical treasurer, skilled in the art of alchemy. This AI agent scours the financial world to uncover hidden grants, loans, and investors perfectly matched to your project, helping you turn your vision into gold.",
    descriptionDeaf: "THE-TREASURER. FINDS-MONEY-OPPORTUNITIES. GRANTS, LOANS. HELPS-YOU GET-FUNDING.",
    position: { x: 530, y: 700 }, status: 'active',
  },
  {
    id: 'agent-growth', name: 'GrowthMagician', label: 'Marketing Strategy Agent', labelDeaf: 'AI-HELPER GROW', type: ComponentType.AI_AGENT,
    description: "Your enchanted megaphone to the world. This AI strategist crafts compelling marketing spells, identifies your true audience, and reveals secret growth pathways to help your creation flourish and find its community.",
    descriptionDeaf: "YOUR-MEGAPHONE. FINDS-YOUR-AUDIENCE. CREATES-MARKETING-PLAN. HELPS-BUSINESS-GROW.",
    position: { x: 780, y: 700 }, status: 'idle',
  },
  {
    id: 'agent-job', name: 'JobMagician', label: 'Career Matching Agent', labelDeaf: 'AI-HELPER JOB', type: ComponentType.AI_AGENT,
    description: "Your career oracle and guide. This AI mentor illuminates your professional path by finding ideal job openings, magically tailoring your resume to each opportunity, and preparing you with the wisdom to ace any interview.",
    descriptionDeaf: "YOUR-CAREER-GUIDE. FINDS-PERFECT-JOB. FIXES-YOUR-RESUME. PREPARES-YOU-FOR-INTERVIEW.",
    position: { x: 1030, y: 700 }, status: 'warning',
  },
  {
    id: 'agent-creative', name: 'CreativeMagician', label: 'Creative Feedback Agent', labelDeaf: 'AI-HELPER ART', type: ComponentType.AI_AGENT,
    description: "Your tireless artistic collaborator. This AI familiar assists in the creative process, from conjuring stunning visual concepts and drafting compelling narratives to offering insightful feedback on your masterpieces.",
    descriptionDeaf: "YOUR-ART-PARTNER. HELPS-CREATE-ART, STORIES. GIVES-FEEDBACK. MAKES-ART-BETTER.",
    position: { x: 1280, y: 700 },
  },
  {
    id: 'agent-developer', name: 'DeveloperMagician', label: 'Code & API Assistant Agent', labelDeaf: 'AI-HELPER CODE', type: ComponentType.AI_AGENT,
    description: "The coder's familiar, whispering secrets of the craft. This AI provides powerful assistance by generating elegant code, hunting down elusive bugs, clarifying cryptic APIs, and rapidly scaffolding new services for your projects.",
    descriptionDeaf: "CODE-PARTNER. WRITES-CODE-FOR-YOU. FINDS-BUGS. EXPLAINS-APIS. BUILDS-FAST.",
    position: { x: 1530, y: 700 },
  },
  // Data & Intelligence Layer (Y = 850 / 1000)
  {
    id: 'db-operational', name: 'Operational DB', label: 'Supabase (Postgres)', labelDeaf: 'MAIN-DATABASE', type: ComponentType.DATABASE,
    description: 'The primary database for storing all application data, including user profiles, projects, and job listings. Provides a reliable and scalable foundation.',
    descriptionDeaf: 'ALL-DATA-STORED-HERE. USER, PROJECT, JOB-INFO.',
    position: { x: 30, y: 850 },
    equivalents: { gcp: 'Cloud SQL', aws: 'RDS / Aurora', azure: 'Azure SQL' },
  },
  {
    id: 'bus-events', name: 'Event Bus', label: 'Syix (Kafka)', labelDeaf: 'MESSAGE-HIGHWAY', type: ComponentType.MESSAGING,
    description: 'The central message bus for the entire system. Enables asynchronous communication between microservices, ensuring loose coupling and scalability.',
    descriptionDeaf: 'SERVICES-TALK-HERE. FAST, NO-WAITING. SYSTEM-STAYS-STRONG.',
    position: { x: 280, y: 850 },
    equivalents: { gcp: 'Pub/Sub', aws: 'SNS/SQS', azure: 'Event Grid' },
  },
  {
    id: 'cache-session', name: 'Session Cache', label: 'Upstash (Redis)', labelDeaf: 'FAST-MEMORY', type: ComponentType.DATABASE,
    description: 'An in-memory data store used for caching frequently accessed data and managing user session information, ensuring high performance and responsiveness.',
    descriptionDeaf: 'KEEPS-DATA-CLOSE. MAKES-APP-FAST. REMEMBERS-YOU.',
    position: { x: 530, y: 850 },
    equivalents: { gcp: 'Memorystore', aws: 'ElastiCache', azure: 'Azure Cache for Redis' },
  },
  {
    id: 'analytics-warehouse', name: 'Analytics Warehouse', label: 'BigQuery', labelDeaf: 'BIG-DATA-LIBRARY', type: ComponentType.ANALYTICS,
    description: 'A powerful data warehouse for storing and analyzing large volumes of event data. Powers dashboards, generates business insights, and informs strategic decisions.',
    descriptionDeaf: 'ALL-EVENT-DATA-HERE. WE-LEARN, IMPROVE. SEE-THE-BIG-PICTURE.',
    position: { x: 1030, y: 850 },
    equivalents: { gcp: 'BigQuery', aws: 'Redshift', azure: 'Synapse Analytics' },
  },
  {
    id: 'infra-hosting', name: 'Container Hosting', label: 'Google Kubernetes Engine', labelDeaf: 'APP-HOME', type: ComponentType.INFRASTRUCTURE,
    description: 'The underlying infrastructure for running all containerized applications and services, providing automated deployment, scaling, and management.',
    descriptionDeaf: 'WHERE-ALL-SERVICES-LIVE. KEEPS-THEM-RUNNING, STRONG.',
    position: { x: 30, y: 1000 },
    equivalents: { gcp: 'GKE', aws: 'EKS', azure: 'AKS' },
  },
  {
    id: 'infra-source', name: 'Source Control', label: 'GitLab', labelDeaf: 'CODE-LIBRARY', type: ComponentType.INFRASTRUCTURE,
    description: 'The single source of truth for all application code, infrastructure definitions, and CI/CD pipelines. The foundation of our development and deployment process.',
    descriptionDeaf: 'ALL-CODE-SAVED-HERE. SAFE, ORGANIZED.',
    position: { x: 280, y: 1000 },
  },
  {
    id: 'infra-models', name: 'AI Model Hosting', label: 'Vertex AI', labelDeaf: 'AI-MODEL-HOME', type: ComponentType.INFRASTRUCTURE,
    description: 'The grand library of enchantments. This managed platform is where our powerful AI models are stored, served, and monitored, ensuring they are always available, fast, and reliable for the Magician agents to call upon.',
    descriptionDeaf: 'THE-MAGIC-LIBRARY. WHERE-AI-MODELS-LIVE. FAST, RELIABLE, ALWAYS-READY.',
    position: { x: 780, y: 850 },
    equivalents: { gcp: 'Vertex AI', aws: 'SageMaker', azure: 'Azure Machine Learning' },
  },
  {
    id: 'monitoring-platform', name: 'Monitoring & Alerting', label: 'Datadog', labelDeaf: 'SYSTEM-DOCTOR', type: ComponentType.MONITORING,
    description: 'A unified observability platform that collects logs, metrics, and traces from all services. Provides real-time insights into system health and alerts on potential issues.',
    descriptionDeaf: 'WATCHES-EVERYTHING. IF-PROBLEM, TELLS-US-FAST.',
    position: { x: 530, y: 1000 },
  },
  {
    id: 'gov-dao', name: 'Community Governance', label: 'Aragon DAO', labelDeaf: 'COMMUNITY-VOTE', type: ComponentType.GOVERNANCE,
    description: 'A decentralized autonomous organization (DAO) that allows community members to vote on proposals, manage treasury funds, and shape the future of the ecosystem.',
    descriptionDeaf: 'COMMUNITY-HAS-POWER. VOTE, DECIDE-FUTURE.',
    position: { x: 1530, y: 850 }, status: 'error',
  },
  // External APIs & Models Layer (Y = 1150)
  {
    id: 'cli-pinkflow',
    name: 'PinkFlow CLI',
    label: 'IaC & Automation CLI',
    labelDeaf: 'CODE-MAKE-SYSTEM-CLI',
    type: ComponentType.INFRASTRUCTURE,
    description: "The Magician's wand. A powerful command-line interface that automates the entire system's lifecycle. PinkFlow handles infrastructure provisioning (via IaC), policy enforcement, security scanning, and orchestrates complex deployment plans, turning architectural blueprints into reality with a single command.",
    descriptionDeaf: "THE-MAGIC-WAND. ONE-COMMAND, BUILD-EVERYTHING. MAKES-SYSTEM-FROM-CODE. SAFE, FAST, AUTOMATIC.",
    position: { x: 280, y: 1150 },
    equivalents: { gcp: 'gcloud CLI + Terraform', aws: 'AWS CLI + CloudFormation', azure: 'Azure CLI + Bicep' },
  },
  {
    id: 'api-federal', name: 'Federal & State APIs', label: 'Public Data Sources', labelDeaf: 'GOVERNMENT-DATA', type: ComponentType.EXTERNAL_API,
    description: 'Integrations with public APIs from government bodies to access data on business registration, grants, and compliance requirements.',
    descriptionDeaf: 'CONNECTS-TO-GOVERNMENT. GETS-RULES, DATA.',
    position: { x: 1280, y: 1150 },
  },
  {
    id: 'api-state', name: 'Banking & Financial APIs', label: 'Plaid / Stripe', labelDeaf: 'MONEY-DATA', type: ComponentType.EXTERNAL_API,
    description: 'Secure integrations with financial service providers to handle payments, connect bank accounts, and verify financial information.',
    descriptionDeaf: 'CONNECTS-TO-BANKS. SAFE, SECURE.',
    position: { x: 1530, y: 1150 },
  },
  // Foundational Models (Y = 1000, under AI Model Hosting)
  {
    id: 'model-stt', name: 'Speech-to-Text Model', label: 'Foundation Model', labelDeaf: 'MODEL VOICE-TO-TEXT', type: ComponentType.AI_MODEL,
    description: "The Scribe of the Air. This foundational spell captures spoken words and instantly transforms them into written text, enabling real-time captioning and understanding voice commands with magical precision.",
    descriptionDeaf: "LISTENS-TO-VOICE. WRITES-WORDS-FAST. MAGIC-EARS.",
    position: { x: 780, y: 1000 },
  },
  {
    id: 'model-tts', name: 'Text-to-Speech Model', label: 'Foundation Model', labelDeaf: 'MODEL TEXT-TO-VOICE', type: ComponentType.AI_MODEL,
    description: "The Voice of the Page. This enchantment gives written text a clear and natural voice, used for accessibility readouts and creating conversational user interfaces that speak.",
    descriptionDeaf: "READS-WORDS-ALOUD. MAKES-TEXT-TALK.",
    position: { x: 780, y: 1150 },
  },
  {
    id: 'model-ttsign', name: 'Text-to-Sign Model', label: 'Foundation Model', labelDeaf: 'MODEL TEXT-TO-SIGN', type: ComponentType.AI_MODEL,
    description: "The Weaver of Signs. This advanced incantation translates written text into fluid, nuanced American Sign Language, bringing communication to life through a digital avatar.",
    descriptionDeaf: "WORDS BECOME-SIGN. AVATAR-SIGNS-FOR-YOU.",
    position: { x: 780, y: 1300 },
  },
];


export const EDGES: Edge[] = [
  // UI to Gateways
  { id: 'e1', source: 'ui-web-mobile', target: 'svc-deafauth' },
  { id: 'e2', source: 'ui-web-mobile', target: 'svc-pinksync' },
  // Local AI to UI
  { id: 'e3', source: 'ai-local-offline', target: 'ui-web-mobile' },
  // Gateways to APIs
  { id: 'e4', source: 'svc-deafauth', target: 'api-creative' },
  { id: 'e5', source: 'svc-deafauth', target: 'api-business' },
  { id: 'e6', source: 'svc-deafauth', target: 'api-job' },
  { id: 'e7', source: 'svc-deafauth', target: 'api-developer' },
  // Ethics to APIs
  { id: 'e8', source: 'svc-fibonrose', target: 'api-creative' },
  { id: 'e9', source: 'svc-fibonrose', target: 'api-business' },
  { id: 'e10', source: 'svc-fibonrose', target: 'api-job' },
  { id: 'e11', source: 'svc-fibonrose', target: 'api-developer' },
  // PinkSync to APIs
  { id: 'e12', source: 'svc-pinksync', target: 'api-creative' },
  { id: 'e13', source: 'svc-pinksync', target: 'api-job' },
  // APIs to AI Core
  { id: 'e14', source: 'api-creative', target: 'ai-core-orchestrator' },
  { id: 'e15', source: 'api-business', target: 'ai-core-orchestrator' },
  { id: 'e16', source: 'api-job', target: 'ai-core-orchestrator' },
  { id: 'e17', source: 'api-developer', target: 'ai-core-orchestrator' },
  // AI Core to Agents
  { id: 'e18', source: 'ai-core-orchestrator', target: 'agent-idea' },
  { id: 'e19', source: 'ai-core-orchestrator', target: 'agent-builder' },
  { id: 'e20', source: 'ai-core-orchestrator', target: 'agent-funding' },
  { id: 'e21', source: 'ai-core-orchestrator', target: 'agent-growth' },
  { id: 'e22', source: 'ai-core-orchestrator', target: 'agent-job' },
  { id: 'e23', source: 'ai-core-orchestrator', target: 'agent-creative' },
  { id: 'e24', source: 'ai-core-orchestrator', target: 'agent-developer' },
  // Agents to Data/Bus
  { id: 'e25', source: 'agent-idea', target: 'db-operational' },
  { id: 'e26', source: 'agent-builder', target: 'db-operational' },
  { id: 'e27', source: 'agent-job', target: 'db-operational' },
  { id: 'e28', source: 'agent-funding', target: 'api-federal' },
  { id: 'e29', source: 'agent-funding', target: 'api-state' },
  { id: 'e30', source: 'agent-developer', target: 'infra-source' },
  // Data Flow
  { id: 'e31', source: 'db-operational', target: 'bus-events' },
  { id: 'e32', source: 'bus-events', target: 'analytics-warehouse' },
  { id: 'e33', source: 'bus-events', target: 'monitoring-platform' },
  // AI Core to Model Hosting
  { id: 'e34', source: 'ai-core-orchestrator', target: 'infra-models' },
  // Infra to Models
  { id: 'e35', source: 'infra-models', target: 'model-stt' },
  { id: 'e36', source: 'infra-models', target: 'model-tts' },
  { id: 'e37', source: 'infra-models', target: 'model-ttsign' },
  // PinkSync to Models
  { id: 'e38', source: 'svc-pinksync', target: 'model-stt' },
  { id: 'e39', source: 'svc-pinksync', target: 'model-tts' },
  { id: 'e40', source: 'svc-pinksync', target: 'model-ttsign' },
  // Governance
  { id: 'e41', source: 'gov-dao', target: 'svc-fibonrose' },
  { id: 'e42', source: 'gov-dao', target: 'api-business' },
  // CI/CD
  { id: 'e43', source: 'infra-source', target: 'infra-hosting' },
  // API connections to data
  { id: 'e44', source: 'api-business', target: 'db-operational'},
  { id: 'e45', source: 'api-creative', target: 'db-operational'},
  { id: 'e46', source: 'api-job', target: 'db-operational'},
  // Session management
  { id: 'e47', source: 'svc-deafauth', target: 'cache-session' },
  // Agents using cache
  { id: 'e48', source: 'agent-idea', target: 'cache-session' },
  { id: 'e49', source: 'agent-job', target: 'cache-session' },
  // PinkFlow Automation
  { id: 'e50', source: 'api-developer', target: 'cli-pinkflow' },
  { id: 'e51', source: 'cli-pinkflow', target: 'infra-source' },
  { id: 'e52', source: 'cli-pinkflow', target: 'infra-hosting' },
  { id: 'e53', source: 'cli-pinkflow', target: 'infra-models' },
  { id: 'e54', source: 'cli-pinkflow', target: 'svc-fibonrose' },
];