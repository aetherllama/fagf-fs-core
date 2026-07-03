import {
  RiskDimensionAssessment,
  RiskMaterialityAssessment,
  FEATPrinciple,
  AISystemEntry,
  LifecycleControl,
} from './mindforge-types';

export const DEFAULT_RISK_DIMENSIONS: RiskDimensionAssessment[] = [
  {
    dimension: 'accountability_governance',
    label: 'Accountability & Governance',
    score: 4,
    rationale: 'All 7 SAFR controls enforce policy-bound execution with tamper-evident audit logs and HITL escalation paths.',
    controls: ['SAFR Disposition Engine', 'HITL escalation workflow', 'Tamper-evident audit log'],
    linkedMandateIds: ['safr-auth-01', 'safr-auth-02', 'safr-limit-01', 'safr-limit-02', 'safr-velocity-01', 'safr-velocity-02', 'safr-cat-01'],
  },
  {
    dimension: 'monitoring_stability',
    label: 'Monitoring & Stability',
    score: 3,
    rationale: 'SAFR velocity controls enforce real-time validation of rate limits and cooldown periods to prevent runaway agent behavior.',
    controls: ['Rate limit per hour', 'Cooldown enforcement', 'Transaction frequency monitoring'],
    linkedMandateIds: ['safr-velocity-01', 'safr-velocity-02'],
  },
  {
    dimension: 'transparency_explainability',
    label: 'Transparency & Explainability',
    score: 4,
    rationale: 'SAFR spending limits and thresholds are fully transparent with clear risk disclosures and agent reasoning payloads captured in the audit log.',
    controls: ['Risk disclosure per control', 'Agent reasoning capture', 'Threshold visibility'],
    linkedMandateIds: ['safr-limit-01', 'safr-limit-02'],
  },
  {
    dimension: 'fairness_bias',
    label: 'Fairness & Bias',
    score: 3,
    rationale: 'Category restrictions apply uniformly to all transactions regardless of origin, preventing discriminatory routing.',
    controls: ['Uniform category enforcement', 'Deterministic rule application'],
    linkedMandateIds: ['safr-cat-01'],
  },
  {
    dimension: 'legal_regulatory',
    label: 'Legal & Regulatory',
    score: 4,
    rationale: 'SAFR is built on MAS Project MindForge guidelines, Singapore PDPA, and AML/CFT requirements, enforced through category blocks and authorization controls.',
    controls: ['MAS MindForge alignment', 'Blocked category enforcement', 'Payment channel restrictions'],
    linkedMandateIds: ['safr-cat-01', 'safr-auth-01', 'safr-limit-02'],
  },
  {
    dimension: 'ethics_impact',
    label: 'Ethics & Impact',
    score: 3,
    rationale: 'Category blocking prevents exposure to harmful industries; merchant verification reduces fraud impact on consumers.',
    controls: ['Harmful category blocking', 'New merchant verification', 'Consumer protection thresholds'],
    linkedMandateIds: ['safr-cat-01', 'safr-auth-01'],
  },
  {
    dimension: 'cyber_data_security',
    label: 'Cyber & Data Security',
    score: 3,
    rationale: 'Authorization mandates restrict payment channels and require merchant verification, limiting attack surface.',
    controls: ['Approved payment channel list', 'Merchant trust verification', 'Cryptographic approval requirements'],
    linkedMandateIds: ['safr-auth-01', 'safr-auth-02'],
  },
];

export const DEFAULT_RISK_MATERIALITY: RiskMaterialityAssessment = {
  impact: 3,
  complexity: 2,
  reliance: 4,
  overallScore: 24,
  tier: 'medium',
};

export const DEFAULT_FEAT_PRINCIPLES: FEATPrinciple[] = [
  // Fairness
  {
    id: 'feat-f-01',
    pillar: 'fairness',
    name: 'Justifiable Outcomes',
    description: 'AI system produces outcomes that are justifiable and do not result in unjust discrimination.',
    implemented: true,
    evidenceNotes: 'SAFR policy-bound execution ensures uniform, deterministic treatment across all agent-initiated transactions.',
    linkedMandateIds: ['safr-cat-01'],
  },
  {
    id: 'feat-f-02',
    pillar: 'fairness',
    name: 'Data Representativeness',
    description: 'Training and operational data is representative and does not embed historical biases.',
    implemented: false,
    evidenceNotes: '',
    linkedMandateIds: [],
  },
  {
    id: 'feat-f-03',
    pillar: 'fairness',
    name: 'Outcome Monitoring',
    description: 'Continuous monitoring for disparate impact across protected groups.',
    implemented: true,
    evidenceNotes: 'Category restrictions apply uniformly; velocity controls prevent pattern-based discrimination.',
    linkedMandateIds: ['safr-cat-01', 'safr-velocity-01'],
  },
  // Ethics
  {
    id: 'feat-e-01',
    pillar: 'ethics',
    name: 'Ethical Standards Compliance',
    description: 'AI system operation adheres to established ethical standards and societal norms.',
    implemented: true,
    evidenceNotes: 'Blocked categories prevent transactions in harmful industries (gambling, scams).',
    linkedMandateIds: ['safr-cat-01'],
  },
  {
    id: 'feat-e-02',
    pillar: 'ethics',
    name: 'Human Wellbeing Priority',
    description: 'AI decisions prioritize human wellbeing and do not cause harm to individuals or communities.',
    implemented: true,
    evidenceNotes: 'HITL escalation ensures human oversight for high-value and risky transactions.',
    linkedMandateIds: ['safr-limit-01', 'safr-auth-01'],
  },
  {
    id: 'feat-e-03',
    pillar: 'ethics',
    name: 'Proportionate Response',
    description: 'Controls are proportionate to the risk posed by the AI system.',
    implemented: true,
    evidenceNotes: 'Tiered enforcement (shadow_log < approval_required < block) scales with severity.',
    linkedMandateIds: ['safr-limit-01', 'safr-limit-02'],
  },
  {
    id: 'feat-e-04',
    pillar: 'ethics',
    name: 'Stakeholder Impact Assessment',
    description: 'Regular assessment of AI impact on all stakeholders including customers and society.',
    implemented: false,
    evidenceNotes: '',
    linkedMandateIds: [],
  },
  // Accountability
  {
    id: 'feat-a-01',
    pillar: 'accountability',
    name: 'Clear Ownership',
    description: 'Clear lines of accountability for AI system decisions and outcomes.',
    implemented: true,
    evidenceNotes: 'Every SAFR control entry has a defined disposition action and risk disclosure captured in the audit log.',
    linkedMandateIds: ['safr-auth-01', 'safr-auth-02'],
  },
  {
    id: 'feat-a-02',
    pillar: 'accountability',
    name: 'Audit Trail',
    description: 'Complete and immutable record of all AI decisions for regulatory review.',
    implemented: true,
    evidenceNotes: 'SAFR governance envelopes capture full action context, agent reasoning, and disposition results in the tamper-evident audit log.',
    linkedMandateIds: ['safr-limit-01', 'safr-limit-02', 'safr-velocity-01'],
  },
  {
    id: 'feat-a-03',
    pillar: 'accountability',
    name: 'Human Override Capability',
    description: 'Ability for authorized humans to override or halt AI decisions at any point.',
    implemented: true,
    evidenceNotes: 'SAFR Disposition Engine escalates to human review at configurable thresholds, with full override capability.',
    linkedMandateIds: ['safr-auth-01', 'safr-limit-01'],
  },
  {
    id: 'feat-a-04',
    pillar: 'accountability',
    name: 'Remediation Process',
    description: 'Established process for addressing and remedying adverse AI outcomes.',
    implemented: false,
    evidenceNotes: '',
    linkedMandateIds: [],
  },
  // Transparency
  {
    id: 'feat-t-01',
    pillar: 'transparency',
    name: 'Decision Explainability',
    description: 'AI decisions can be explained in terms understandable to affected individuals.',
    implemented: true,
    evidenceNotes: 'SAFR disposition results include triggered controls, reasons, and enforcement context for each agent action.',
    linkedMandateIds: ['safr-limit-01', 'safr-limit-02'],
  },
  {
    id: 'feat-t-02',
    pillar: 'transparency',
    name: 'Model Documentation',
    description: 'Comprehensive documentation of AI model capabilities, limitations, and intended use.',
    implemented: true,
    evidenceNotes: 'SAFR white paper documents all controls, parameters, and disposition logic across the Controls Repository.',
    linkedMandateIds: [],
  },
  {
    id: 'feat-t-03',
    pillar: 'transparency',
    name: 'Disclosure to Customers',
    description: 'Customers are informed when AI is involved in decisions affecting them.',
    implemented: false,
    evidenceNotes: '',
    linkedMandateIds: [],
  },
];

export const DEFAULT_LIFECYCLE_CONTROLS: LifecycleControl[] = [
  { stage: 'design', controlName: 'Risk appetite definition', status: 'implemented' },
  { stage: 'design', controlName: 'Regulatory requirement mapping', status: 'implemented' },
  { stage: 'design', controlName: 'Stakeholder impact assessment', status: 'planned' },
  { stage: 'data_collection', controlName: 'Data quality validation', status: 'implemented' },
  { stage: 'data_collection', controlName: 'Bias detection in training data', status: 'planned' },
  { stage: 'training', controlName: 'Model performance benchmarking', status: 'planned' },
  { stage: 'training', controlName: 'Adversarial robustness testing', status: 'not_started' },
  { stage: 'deployment', controlName: 'Mandate enforcement activation', status: 'implemented' },
  { stage: 'deployment', controlName: 'Canary deployment with rollback', status: 'planned' },
  { stage: 'deployment', controlName: 'Production readiness review', status: 'implemented' },
  { stage: 'monitoring', controlName: 'Real-time transaction monitoring', status: 'implemented' },
  { stage: 'monitoring', controlName: 'Drift detection and alerting', status: 'planned' },
  { stage: 'monitoring', controlName: 'Periodic model revalidation', status: 'not_started' },
  { stage: 'retirement', controlName: 'Graceful decommissioning plan', status: 'not_started' },
  { stage: 'retirement', controlName: 'Data retention compliance', status: 'planned' },
];

export function computeMaterialityTier(score: number): RiskMaterialityAssessment['tier'] {
  if (score <= 15) return 'low';
  if (score <= 40) return 'medium';
  if (score <= 80) return 'high';
  return 'critical';
}

export const DEFAULT_AI_SYSTEM_ENTRY: AISystemEntry = {
  id: 'ais-safr-001',
  name: 'SAFR Disposition Engine',
  description: 'Policy-bound execution engine for autonomous AI agent financial actions, implementing the MAS SAFR Controls Repository with real-time validation and tamper-evident audit logging.',
  lifecycleStage: 'monitoring',
  dataUsed: ['Transaction records', 'Agent identity credentials', 'Merchant trust lists', 'Category classification data', 'Velocity metrics'],
  dependencies: ['MAS SAFR White Paper', 'MAS Project MindForge', 'Singapore PDPA'],
  riskMateriality: DEFAULT_RISK_MATERIALITY,
  validationStatus: 'validated',
  owner: 'Governance Risk & Compliance',
  featAlignment: {
    principles: DEFAULT_FEAT_PRINCIPLES,
    overallPercentage: Math.round((DEFAULT_FEAT_PRINCIPLES.filter(p => p.implemented).length / DEFAULT_FEAT_PRINCIPLES.length) * 100),
  },
  lifecycleControls: DEFAULT_LIFECYCLE_CONTROLS,
};
