import React, { useState } from 'react';
import { EngineeringParameters, ProductRecord } from '../types/plm';
import { predictEngineeringChange, generateAgenticReasoningTrace } from '../utils/mlEngine';
import {
  Sliders,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Cpu,
  FileText,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Activity,
  Wrench,
  PackageCheck,
  AlertOctagon,
  Scale
} from 'lucide-react';

interface ManualDemoModeProps {
  onOpenECRModal: (product: ProductRecord) => void;
}

const DEFAULT_PARAMS: EngineeringParameters = {
  designComplexity: 6.5,
  manufacturingDefects: 4,
  supplierQuality: 85,
  warrantyClaims: 2,
  safetyCompliance: 91,
  maintenanceCost: 1500,
  toolWearTelemetry: 35,
};

export const ManualDemoMode: React.FC<ManualDemoModeProps> = ({ onOpenECRModal }) => {
  const [params, setParams] = useState<EngineeringParameters>(DEFAULT_PARAMS);
  const [showAgentTrace, setShowAgentTrace] = useState(true);

  const prediction = predictEngineeringChange(params);
  const isECR = prediction.ecrRequired === 'YES';
  const agentTrace = generateAgenticReasoningTrace(params, prediction);

  const updateParam = (key: keyof EngineeringParameters, val: number) => {
    setParams(prev => ({ ...prev, [key]: val }));
  };

  const handleApplyPreset = (presetName: string) => {
    switch (presetName) {
      case 'nominal':
        setParams({
          designComplexity: 3.2,
          manufacturingDefects: 1,
          supplierQuality: 96,
          warrantyClaims: 0,
          safetyCompliance: 98,
          maintenanceCost: 700,
          toolWearTelemetry: 12,
        });
        break;
      case 'mfg_defect':
        setParams({
          designComplexity: 7.2,
          manufacturingDefects: 8,
          supplierQuality: 82,
          warrantyClaims: 2,
          safetyCompliance: 92,
          maintenanceCost: 1900,
          toolWearTelemetry: 68,
        });
        break;
      case 'safety_breach':
        setParams({
          designComplexity: 6.0,
          manufacturingDefects: 2,
          supplierQuality: 88,
          warrantyClaims: 1,
          safetyCompliance: 72,
          maintenanceCost: 1200,
          toolWearTelemetry: 25,
        });
        break;
      case 'field_failure':
        setParams({
          designComplexity: 8.5,
          manufacturingDefects: 5,
          supplierQuality: 70,
          warrantyClaims: 7,
          safetyCompliance: 86,
          maintenanceCost: 4200,
          toolWearTelemetry: 78,
        });
        break;
    }
  };

  const currentProductRecord: ProductRecord = {
    productId: 'DEMO-MANUAL-01',
    productName: 'Interactive Engineering Assembly Evaluation',
    parameters: params,
    prediction,
    batchLot: 'LOT-DEMO-SIM',
  };

  return (
    <div className="space-y-6">
      {/* Top Banner explaining Manual Demo Mode */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-slate-200/90 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300 uppercase tracking-wider shadow-2xs">
                Interactive Test Bench
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Manual Demo Mode (Academic Presentation &amp; Tuning)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Use the sliders below to adjust the <strong>7 product lifecycle parameters</strong> across design, manufacturing, supply chain, regulatory, and field service stages. Observe real-time classification from the Random Forest model and the multi-agent reasoning trace.
            </p>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-1.5 shrink-0">
            <span className="text-xs text-slate-500 font-semibold mr-1">Demo Scenarios:</span>
            <button
              onClick={() => handleApplyPreset('nominal')}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-300 hover:border-emerald-400 transition-colors shadow-2xs"
            >
              Nominal Safe
            </button>
            <button
              onClick={() => handleApplyPreset('mfg_defect')}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-800 border border-slate-300 hover:border-rose-400 transition-colors shadow-2xs"
            >
              Mfg Defect Spike
            </button>
            <button
              onClick={() => handleApplyPreset('safety_breach')}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white hover:bg-red-50 text-slate-700 hover:text-red-800 border border-slate-300 hover:border-red-400 transition-colors shadow-2xs"
            >
              Safety Breach
            </button>
            <button
              onClick={() => handleApplyPreset('field_failure')}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-800 border border-slate-300 hover:border-amber-400 transition-colors shadow-2xs"
            >
              Field Failure &amp; Cost
            </button>
            <button
              onClick={() => setParams(DEFAULT_PARAMS)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors border border-slate-200"
              title="Reset to default baseline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 7 Parameter Sliders (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white/95 backdrop-blur-md rounded-xl border border-slate-200 p-5 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-4 flex items-center justify-between">
              <span>Seven Product Lifecycle Input Parameters</span>
              <span className="text-[11px] text-slate-500 font-mono">Supervised Feature Vector</span>
            </h3>

            <div className="space-y-5">
              {/* 1. Design Complexity */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                      Design Stage
                    </span>
                    <label className="font-bold text-slate-800">1. Design Complexity</label>
                  </div>
                  <span className="font-mono text-slate-900 font-extrabold bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {params.designComplexity.toFixed(1)} / 10
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.1"
                  value={params.designComplexity}
                  onChange={(e) => updateParam('designComplexity', parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-800"
                />
                <p className="text-[11px] text-slate-500">
                  Engineering difficulty index considering component count, assembly interfaces, and GD&amp;T tolerances.
                </p>
              </div>

              {/* 2. Manufacturing Defects */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200">
                      Manufacturing Stage
                    </span>
                    <label className="font-bold text-slate-800">2. Manufacturing Defects</label>
                  </div>
                  <span className="font-mono text-indigo-900 font-extrabold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                    {params.manufacturingDefects} / batch
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  step="1"
                  value={params.manufacturingDefects}
                  onChange={(e) => updateParam('manufacturingDefects', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <p className="text-[11px] text-slate-500">
                  Non-conforming parts identified during factory quality inspection (Major prototype decision driver).
                </p>
              </div>

              {/* 3. Supplier Quality Rating */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Supply Chain Stage
                    </span>
                    <label className="font-bold text-slate-800">3. Supplier Quality Rating</label>
                  </div>
                  <span className="font-mono text-emerald-900 font-extrabold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {params.supplierQuality}%
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  step="1"
                  value={params.supplierQuality}
                  onChange={(e) => updateParam('supplierQuality', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <p className="text-[11px] text-slate-500">
                  Certified vendor component adherence, material test report (MTR) compliance, and delivery grade.
                </p>
              </div>

              {/* 4. Field Warranty Claims */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                      Service &amp; Warranty Stage
                    </span>
                    <label className="font-bold text-slate-800">4. Field Warranty Claims</label>
                  </div>
                  <span className="font-mono text-amber-900 font-extrabold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {params.warrantyClaims} claims
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15"
                  step="1"
                  value={params.warrantyClaims}
                  onChange={(e) => updateParam('warrantyClaims', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                />
                <p className="text-[11px] text-slate-500">
                  Customer returns and field failures received under warranty period in operational deployment.
                </p>
              </div>

              {/* 5. Safety Compliance Score */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-rose-50 text-rose-800 border border-rose-200">
                      Quality &amp; Regulatory Stage
                    </span>
                    <label className="font-bold text-slate-800">5. Safety Compliance Score</label>
                  </div>
                  <span className="font-mono text-rose-900 font-extrabold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    {params.safetyCompliance}%
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  step="1"
                  value={params.safetyCompliance}
                  onChange={(e) => updateParam('safetyCompliance', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
                />
                <p className="text-[11px] text-slate-500">
                  Adherence to statutory safety regulations (OSHA, ISO, CE, ASME pressure vessel / containment standards).
                </p>
              </div>

              {/* 6. Maintenance Cost */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-purple-50 text-purple-800 border border-purple-200">
                      Maintenance Stage
                    </span>
                    <label className="font-bold text-slate-800">6. Maintenance Cost</label>
                  </div>
                  <span className="font-mono text-purple-900 font-extrabold bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                    ${params.maintenanceCost.toLocaleString()} / mo
                  </span>
                </div>
                <input
                  type="range"
                  min="300"
                  max="5000"
                  step="50"
                  value={params.maintenanceCost}
                  onChange={(e) => updateParam('maintenanceCost', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <p className="text-[11px] text-slate-500">
                  Average monthly recurring expenditure for scheduled lubrication, seal replacement, and upkeep.
                </p>
              </div>

              {/* 7. Tool Wear & Telemetry Anomaly */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-cyan-50 text-cyan-800 border border-cyan-200">
                      Smart Mfg / Telemetry
                    </span>
                    <label className="font-bold text-slate-800">7. Tool Wear &amp; Telemetry Anomaly</label>
                  </div>
                  <span className="font-mono text-cyan-900 font-extrabold bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                    {params.toolWearTelemetry} / 100
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={params.toolWearTelemetry}
                  onChange={(e) => updateParam('toolWearTelemetry', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
                />
                <p className="text-[11px] text-slate-500">
                  Spindle vibration, thermal drift, and acoustic tool chatter index during machining operations.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Decision Engine Output Card (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className={`rounded-xl border p-5 shadow-sm backdrop-blur-md transition-all ${
            isECR
              ? 'bg-rose-50/90 border-rose-200'
              : 'bg-emerald-50/90 border-emerald-200'
          }`}>
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-slate-800" />
                <h3 className="font-bold text-slate-900 text-sm">
                  AI Decision Engine Output
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                Random Forest v1.2
              </span>
            </div>

            {/* Core Decision: YES / NO */}
            <div className="mt-4 text-center p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-xs uppercase font-bold text-slate-500 tracking-wider">
                Engineering Change Required?
              </span>
              <div className="flex items-center justify-center gap-3 mt-2">
                {isECR ? (
                  <AlertTriangle className="w-8 h-8 text-rose-600 animate-bounce" />
                ) : (
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                )}
                <span className={`text-4xl font-extrabold tracking-tight ${
                  isECR ? 'text-rose-600' : 'text-emerald-600'
                }`}>
                  {prediction.ecrRequired}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-2 font-mono">
                Consensus: {prediction.treeVotes.yes} of {prediction.treeVotes.total} trees ({prediction.confidence}% confidence)
              </p>
            </div>

            {/* Health & Risk Metrics */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-white p-3 rounded-lg border border-slate-200 text-center shadow-2xs">
                <span className="text-xs font-semibold text-slate-500 block">Product Health Score</span>
                <span className={`text-3xl font-extrabold font-mono mt-1 block ${
                  prediction.productHealthScore >= 80 ? 'text-emerald-600' :
                  prediction.productHealthScore >= 60 ? 'text-amber-600' : 'text-rose-600'
                }`}>
                  {prediction.productHealthScore}
                  <span className="text-xs text-slate-400 font-normal">/100</span>
                </span>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-200 text-center shadow-2xs">
                <span className="text-xs font-semibold text-slate-500 block">Lifecycle Risk Level</span>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase mt-2 ${
                  prediction.riskLevel === 'Low' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                  prediction.riskLevel === 'Medium' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                  'bg-rose-100 text-rose-800 border border-rose-300'
                }`}>
                  {prediction.riskLevel} Risk
                </span>
              </div>
            </div>

            {/* Primary Influencing Factor */}
            <div className="mt-4 p-3 bg-white rounded-lg border border-slate-200 shadow-2xs">
              <span className="text-xs font-semibold text-slate-500 block mb-1">Primary Influencing Stage Factor:</span>
              <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded border border-slate-200 inline-block">
                {prediction.primaryInfluencer}
              </span>
            </div>

            {/* Recommended Action */}
            <div className="mt-4 p-3.5 bg-white rounded-lg border border-slate-200 shadow-2xs">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                AI Engineering Recommendation:
              </span>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {prediction.recommendedAction}
              </p>
            </div>

            {/* Generate ECR Button */}
            <div className="mt-5">
              <button
                onClick={() => onOpenECRModal(currentProductRecord)}
                className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-sm ${
                  isECR
                    ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-200'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Generate ECR Document Draft</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Agent Reasoning Trace Section */}
      <div className="bg-white/95 backdrop-blur-md rounded-xl border border-slate-200 p-5 shadow-sm">
        <button
          onClick={() => setShowAgentTrace(!showAgentTrace)}
          className="w-full flex items-center justify-between text-left focus:outline-none"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-slate-800" />
            <h3 className="font-bold text-slate-900 text-sm">
              Multi-Agent Reasoning Trace (PLM Autonomous Decision Trace)
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-700 border border-slate-300">
              5 Agents
            </span>
          </div>
          {showAgentTrace ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
        </button>

        {showAgentTrace && (
          <div className="mt-4 space-y-3 pt-3 border-t border-slate-100">
            {agentTrace.map((step, idx) => (
              <div
                key={idx}
                className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 font-mono">
                      {step.agentName}
                    </span>
                    <span className="text-slate-400">&bull;</span>
                    <span className="text-slate-500 font-medium">{step.stage}</span>
                  </div>
                  <p className="text-slate-700">
                    <strong className="text-slate-900">Finding:</strong> {step.finding}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {step.assessment}
                  </p>
                </div>

                <div className="shrink-0 self-start md:self-auto">
                  <span className={`inline-block px-2.5 py-1 rounded text-[11px] font-bold uppercase font-mono ${
                    step.recommendation === 'FLAG_CHANGE'
                      ? 'bg-rose-100 text-rose-800 border border-rose-300'
                      : step.recommendation === 'CAUTION'
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  }`}>
                    {step.recommendation}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
