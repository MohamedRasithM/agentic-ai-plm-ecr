import React from 'react';
import { Layers, Sliders, Database, GitBranch, Cpu, Award } from 'lucide-react';

interface NavbarProps {
  activeTab: 'upload' | 'manual' | 'bom' | 'metrics';
  setActiveTab: (tab: 'upload' | 'manual' | 'bom' | 'metrics') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 text-slate-800 sticky top-0 z-40 shadow-xs">
      {/* Top Academic Banner */}
      <div className="bg-slate-50/90 px-4 py-1.5 border-b border-slate-200 text-xs flex flex-wrap items-center justify-between gap-2 text-slate-600 backdrop-blur-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-900">Chennai Institute of Technology</span>
          <span className="text-slate-300">|</span>
          <span className="font-medium text-slate-600">Department of Mechanical Engineering</span>
        </div>
        <div className="flex items-center gap-3">
          <span>Project Team: <strong className="text-slate-900">Mohamed Farhan M &amp; Mohamed Rasith M</strong></span>
          <span className="text-slate-300">|</span>
          <span>Guide: <strong className="text-slate-900">Balamurugan</strong></span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-300 shadow-2xs">
            Prototype AI Decision Engine
          </span>
        </div>
      </div>

      {/* Main App Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-slate-900 text-white shadow-sm shrink-0 mt-0.5">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900">
                  Agentic AI–Driven PLM Decision Engine
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300 shadow-2xs">
                  Random Forest ECR
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                Bridging the Gap from Data to Autonomous Intelligence in Engineering Change Decision Making
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1.5 bg-slate-100/90 p-1.5 rounded-xl border border-slate-200 shrink-0 self-start md:self-auto overflow-x-auto max-w-full shadow-inner">
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'upload'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-slate-700" />
              <span>Data Upload Mode</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-900 text-white font-mono">
                Primary
              </span>
            </button>

            <button
              onClick={() => setActiveTab('manual')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'manual'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-slate-700" />
              <span>Manual Demo Mode</span>
            </button>

            <button
              onClick={() => setActiveTab('bom')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'bom'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-slate-700" />
              <span>BOM &amp; PLM Architecture</span>
            </button>

            <button
              onClick={() => setActiveTab('metrics')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'metrics'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-slate-700" />
              <span>Model Evaluation</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
