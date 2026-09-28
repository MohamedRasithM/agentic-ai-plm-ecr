import React, { useState } from 'react';
import {
  Layers,
  GitBranch,
  Cpu,
  AlertCircle,
  FileCode,
  CheckCircle2,
  ArrowRight,
  Database,
  ShieldAlert,
  Server,
  Network,
  Users
} from 'lucide-react';

interface BOMNode {
  id: string;
  partName: string;
  material: string;
  quantity: number;
  complexityFactor: number;
  toleranceGrade: string;
  children?: BOMNode[];
}

const SAMPLE_BOM_TREE: BOMNode = {
  id: 'ASM-GBX-001',
  partName: 'High-Torque Planetary Gearbox Subassembly',
  material: 'Multi-Alloy Structural Assembly',
  quantity: 1,
  complexityFactor: 8.2,
  toleranceGrade: 'ISO IT6 Precision',
  children: [
    {
      id: 'PRT-SUN-101',
      partName: 'Sun Pinion Gear (Ground Teeth)',
      material: 'AISI 8620 Case-Hardened Steel',
      quantity: 1,
      complexityFactor: 7.8,
      toleranceGrade: 'ISO IT5',
    },
    {
      id: 'ASM-CAR-201',
      partName: 'Planet Carrier Assembly',
      material: 'Ductile Iron QT-700',
      quantity: 1,
      complexityFactor: 7.2,
      toleranceGrade: 'ISO IT6',
      children: [
        {
          id: 'PRT-PLN-202',
          partName: 'Planet Gears (Triple)',
          material: 'AISI 4140 Quenched & Tempered',
          quantity: 3,
          complexityFactor: 6.9,
          toleranceGrade: 'ISO IT6',
        },
        {
          id: 'PRT-PIN-203',
          partName: 'Planet Carrier Pinion Shafts',
          material: 'EN36B Carburized Steel',
          quantity: 3,
          complexityFactor: 5.5,
          toleranceGrade: 'ISO IT6',
        },
        {
          id: 'PRT-BRG-204',
          partName: 'Caged Needle Roller Bearings',
          material: '100Cr6 High-Carbon Bearing Steel',
          quantity: 6,
          complexityFactor: 4.8,
          toleranceGrade: 'ISO IT4',
        },
      ],
    },
    {
      id: 'PRT-RNG-301',
      partName: 'Internal Annulus Ring Gear (Splined)',
      material: 'AISI 4340 Nitrided Alloy',
      quantity: 1,
      complexityFactor: 8.5,
      toleranceGrade: 'ISO IT5',
    },
    {
      id: 'PRT-HSG-401',
      partName: 'Cast Aluminum Flanged Gear Housing',
      material: 'A380 Die-Cast Aluminum Alloy',
      quantity: 1,
      complexityFactor: 6.2,
      toleranceGrade: 'ISO IT7',
    },
  ],
};

export const BOMIntegrationView: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<BOMNode>(SAMPLE_BOM_TREE);

  const renderBOMItem = (node: BOMNode, depth = 0) => {
    const isSelected = selectedNode.id === node.id;
    return (
      <div key={node.id} className="space-y-1">
        <div
          onClick={() => setSelectedNode(node)}
          style={{ paddingLeft: `${depth * 1.25 + 0.75}rem` }}
          className={`flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer transition-all ${
            isSelected
              ? 'bg-amber-50 text-amber-900 border border-amber-300 font-semibold shadow-2xs'
              : 'hover:bg-slate-100 text-slate-700'
          }`}
        >
          <div className="flex items-center gap-2 truncate">
            <span className="font-mono text-slate-900 font-semibold text-[11px] shrink-0">{node.id}</span>
            <span className="truncate">{node.partName}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] text-slate-500">Qty: {node.quantity}</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-white text-slate-800 border border-slate-300 shadow-2xs">
              DC: {node.complexityFactor}
            </span>
          </div>
        </div>
        {node.children && (
          <div className="space-y-1 border-l border-slate-200 ml-4">
            {node.children.map((child) => renderBOMItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-slate-200/90 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-900 text-white uppercase tracking-wider shadow-2xs">
                Phase 2 Architecture &amp; PLM Blueprint
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                BOM Integration &amp; PTC Windchill Roadmap
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Demonstrates how Product Bill of Materials (BOM) data extracts component hierarchy, part count, and material properties into the <strong>Design Complexity</strong> parameter, and maps the planned <strong>Creo &rarr; Windchill &rarr; AI Decision Engine</strong> enterprise bridge.
            </p>
          </div>

          <div className="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-300 text-xs text-amber-800 shrink-0 font-medium shadow-2xs">
            Status: Planned Integration (Future Work)
          </div>
        </div>
      </div>

      {/* Critical Architecture Rules Card */}
      <div className="bg-white/90 backdrop-blur-md rounded-xl p-4 border border-slate-200 shadow-xs">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-700 space-y-1 leading-relaxed">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs">
              Academic Architecture Principle: Single Source vs. Multi-Stage Lifecycle
            </h4>
            <p>
              A common misconception is that a CAD or BOM file contains all seven lifecycle parameters. In mechanical engineering reality, a <strong>BOM only provides component count, assembly structure, materials, and tolerance requirements</strong> &mdash; which determine <strong>Design Complexity</strong>.
            </p>
            <p className="text-slate-500">
              The remaining six parameters (Manufacturing Defects, Supplier Quality, Warranty Claims, Safety Compliance, Maintenance Costs, and Tool Wear) originate across ERP, MES, IoT smart sensors, and Field Service databases. The AI Decision Engine acts as the unified integration layer.
            </p>
          </div>
        </div>
      </div>

      {/* Visual Target Architecture Diagram */}
      <div className="bg-white/95 backdrop-blur-md rounded-xl border border-slate-200 p-5 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-4 flex items-center justify-between">
          <span>Enterprise PLM Integration Architecture (Target Implementation)</span>
          <span className="font-mono text-slate-700 text-[11px] font-semibold">Creo &bull; Windchill &bull; REST API &bull; Random Forest</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-center text-xs">
          {/* Node 1: CAD & BOM */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between shadow-2xs">
            <div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-slate-700 border border-slate-300 uppercase block w-fit mx-auto mb-2">
                CAD Source
              </span>
              <h4 className="font-bold text-slate-900 text-sm">PTC Creo</h4>
              <p className="text-[11px] text-slate-500 mt-1">
                3D CAD models, GD&amp;T, surface geometry, feature count &amp; CAD assembly constraints.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-200 text-[10px] text-slate-600 font-mono font-medium">
              Feeds Design Complexity
            </div>
          </div>

          {/* Node 2: PLM System */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between shadow-2xs">
            <div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-slate-700 border border-slate-300 uppercase block w-fit mx-auto mb-2">
                PLM Backbone
              </span>
              <h4 className="font-bold text-slate-900 text-sm">PTC Windchill</h4>
              <p className="text-[11px] text-slate-500 mt-1">
                Engineering BOM (eBOM), manufacturing BOM (mBOM), revision history &amp; change workflow state.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-200 text-[10px] text-slate-600 font-mono font-medium">
              PLM Data Repository
            </div>
          </div>

          {/* Node 3: Middleware API */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between shadow-2xs">
            <div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-slate-700 border border-slate-300 uppercase block w-fit mx-auto mb-2">
                Integration API
              </span>
              <h4 className="font-bold text-slate-900 text-sm">Central Backend</h4>
              <p className="text-[11px] text-slate-500 mt-1">
                REST / OData endpoint harvesting lifecycle data (ERP, MES, IoT, warranty claims).
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-200 text-[10px] text-slate-600 font-mono font-medium">
              7 Feature Aggregator
            </div>
          </div>

          {/* Node 4: AI Decision Engine */}
          <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-300 flex flex-col justify-between shadow-2xs">
            <div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 uppercase block w-fit mx-auto mb-2">
                Core Engine
              </span>
              <h4 className="font-bold text-slate-900 text-sm">Random Forest</h4>
              <p className="text-[11px] text-slate-600 mt-1">
                Supervised classification determining Product Health, Risk Level &amp; ECR (YES/NO).
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-amber-200 text-[10px] text-amber-800 font-mono font-bold">
              ECR Decision YES/NO
            </div>
          </div>

          {/* Node 5: ECR Action */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between shadow-2xs">
            <div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-slate-700 border border-slate-300 uppercase block w-fit mx-auto mb-2">
                Change Workflow
              </span>
              <h4 className="font-bold text-slate-900 text-sm">Windchill ECR/ECO</h4>
              <p className="text-[11px] text-slate-500 mt-1">
                Automated change docket populated in Windchill for lead engineering review &amp; signoff.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-200 text-[10px] text-slate-600 font-mono font-medium">
              Closed-Loop Review
            </div>
          </div>
        </div>
      </div>

      {/* Interactive BOM Structure Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Tree Viewer */}
        <div className="lg:col-span-6 bg-white/95 backdrop-blur-md rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-slate-700" />
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Engineering BOM Hierarchy Tree
              </h3>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">
              Click node to inspect
            </span>
          </div>

          <div className="space-y-1 bg-slate-50/80 p-3 rounded-xl border border-slate-200 max-h-[380px] overflow-y-auto">
            {renderBOMItem(SAMPLE_BOM_TREE)}
          </div>
        </div>

        {/* Right: Selected Node Metadata & Design Complexity Breakdown */}
        <div className="lg:col-span-6 bg-white/95 backdrop-blur-md rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              CAD &amp; BOM Feature Extraction Details
            </h3>
            <span className="font-mono text-slate-800 text-xs font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              {selectedNode.id}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Component Name:</span>
              <span className="text-slate-900 font-semibold text-sm">{selectedNode.partName}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[11px]">Material Grade:</span>
                <span className="text-slate-800 font-medium">{selectedNode.material}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[11px]">Tolerance Specification:</span>
                <span className="text-slate-800 font-medium">{selectedNode.toleranceGrade}</span>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-[11px]">Derived Design Complexity:</span>
                <span className="font-mono text-amber-700 font-extrabold text-base">
                  {selectedNode.complexityFactor} / 10
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2 overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full"
                  style={{ width: `${selectedNode.complexityFactor * 10}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                Computed via part count, geometric feature density, and tight ISO IT tolerance requirements. In full PLM deployment, PTC Windchill API will deliver this automatically.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
