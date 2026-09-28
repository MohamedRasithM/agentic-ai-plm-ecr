/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { UploadMode } from './components/UploadMode';
import { ManualDemoMode } from './components/ManualDemoMode';
import { BOMIntegrationView } from './components/BOMIntegrationView';
import { ModelEvaluationView } from './components/ModelEvaluationView';
import { ECRModal } from './components/ECRModal';
import { ProductRecord } from './types/plm';
import lightBg from './assets/images/attractive_light_blueprint_1790586371769.jpg';

export default function App() {
  const [activeTab, setActiveTab] = useState<'upload' | 'manual' | 'bom' | 'metrics'>('upload');
  const [selectedProduct, setSelectedProduct] = useState<ProductRecord | null>(null);

  return (
    <div className="min-h-screen text-slate-800 flex flex-col font-sans selection:bg-amber-500 selection:text-white relative bg-[#fcfcfd]">
      {/* High-Resolution Bright Technical Drafting Canvas */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center bg-no-repeat opacity-85 contrast-105"
        style={{ backgroundImage: `url(${lightBg})` }}
      />

      {/* Subtle Precision Grid and Ambient Light Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-white/70 via-white/50 to-white/75" />

      {/* App Foreground Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation & Header */}
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {activeTab === 'upload' && (
            <UploadMode onSelectProduct={(prod) => setSelectedProduct(prod)} />
          )}

          {activeTab === 'manual' && (
            <ManualDemoMode onOpenECRModal={(prod) => setSelectedProduct(prod)} />
          )}

          {activeTab === 'bom' && <BOMIntegrationView />}

          {activeTab === 'metrics' && <ModelEvaluationView />}
        </main>

        {/* ECR Detailed Dossier Modal */}
        {selectedProduct && (
          <ECRModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}

        {/* Academic Footer */}
        <footer className="bg-white/85 backdrop-blur-md border-t border-slate-200 py-6 text-xs text-slate-500 mt-auto shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left space-y-1">
              <p className="font-bold text-slate-800 text-sm">
                Agentic AI–Driven Product Lifecycle Management (PLM)
              </p>
              <p className="text-slate-500 text-xs">
                Chennai Institute of Technology &bull; Department of Mechanical Engineering &bull; Mohamed Farhan M &amp; Mohamed Rasith M &bull; Guide: Balamurugan
              </p>
            </div>
            <div className="text-center sm:text-right text-xs">
              <span className="inline-block px-3 py-1 rounded-full bg-slate-100 border border-slate-300 text-slate-700 font-mono font-medium shadow-xs">
                Prototype Evaluation &bull; Supervised Random Forest Classifier
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
