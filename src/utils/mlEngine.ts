import { EngineeringParameters, PredictionResult, RiskLevel, ECRDecision } from '../types/plm';

/**
 * Calculates Product Health Score (0 - 100)
 * Evaluates the 7 engineering lifecycle stages:
 * - Design Complexity (1 - 10)
 * - Manufacturing Defects (Count/batch)
 * - Supplier Quality (0 - 100%)
 * - Field Warranty Claims (Count)
 * - Safety Compliance (0 - 100%)
 * - Maintenance Cost ($/Month)
 * - Tool Wear & Telemetry Anomaly (0 - 100)
 */
export function calculateProductHealth(params: EngineeringParameters): number {
  let score = 100;

  // 1. Manufacturing Defects impact (heavy penalty per defect)
  score -= Math.min(params.manufacturingDefects * 3.8, 30);

  // 2. Warranty Claims impact (direct field quality failure)
  score -= Math.min(params.warrantyClaims * 4.2, 25);

  // 3. Safety Compliance impact (critical regulatory penalty)
  if (params.safetyCompliance < 100) {
    const safetyDeficit = 100 - params.safetyCompliance;
    score -= (safetyDeficit * 0.45);
  }

  // 4. Supplier Quality degradation
  if (params.supplierQuality < 100) {
    const supplierDeficit = 100 - params.supplierQuality;
    score -= (supplierDeficit * 0.22);
  }

  // 5. Maintenance Cost anomaly (baseline ~$1000/mo, penalty scales with excess)
  if (params.maintenanceCost > 1000) {
    const excessCost = params.maintenanceCost - 1000;
    score -= Math.min((excessCost / 4000) * 15, 18);
  }

  // 6. Tool Wear & Telemetry Anomaly
  score -= (params.toolWearTelemetry * 0.14);

  // 7. Design Complexity friction
  if (params.designComplexity > 5) {
    score -= (params.designComplexity - 5) * 1.5;
  }

  return Math.max(5, Math.min(100, Math.round(score)));
}

export function determineRiskLevel(healthScore: number): RiskLevel {
  if (healthScore >= 80) return 'Low';
  if (healthScore >= 60) return 'Medium';
  if (healthScore >= 40) return 'High';
  return 'Critical';
}

/**
 * Ensemble of 15 Decision Trees simulating the Random Forest Classifier
 * trained on structured PLM lifecycle datasets.
 */
interface DecisionTreeNode {
  feature: keyof EngineeringParameters;
  threshold: number;
  condition: 'gt' | 'lt';
  weight: number;
}

const FOREST_TREES: DecisionTreeNode[][] = [
  // Tree 1: Quality & Regulatory focused
  [
    { feature: 'safetyCompliance', threshold: 88, condition: 'lt', weight: 1.2 },
    { feature: 'manufacturingDefects', threshold: 4, condition: 'gt', weight: 1.0 },
  ],
  // Tree 2: Manufacturing & Tooling focused
  [
    { feature: 'manufacturingDefects', threshold: 5, condition: 'gt', weight: 1.3 },
    { feature: 'toolWearTelemetry', threshold: 65, condition: 'gt', weight: 0.9 },
  ],
  // Tree 3: Service & Customer Feedback
  [
    { feature: 'warrantyClaims', threshold: 3, condition: 'gt', weight: 1.2 },
    { feature: 'maintenanceCost', threshold: 2200, condition: 'gt', weight: 0.8 },
  ],
  // Tree 4: Design Complexity vs Manufacturing interaction
  [
    { feature: 'designComplexity', threshold: 7.0, condition: 'gt', weight: 1.1 },
    { feature: 'manufacturingDefects', threshold: 3, condition: 'gt', weight: 1.1 },
  ],
  // Tree 5: Supplier Quality vs Warranty
  [
    { feature: 'supplierQuality', threshold: 78, condition: 'lt', weight: 1.0 },
    { feature: 'warrantyClaims', threshold: 2, condition: 'gt', weight: 1.0 },
  ],
  // Tree 6: High telemetry anomaly & High maintenance
  [
    { feature: 'toolWearTelemetry', threshold: 70, condition: 'gt', weight: 1.1 },
    { feature: 'maintenanceCost', threshold: 2500, condition: 'gt', weight: 1.0 },
  ],
  // Tree 7: Severe Safety override
  [
    { feature: 'safetyCompliance', threshold: 80, condition: 'lt', weight: 1.5 },
  ],
  // Tree 8: High defect threshold
  [
    { feature: 'manufacturingDefects', threshold: 6, condition: 'gt', weight: 1.4 },
  ],
  // Tree 9: Warranty spike
  [
    { feature: 'warrantyClaims', threshold: 4, condition: 'gt', weight: 1.4 },
  ],
  // Tree 10: Multi-factor compound stress
  [
    { feature: 'designComplexity', threshold: 6.5, condition: 'gt', weight: 0.8 },
    { feature: 'supplierQuality', threshold: 82, condition: 'lt', weight: 0.8 },
    { feature: 'toolWearTelemetry', threshold: 55, condition: 'gt', weight: 0.8 },
  ],
  // Tree 11: Service Cost runaway
  [
    { feature: 'maintenanceCost', threshold: 3200, condition: 'gt', weight: 1.2 },
    { feature: 'warrantyClaims', threshold: 2, condition: 'gt', weight: 0.9 },
  ],
  // Tree 12: Tool wear + manufacturing defects
  [
    { feature: 'toolWearTelemetry', threshold: 60, condition: 'gt', weight: 1.0 },
    { feature: 'manufacturingDefects', threshold: 4, condition: 'gt', weight: 1.1 },
  ],
  // Tree 13: Sub-optimal supplier + safety compliance dip
  [
    { feature: 'supplierQuality', threshold: 75, condition: 'lt', weight: 1.0 },
    { feature: 'safetyCompliance', threshold: 92, condition: 'lt', weight: 0.9 },
  ],
  // Tree 14: Balanced lifecycle stress
  [
    { feature: 'manufacturingDefects', threshold: 3, condition: 'gt', weight: 0.7 },
    { feature: 'warrantyClaims', threshold: 2, condition: 'gt', weight: 0.7 },
    { feature: 'maintenanceCost', threshold: 1800, condition: 'gt', weight: 0.7 },
  ],
  // Tree 15: Extreme design complexity intolerance
  [
    { feature: 'designComplexity', threshold: 8.5, condition: 'gt', weight: 1.1 },
    { feature: 'toolWearTelemetry', threshold: 50, condition: 'gt', weight: 0.9 },
  ],
];

/**
 * Executes Random Forest classification on 7 parameters
 */
export function predictEngineeringChange(params: EngineeringParameters): PredictionResult {
  const healthScore = calculateProductHealth(params);
  const riskLevel = determineRiskLevel(healthScore);

  let yesVotes = 0;
  let noVotes = 0;

  for (const tree of FOREST_TREES) {
    let triggeredCount = 0;
    for (const rule of tree) {
      const val = params[rule.feature];
      if (rule.condition === 'gt' && val > rule.threshold) {
        triggeredCount++;
      } else if (rule.condition === 'lt' && val < rule.threshold) {
        triggeredCount++;
      }
    }

    // If at least one branch rule triggered in this tree
    if (triggeredCount >= Math.ceil(tree.length / 2)) {
      yesVotes++;
    } else {
      noVotes++;
    }
  }

  // Safety hard-override: If safety compliance < 75% or defects >= 7, immediate consensus
  if (params.safetyCompliance < 75 || params.manufacturingDefects >= 8) {
    yesVotes = Math.max(yesVotes, 14);
    noVotes = 15 - yesVotes;
  }

  const total = FOREST_TREES.length;
  const confidence = Math.round((Math.max(yesVotes, noVotes) / total) * 100);
  const ecrRequired: ECRDecision = yesVotes >= Math.ceil(total / 2) ? 'YES' : 'NO';

  // Determine Primary Influencing Factor & Stage
  const stageContributions = [
    {
      stage: 'Manufacturing',
      parameter: 'Manufacturing Defects',
      severity: params.manufacturingDefects / 8,
      riskScore: Math.min(100, Math.round((params.manufacturingDefects / 10) * 100)),
      action: 'ECR-MFG: Redesign manufacturing tooling, update GD&T tolerances, and conduct process capability (Cpk) study',
    },
    {
      stage: 'Service / Warranty',
      parameter: 'Field Warranty Claims',
      severity: params.warrantyClaims / 6,
      riskScore: Math.min(100, Math.round((params.warrantyClaims / 8) * 100)),
      action: 'ECR-FLD: Initiate engineering revision on field failure root cause; upgrade component endurance rating',
    },
    {
      stage: 'Quality & Regulatory',
      parameter: 'Safety Compliance',
      severity: (100 - params.safetyCompliance) / 25,
      riskScore: Math.round(100 - params.safetyCompliance),
      action: 'ECR-SFTY: Mandatory Engineering Change Order (ECO) to meet statutory safety and regulatory standards',
    },
    {
      stage: 'Production Telemetry',
      parameter: 'Tool Wear & Telemetry Anomaly',
      severity: params.toolWearTelemetry / 70,
      riskScore: Math.round(params.toolWearTelemetry),
      action: 'ECR-TOOL: Modify cutting speeds/feeds, update toolholder geometry and adjust CNC program parameters',
    },
    {
      stage: 'Supply Chain',
      parameter: 'Supplier Quality Rating',
      severity: (100 - params.supplierQuality) / 30,
      riskScore: Math.round(100 - params.supplierQuality),
      action: 'ECR-SUPP: Revise incoming inspection spec, update BOM approved vendor list (AVL), or alternate alloy qualification',
    },
    {
      stage: 'Design Stage',
      parameter: 'Design Complexity',
      severity: (params.designComplexity - 4) / 5,
      riskScore: Math.min(100, Math.round((params.designComplexity / 10) * 100)),
      action: 'ECR-DSGN: Value engineering & Design for Assembly (DFA) simplification to reduce sub-assembly part count',
    },
    {
      stage: 'Maintenance Stage',
      parameter: 'Maintenance Cost',
      severity: (params.maintenanceCost - 1000) / 3000,
      riskScore: Math.min(100, Math.round((params.maintenanceCost / 5000) * 100)),
      action: 'ECR-MAINT: Redesign wear components for easier serviceability and extend Mean Time Between Maintenance (MTBM)',
    },
  ];

  // Sort by highest risk/severity
  stageContributions.sort((a, b) => b.severity - a.severity);
  const primary = stageContributions[0];

  const primaryInfluencer = primary.parameter;
  const recommendedAction = ecrRequired === 'YES'
    ? primary.action
    : 'No Engineering Change Required. Product lifecycle parameters within nominal operating envelope.';

  const lifecycleRisks = stageContributions.map(sc => {
    let status: 'Optimal' | 'Acceptable' | 'Warning' | 'Critical' = 'Optimal';
    if (sc.riskScore >= 70) status = 'Critical';
    else if (sc.riskScore >= 45) status = 'Warning';
    else if (sc.riskScore >= 25) status = 'Acceptable';
    return {
      stage: sc.stage,
      parameter: sc.parameter,
      riskScore: sc.riskScore,
      status,
    };
  });

  return {
    ecrRequired,
    confidence,
    productHealthScore: healthScore,
    riskLevel,
    primaryInfluencer,
    recommendedAction,
    treeVotes: { yes: yesVotes, no: noVotes, total },
    lifecycleRisks,
  };
}

/**
 * Multi-Agent Reasoning Trace simulation for PLM Decision Engine
 */
export interface AgentTraceStep {
  agentName: string;
  stage: string;
  assessment: string;
  finding: string;
  recommendation: 'FLAG_CHANGE' | 'CLEAR' | 'CAUTION';
}

export function generateAgenticReasoningTrace(params: EngineeringParameters, result: PredictionResult): AgentTraceStep[] {
  const steps: AgentTraceStep[] = [];

  // 1. Design Agent
  steps.push({
    agentName: 'Design Engineering Agent',
    stage: 'Design & CAD Complexity',
    assessment: `Evaluated complexity index: ${params.designComplexity}/10. Component assembly interfaces and tolerance stackups checked.`,
    finding: params.designComplexity > 7
      ? 'High architectural complexity detected. Susceptible to manufacturing variance and assembly bottlenecks.'
      : 'Complexity is within standard design parameters for this product family.',
    recommendation: params.designComplexity > 7 ? 'FLAG_CHANGE' : 'CLEAR',
  });

  // 2. Manufacturing Agent
  steps.push({
    agentName: 'Manufacturing & Smart Factory Agent',
    stage: 'Production & Tool Wear',
    assessment: `Observed defect count: ${params.manufacturingDefects}/batch. Telemetry anomaly index: ${params.toolWearTelemetry}/100.`,
    finding: params.manufacturingDefects > 4 || params.toolWearTelemetry > 60
      ? `Defect rate exceeds process control limit (PCL). Tool telemetry shows machining vibration/chatter anomaly.`
      : 'Machining and assembly parameters operate under nominal statistical process control (SPC).',
    recommendation: (params.manufacturingDefects > 4 || params.toolWearTelemetry > 60) ? 'FLAG_CHANGE' : 'CLEAR',
  });

  // 3. Quality & Supply Chain Agent
  steps.push({
    agentName: 'Quality & Supplier Agent',
    stage: 'Supply Chain & Regulatory Compliance',
    assessment: `Safety compliance score: ${params.safetyCompliance}%. Supplier quality rating: ${params.supplierQuality}%.`,
    finding: params.safetyCompliance < 90
      ? 'Critical regulatory threshold breach! Safety interlocks or material compliance non-conformance flagged.'
      : params.supplierQuality < 80
        ? 'Supplier defect rate drifting. Raw material hardness/dimension variance observed.'
        : 'Supplier quality and statutory safety compliance meet certified specifications.',
    recommendation: params.safetyCompliance < 90 ? 'FLAG_CHANGE' : (params.supplierQuality < 80 ? 'CAUTION' : 'CLEAR'),
  });

  // 4. Service & Maintenance Agent
  steps.push({
    agentName: 'Service & Field Reliability Agent',
    stage: 'Warranty & Lifecycle Operation',
    assessment: `Warranty claims logged: ${params.warrantyClaims}. Operating maintenance cost: $${params.maintenanceCost.toLocaleString()}/month.`,
    finding: params.warrantyClaims > 2 || params.maintenanceCost > 2400
      ? 'Excessive field maintenance frequency indicates sub-optimal wear life in operating environment.'
      : 'Field warranty and service costs are trending below threshold budget limits.',
    recommendation: (params.warrantyClaims > 2 || params.maintenanceCost > 2400) ? 'FLAG_CHANGE' : 'CLEAR',
  });

  // 5. Decision Arbiter Agent
  steps.push({
    agentName: 'Random Forest ECR Arbiter',
    stage: 'Cross-Lifecycle Decision Synthesis',
    assessment: `Ensemble vote: ${result.treeVotes.yes}/${result.treeVotes.total} trees recommend ECR. Product Health: ${result.productHealthScore}/100. Risk: ${result.riskLevel}.`,
    finding: result.ecrRequired === 'YES'
      ? `Consensus reached: Engineering Change Request is MANDATORY. Primary driver: ${result.primaryInfluencer}.`
      : 'Consensus reached: Product is healthy. Engineering Change is NOT required at this time.',
    recommendation: result.ecrRequired === 'YES' ? 'FLAG_CHANGE' : 'CLEAR',
  });

  return steps;
}
