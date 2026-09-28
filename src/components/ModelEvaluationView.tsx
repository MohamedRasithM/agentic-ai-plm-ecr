import React from 'react';
import { Award, BarChart3, ShieldAlert, CheckCircle2, AlertTriangle, Layers, Cpu, FileCheck } from 'lucide-react';

export const ModelEvaluationView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-slate-200/90 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-900 text-white uppercase tracking-wider shadow-2xs">
                Model Evaluation &amp; Metrics
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Random Forest Classifier: Reported Prototype Benchmark
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Supervised classification evaluation results trained on the <strong>5,000 synthetic engineering records dataset</strong>. Evaluates non-linear relationships across the 7 product lifecycle stages to predict Engineering Change Requests (ECR).
            </p>
          </div>

          <div className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-300 text-xs text-slate-800 shrink-0 font-mono shadow-2xs font-semibold">
            Algorithm: Random Forest (Ensemble)
          </div>
        </div>
      </div>

      {/* 4 Reported Performance Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white/95 backdrop-blur-md p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <span className="text-xs font-semibold text-slate-500 block uppercase tracking-wider">
            Accuracy
          </span>
          <span className="text-3xl font-extrabold font-mono text-slate-900 mt-1 block">
            98.4%
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Overall classification accuracy
          </span>
        </div>

        <div className="bg-white/95 backdrop-blur-md p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <span className="text-xs font-semibold text-slate-500 block uppercase tracking-wider">
            Precision
          </span>
          <span className="text-3xl font-extrabold font-mono text-emerald-600 mt-1 block">
            98.1%
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Low false-positive change triggers
          </span>
        </div>

        <div className="bg-white/95 backdrop-blur-md p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <span className="text-xs font-semibold text-slate-500 block uppercase tracking-wider">
            Recall
          </span>
          <span className="text-3xl font-extrabold font-mono text-amber-600 mt-1 block">
            98.5%
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Captures critical engineering risks
          </span>
        </div>

        <div className="bg-white/95 backdrop-blur-md p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <span className="text-xs font-semibold text-slate-500 block uppercase tracking-wider">
            F1 Score
          </span>
          <span className="text-3xl font-extrabold font-mono text-slate-800 mt-1 block">
            98.3%
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Harmonic mean of precision &amp; recall
          </span>
        </div>
      </div>

      {/* Academic Integrity & Claim Restrictions Notice */}
      <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 text-xs text-slate-700 space-y-1.5 leading-relaxed shadow-2xs">
        <div className="flex items-center gap-2 text-amber-900 font-bold">
          <ShieldAlert className="w-4 h-4 text-amber-600" />
          <span>Academic Context &amp; Dataset Scope Disclosure</span>
        </div>
        <p>
          Complete industrial PLM repositories contain proprietary CAD geometry, bill of materials, confidential supplier contracts, and warranty litigation data. Consequently, this academic research utilized a <strong>synthetic/hybrid engineering dataset of 5,000 structured lifecycle records</strong> generated under engineering-rule constraints.
        </p>
        <p className="text-slate-500">
          The 98.4% accuracy is the <strong>reported prototype benchmark</strong> on this test dataset. It is not presented as an independently certified industrial accuracy metric.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Feature Importance Chart */}
        <div className="lg:col-span-7 bg-white/95 rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200">
            <div>
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Random Forest Feature Importance
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Relative influence of the 7 parameters on ECR decision making
              </p>
            </div>
            <span className="text-[11px] text-slate-600 font-mono font-medium">Gini Impurity Metric</span>
          </div>

          <div className="space-y-3.5 text-xs">
            {/* 1. Manufacturing Defects */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800">1. Manufacturing Defects (Count/batch)</span>
                <span className="font-mono text-slate-900 font-bold">31.4% (Primary Driver)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                <div className="bg-amber-600 h-full rounded-full" style={{ width: '31.4%' }} />
              </div>
            </div>

            {/* 2. Safety Compliance */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800">2. Safety Compliance Score (%)</span>
                <span className="font-mono text-rose-600 font-bold">22.8% (Regulatory Critical)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                <div className="bg-rose-500 h-full rounded-full" style={{ width: '22.8%' }} />
              </div>
            </div>

            {/* 3. Field Warranty Claims */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800">3. Field Warranty Claims (Count)</span>
                <span className="font-mono text-amber-700 font-bold">16.2%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '16.2%' }} />
              </div>
            </div>

            {/* 4. Tool Wear & Telemetry */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800">4. Tool Wear &amp; Telemetry Anomaly</span>
                <span className="font-mono text-slate-800 font-bold">11.5%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                <div className="bg-slate-700 h-full rounded-full" style={{ width: '11.5%' }} />
              </div>
            </div>

            {/* 5. Maintenance Cost */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800">5. Maintenance Operating Cost ($/mo)</span>
                <span className="font-mono text-slate-800 font-bold">8.7%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                <div className="bg-slate-600 h-full rounded-full" style={{ width: '8.7%' }} />
              </div>
            </div>

            {/* 6. Supplier Quality Rating */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800">6. Supplier Quality Rating (%)</span>
                <span className="font-mono text-emerald-700 font-bold">5.8%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: '5.8%' }} />
              </div>
            </div>

            {/* 7. Design Complexity */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800">7. Design Complexity (Index 1-10)</span>
                <span className="font-mono text-slate-700 font-bold">3.6%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                <div className="bg-slate-500 h-full rounded-full" style={{ width: '3.6%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Confusion Matrix & Dataset Attributes */}
        <div className="lg:col-span-5 space-y-4">
          {/* Confusion Matrix */}
          <div className="bg-white/95 rounded-xl border border-slate-200 p-5 shadow-sm">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">
              Prototype Confusion Matrix (Test Split: 1,000 Records)
            </h3>

            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg shadow-2xs">
                <span className="text-[10px] text-emerald-800 block uppercase font-semibold">True Negative (No ECR)</span>
                <span className="text-xl font-bold font-mono text-emerald-700 mt-1 block">542</span>
                <span className="text-[10px] text-slate-500">Correctly Unchanged</span>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg shadow-2xs">
                <span className="text-[10px] text-amber-800 block uppercase font-semibold">False Positive (False Alarm)</span>
                <span className="text-xl font-bold font-mono text-amber-700 mt-1 block">8</span>
                <span className="text-[10px] text-slate-500">Unnecessary Review</span>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg shadow-2xs">
                <span className="text-[10px] text-amber-800 block uppercase font-semibold">False Negative (Missed ECR)</span>
                <span className="text-xl font-bold font-mono text-amber-700 mt-1 block">8</span>
                <span className="text-[10px] text-slate-500">Escaped Defect</span>
              </div>

              <div className="bg-rose-50 border border-rose-200 p-3 rounded-lg shadow-2xs">
                <span className="text-[10px] text-rose-800 block uppercase font-semibold">True Positive (ECR Flagged)</span>
                <span className="text-xl font-bold font-mono text-rose-700 mt-1 block">442</span>
                <span className="text-[10px] text-slate-500">Accurately Triggered</span>
              </div>
            </div>
          </div>

          {/* Dataset Specifications Card */}
          <div className="bg-white/95 rounded-xl border border-slate-200 p-4 shadow-sm text-xs text-slate-700 space-y-2">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Dataset Specification
            </h4>
            <div className="space-y-1.5 text-slate-600">
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span>Total Synthetic Records:</span>
                <span className="font-mono text-slate-900 font-semibold">5,000 rows</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span>Features:</span>
                <span className="font-mono text-slate-900 font-semibold">7 Lifecycle Stages</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span>Target Variable:</span>
                <span className="font-mono text-slate-900 font-semibold">ECR Required (Binary: YES/NO)</span>
              </div>
              <div className="flex justify-between">
                <span>Train / Test Split:</span>
                <span className="font-mono text-slate-900 font-semibold">80% / 20% (Stratified)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
