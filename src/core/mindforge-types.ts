/**
 * MindForge AI Risk Management Toolkit
 * Type Definitions for MAS Project MindForge Integration
 */

export type MindForgeRiskDimension =
  | 'accountability_governance'
  | 'monitoring_stability'
  | 'transparency_explainability'
  | 'fairness_bias'
  | 'legal_regulatory'
  | 'ethics_impact'
  | 'cyber_data_security';

export interface RiskDimensionAssessment {
  dimension: MindForgeRiskDimension;
  label: string;
  score: number; // 1-5
  rationale: string;
  controls: string[];
  linkedMandateIds: string[];
}

export interface RiskMaterialityAssessment {
  impact: number;      // 1-5
  complexity: number;  // 1-5
  reliance: number;    // 1-5
  overallScore: number; // computed: impact * complexity * reliance
  tier: 'low' | 'medium' | 'high' | 'critical';
}

export type LifecycleStage =
  | 'design'
  | 'data_collection'
  | 'training'
  | 'deployment'
  | 'monitoring'
  | 'retirement';

export type FEATPillar = 'fairness' | 'ethics' | 'accountability' | 'transparency';

export interface FEATPrinciple {
  id: string;
  pillar: FEATPillar;
  name: string;
  description: string;
  implemented: boolean;
  evidenceNotes: string;
  linkedMandateIds: string[];
}

export interface FEATAlignment {
  principles: FEATPrinciple[];
  overallPercentage: number; // computed from implemented count
}

export interface LifecycleControl {
  stage: LifecycleStage;
  controlName: string;
  status: 'implemented' | 'planned' | 'not_started';
}

export interface AISystemEntry {
  id: string;
  name: string;
  description: string;
  lifecycleStage: LifecycleStage;
  dataUsed: string[];
  dependencies: string[];
  riskMateriality: RiskMaterialityAssessment;
  validationStatus: 'validated' | 'pending' | 'not_assessed';
  owner: string;
  featAlignment: FEATAlignment;
  lifecycleControls: LifecycleControl[];
}
