import React, { useState, useRef } from 'react';
import { ProductRecord, RiskLevel, ECRDecision } from '../types/plm';
import {
  parseEngineeringCSV,
  exportProductsToCSV,
  generateTemplateCSV,
  getProcessedInitialProducts
} from '../utils/sampleData';
import {
  Upload,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  RefreshCw,
  Eye,
  FileDown,
  Info,
  ShieldCheck,
  TrendingDown,
  Layers
} from 'lucide-react';

interface UploadModeProps {
  onSelectProduct: (product: ProductRecord) => void;
}

export const UploadMode: React.FC<UploadModeProps> = ({ onSelectProduct }) => {
  const [products, setProducts] = useState<ProductRecord[]>(getProcessedInitialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterECR, setFilterECR] = useState<'ALL' | ECRDecision>('ALL');
  const [filterRisk, setFilterRisk] = useState<'ALL' | RiskLevel>('ALL');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Summary Metrics calculations
  const totalAnalyzed = products.length;
  const ecrYesCount = products.filter(p => p.prediction?.ecrRequired === 'YES').length;
  const ecrNoCount = products.filter(p => p.prediction?.ecrRequired === 'NO').length;
  const avgHealthScore = totalAnalyzed > 0
    ? Math.round(products.reduce((acc, p) => acc + (p.prediction?.productHealthScore || 0), 0) / totalAnalyzed)
    : 0;
  const highRiskCount = products.filter(p =>
    p.prediction?.riskLevel === 'High' || p.prediction?.riskLevel === 'Critical'
  ).length;

  const handleFileUpload = (file: File) => {
    setUploadError(null);
    setUploadSuccess(null);

    if (!file.name.endsWith('.csv') && !file.name.endsWith('.txt') && !file.name.endsWith('.tsv')) {
      setUploadError('Please upload a standard CSV (.csv) or text (.txt) file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const { records, errors } = parseEngineeringCSV(text);

        if (errors.length > 0 && records.length === 0) {
          setUploadError(errors.join(' '));
          return;
        }

        setProducts(records);
        setUploadSuccess(`Successfully extracted 7 lifecycle parameters and executed Random Forest classification across ${records.length} engineering records!`);
      } catch (err: any) {
        setUploadError(`Failed to process file: ${err.message || 'Corrupt format'}`);
      }
    };
    reader.onerror = () => {
      setUploadError('Error reading uploaded file.');
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDownloadTemplate = () => {
    const csvContent = generateTemplateCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'PLM_Engineering_Data_Template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportResults = () => {
    const csvContent = exportProductsToCSV(products);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PLM_ECR_Predictions_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleResetToSample = () => {
    setProducts(getProcessedInitialProducts());
    setUploadError(null);
    setUploadSuccess('Reloaded default 12 mechanical engineering product lot records.');
  };

  // Filtered products
  const filteredProducts = products.filter(p => {
    const matchesSearch =
      p.productId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.prediction?.primaryInfluencer || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesECR = filterECR === 'ALL' || p.prediction?.ecrRequired === filterECR;
    const matchesRisk = filterRisk === 'ALL' || p.prediction?.riskLevel === filterRisk;

    return matchesSearch && matchesECR && matchesRisk;
  });

  return (
    <div className="space-y-6">
      {/* Introduction & Workflow Banner */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-slate-200/90 shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-900 text-white uppercase tracking-wider shadow-2xs">
                Phase 1 Core Feature
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Engineering Data Upload Mode
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Upload multi-stage engineering lifecycle files (CSV/Excel) containing the 7 core parameters. The AI Decision Engine automatically parses the parameters, invokes the supervised <strong>Random Forest Classifier</strong>, computes Product Health &amp; Risk, and outputs actionable ECR determinations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={handleDownloadTemplate}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 transition-all shadow-2xs"
              title="Download standard CSV structure with headers"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Download CSV Template</span>
            </button>
            <button
              onClick={handleResetToSample}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 transition-all shadow-2xs"
              title="Reload pre-configured mechanical batch data"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-600" />
              <span>Reset Sample Batch</span>
            </button>
          </div>
        </div>

        {/* Drag and Drop Upload Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`mt-4 border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-indigo-500 bg-indigo-50/60 scale-[1.005]'
              : 'border-slate-300 hover:border-slate-400 bg-slate-50/70 hover:bg-slate-50'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
            accept=".csv,.txt,.tsv"
            className="hidden"
          />
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="p-3 rounded-full bg-slate-200/80 text-slate-700 shadow-2xs">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">
                Click to browse or drag &amp; drop engineering CSV file
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Columns: <code className="text-slate-700 font-mono text-[11px] bg-slate-200/60 px-1 py-0.5 rounded border border-slate-300">Product_ID, Design_Complexity, Manufacturing_Defects, Supplier_Quality, Warranty_Claims, Safety_Compliance, Maintenance_Cost, Tool_Wear_Telemetry</code>
              </p>
            </div>
          </div>
        </div>

        {uploadError && (
          <div className="mt-3 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{uploadError}</span>
          </div>
        )}

        {uploadSuccess && (
          <div className="mt-3 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{uploadSuccess}</span>
          </div>
        )}
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        <div className="bg-white/90 backdrop-blur-md p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Total Analyzed</span>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-2xl font-extrabold font-mono text-slate-900">{totalAnalyzed}</span>
            <span className="text-[11px] text-slate-500">Products</span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">Batch Lot Evaluated</span>
        </div>

        <div className="bg-white/90 backdrop-blur-md p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">ECR Required</span>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-2xl font-extrabold font-mono text-rose-600">{ecrYesCount}</span>
            <span className="text-[11px] text-rose-600/90 font-mono font-semibold">
              ({totalAnalyzed > 0 ? Math.round((ecrYesCount / totalAnalyzed) * 100) : 0}%)
            </span>
          </div>
          <span className="text-[11px] text-rose-600 block mt-1 font-medium">Flagged for Change</span>
        </div>

        <div className="bg-white/90 backdrop-blur-md p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">No Change Required</span>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-2xl font-extrabold font-mono text-emerald-600">{ecrNoCount}</span>
            <span className="text-[11px] text-emerald-600/90 font-mono font-semibold">
              ({totalAnalyzed > 0 ? Math.round((ecrNoCount / totalAnalyzed) * 100) : 0}%)
            </span>
          </div>
          <span className="text-[11px] text-emerald-600 block mt-1 font-medium">Nominal Health</span>
        </div>

        <div className="bg-white/90 backdrop-blur-md p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Avg Product Health</span>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className={`text-2xl font-extrabold font-mono ${
              avgHealthScore >= 80 ? 'text-emerald-600' :
              avgHealthScore >= 60 ? 'text-amber-600' : 'text-rose-600'
            }`}>
              {avgHealthScore}
            </span>
            <span className="text-[11px] text-slate-500">/ 100</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden border border-slate-200">
            <div
              className={`h-full ${
                avgHealthScore >= 80 ? 'bg-emerald-500' :
                avgHealthScore >= 60 ? 'bg-amber-500' : 'bg-rose-500'
              }`}
              style={{ width: `${avgHealthScore}%` }}
            />
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-md p-4 rounded-xl border border-slate-200 shadow-xs col-span-2 sm:col-span-1">
          <span className="text-xs font-semibold text-slate-500 block">High / Critical Risk</span>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-2xl font-extrabold font-mono text-amber-600">{highRiskCount}</span>
            <span className="text-[11px] text-amber-700 font-medium">Units</span>
          </div>
          <span className="text-[11px] text-amber-600 block mt-1 font-medium">Urgent Lifecycle Action</span>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white/90 backdrop-blur-md p-3.5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Product ID, Name, or Influencer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-500"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-medium">ECR:</span>
            <select
              value={filterECR}
              onChange={(e) => setFilterECR(e.target.value as any)}
              className="bg-slate-50 border border-slate-300 text-slate-800 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-slate-500 font-medium"
            >
              <option value="ALL">All Status</option>
              <option value="YES">ECR: YES</option>
              <option value="NO">ECR: NO</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="font-medium">Risk:</span>
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value as any)}
              className="bg-slate-50 border border-slate-300 text-slate-800 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-slate-500 font-medium"
            >
              <option value="ALL">All Risks</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <button
            onClick={handleExportResults}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-colors"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Download Prediction CSV</span>
          </button>
        </div>
      </div>

      {/* Main Results Table */}
      <div className="bg-white/95 backdrop-blur-md rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100/90 text-slate-600 uppercase tracking-wider text-[11px] border-b border-slate-200 font-bold">
              <tr>
                <th scope="col" className="px-4 py-3.5">Product ID &amp; Name</th>
                <th scope="col" className="px-4 py-3.5 text-center">Product Health</th>
                <th scope="col" className="px-4 py-3.5 text-center">Risk Level</th>
                <th scope="col" className="px-4 py-3.5 text-center">Engineering Change</th>
                <th scope="col" className="px-4 py-3.5">Primary Influencer</th>
                <th scope="col" className="px-4 py-3.5">Recommended Action</th>
                <th scope="col" className="px-4 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                    <Info className="w-6 h-6 mx-auto mb-2 text-slate-400" />
                    No engineering records match the current filter or search criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const pred = p.prediction;
                  const isECR = pred?.ecrRequired === 'YES';
                  return (
                    <tr
                      key={p.productId}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Product ID & Name */}
                      <td className="px-4 py-3.5">
                        <div className="font-mono font-bold text-slate-900 text-xs">
                          {p.productId}
                        </div>
                        <div className="text-slate-700 font-medium text-xs truncate max-w-[220px]">
                          {p.productName}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Defects: {p.parameters.manufacturingDefects} | Safety: {p.parameters.safetyCompliance}% | Claims: {p.parameters.warrantyClaims}
                        </div>
                      </td>

                      {/* Product Health */}
                      <td className="px-4 py-3.5 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span className={`font-mono text-sm font-bold ${
                            (pred?.productHealthScore ?? 0) >= 80 ? 'text-emerald-600' :
                            (pred?.productHealthScore ?? 0) >= 60 ? 'text-amber-600' : 'text-rose-600'
                          }`}>
                            {pred?.productHealthScore}
                          </span>
                          <div className="w-12 bg-slate-200 rounded-full h-1 mt-1 overflow-hidden">
                            <div
                              className={`h-full ${
                                (pred?.productHealthScore ?? 0) >= 80 ? 'bg-emerald-500' :
                                (pred?.productHealthScore ?? 0) >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                              }`}
                              style={{ width: `${pred?.productHealthScore ?? 0}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Risk Level */}
                      <td className="px-4 py-3.5 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase ${
                          pred?.riskLevel === 'Low' ? 'bg-emerald-50 text-emerald-700 border border-emerald-300' :
                          pred?.riskLevel === 'Medium' ? 'bg-amber-50 text-amber-700 border border-amber-300' :
                          pred?.riskLevel === 'High' ? 'bg-rose-50 text-rose-700 border border-rose-300' :
                          'bg-red-100 text-red-800 border border-red-400 animate-pulse'
                        }`}>
                          {pred?.riskLevel}
                        </span>
                      </td>

                      {/* Engineering Change Required */}
                      <td className="px-4 py-3.5 text-center">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                          isECR
                            ? 'bg-rose-100 text-rose-800 border border-rose-300 shadow-2xs'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs'
                        }`}>
                          {isECR ? <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> : <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                          <span>{pred?.ecrRequired}</span>
                        </span>
                        <div className="text-[10px] text-slate-500 mt-1 font-mono">
                          {pred?.confidence}% conf ({pred?.treeVotes.yes}/{pred?.treeVotes.total} trees)
                        </div>
                      </td>

                      {/* Primary Influencer */}
                      <td className="px-4 py-3.5">
                        <span className="font-mono text-xs text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {pred?.primaryInfluencer}
                        </span>
                      </td>

                      {/* Recommended Action */}
                      <td className="px-4 py-3.5 max-w-[280px]">
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed" title={pred?.recommendedAction}>
                          {pred?.recommendedAction}
                        </p>
                      </td>

                      {/* Action */}
                      <td className="px-4 py-3.5 text-right">
                        <button
                          onClick={() => onSelectProduct(p)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-2xs"
                          title="Open detailed lifecycle breakdown and ECR dossier"
                        >
                          <Eye className="w-3 h-3" />
                          <span>ECR Dossier</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer with stats */}
        <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <span>Showing {filteredProducts.length} of {products.length} product records</span>
          <span className="font-mono text-[11px] text-slate-500">
            Random Forest Classifier Ensemble (15 Decision Trees) &bull; Supervised Learning
          </span>
        </div>
      </div>
    </div>
  );
};
