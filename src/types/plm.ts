export interface EngineeringParameters {
  designComplexity: number; // 1 - 10 index
  manufacturingDefects: number; // Count per batch
  supplierQuality: number; // 0 - 100 %
  warrantyClaims: number; // Count
  safetyCompliance: number; // 0 - 100 %
  maintenanceCost: number; // $/Month
  toolWearTelemetry: number; // 0 - 100 index
}

export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type ECRDecision = 'YES' | 'NO';

export interface PredictionResult {
  ecrRequired: ECRDecision;
  confidence: number; // 0 - 100%
  productHealthScore: number; // 0 - 100
  riskLevel: RiskLevel;
  primaryInfluencer: string;
  recommendedAction: string;
  treeVotes: { yes: number; no: number; total: number };
  lifecycleRisks: {
    stage: string;
    parameter: string;
    riskScore: number;
    status: 'Optimal' | 'Acceptable' | 'Warning' | 'Critical';
  }[];
}

export interface ProductRecord {
  productId: string;
  productName: string;
  parameters: EngineeringParameters;
  prediction?: PredictionResult;
  timestamp?: string;
  batchLot?: string;
}

export interface ECRDocument {
  ecrId: string;
  productId: string;
  productName: string;
  dateGenerated: string;
  changeCategory: string;
  urgency: 'Low' | 'Medium' | 'High' | 'Immediate';
  problemDescription: string;
  rootCauseLifecycleStage: string;
  proposedChange: string;
  estimatedCostImpact: string;
  signoffTeam: {
    initiator: string;
    leadReviewer: string;
    department: string;
  };
}
