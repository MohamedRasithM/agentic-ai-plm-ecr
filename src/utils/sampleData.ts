import { ProductRecord, EngineeringParameters } from '../types/plm';
import { predictEngineeringChange } from './mlEngine';

export const INITIAL_SAMPLE_PRODUCTS: Omit<ProductRecord, 'prediction'>[] = [
  {
    productId: 'PRD-HYD-101',
    productName: 'Hydraulic Directional Spool Valve 350-Bar',
    parameters: {
      designComplexity: 6.8,
      manufacturingDefects: 6,
      supplierQuality: 82,
      warrantyClaims: 4,
      safetyCompliance: 91,
      maintenanceCost: 2650,
      toolWearTelemetry: 68,
    },
    batchLot: 'LOT-2026-B01',
  },
  {
    productId: 'PRD-PMP-204',
    productName: 'Centrifugal Slurry Impeller Pump 15kW',
    parameters: {
      designComplexity: 3.4,
      manufacturingDefects: 1,
      supplierQuality: 96,
      warrantyClaims: 0,
      safetyCompliance: 99,
      maintenanceCost: 650,
      toolWearTelemetry: 18,
    },
    batchLot: 'LOT-2026-A14',
  },
  {
    productId: 'PRD-GBX-308',
    productName: 'Two-Stage Epicyclic Planetary Gearbox',
    parameters: {
      designComplexity: 8.2,
      manufacturingDefects: 7,
      supplierQuality: 74,
      warrantyClaims: 5,
      safetyCompliance: 84,
      maintenanceCost: 3800,
      toolWearTelemetry: 79,
    },
    batchLot: 'LOT-2026-C09',
  },
  {
    productId: 'PRD-ACT-412',
    productName: 'Linear Electric Ball-Screw Actuator',
    parameters: {
      designComplexity: 5.1,
      manufacturingDefects: 2,
      supplierQuality: 91,
      warrantyClaims: 1,
      safetyCompliance: 96,
      maintenanceCost: 1100,
      toolWearTelemetry: 32,
    },
    batchLot: 'LOT-2026-A22',
  },
  {
    productId: 'PRD-BRK-520',
    productName: 'Ventilated Dual-Piston Brake Caliper',
    parameters: {
      designComplexity: 7.5,
      manufacturingDefects: 8,
      supplierQuality: 69,
      warrantyClaims: 6,
      safetyCompliance: 78,
      maintenanceCost: 4100,
      toolWearTelemetry: 84,
    },
    batchLot: 'LOT-2026-D03',
  },
  {
    productId: 'PRD-CPG-611',
    productName: 'Flexible Disc Shaft Coupling 5000-RPM',
    parameters: {
      designComplexity: 2.8,
      manufacturingDefects: 0,
      supplierQuality: 98,
      warrantyClaims: 0,
      safetyCompliance: 98,
      maintenanceCost: 450,
      toolWearTelemetry: 12,
    },
    batchLot: 'LOT-2026-A05',
  },
  {
    productId: 'PRD-TRB-703',
    productName: 'Inconel High-Pressure Turbine Nozzle Vane',
    parameters: {
      designComplexity: 9.4,
      manufacturingDefects: 5,
      supplierQuality: 88,
      warrantyClaims: 3,
      safetyCompliance: 89,
      maintenanceCost: 4900,
      toolWearTelemetry: 72,
    },
    batchLot: 'LOT-2026-T11',
  },
  {
    productId: 'PRD-CMP-815',
    productName: 'Twin Rotary Screw Air Compressor Block',
    parameters: {
      designComplexity: 6.2,
      manufacturingDefects: 3,
      supplierQuality: 89,
      warrantyClaims: 1,
      safetyCompliance: 95,
      maintenanceCost: 1450,
      toolWearTelemetry: 44,
    },
    batchLot: 'LOT-2026-B19',
  },
  {
    productId: 'PRD-HEX-921',
    productName: 'Shell and Tube Marine Heat Exchanger',
    parameters: {
      designComplexity: 4.5,
      manufacturingDefects: 2,
      supplierQuality: 85,
      warrantyClaims: 2,
      safetyCompliance: 92,
      maintenanceCost: 1750,
      toolWearTelemetry: 38,
    },
    batchLot: 'LOT-2026-H04',
  },
  {
    productId: 'PRD-ROB-105',
    productName: '6-Axis Industrial Articulated Joint Module',
    parameters: {
      designComplexity: 8.9,
      manufacturingDefects: 9,
      supplierQuality: 71,
      warrantyClaims: 7,
      safetyCompliance: 76,
      maintenanceCost: 4600,
      toolWearTelemetry: 88,
    },
    batchLot: 'LOT-2026-R08',
  },
  {
    productId: 'PRD-CYL-219',
    productName: 'Double-Acting Heavy Tie-Rod Cylinder',
    parameters: {
      designComplexity: 4.0,
      manufacturingDefects: 1,
      supplierQuality: 94,
      warrantyClaims: 0,
      safetyCompliance: 97,
      maintenanceCost: 820,
      toolWearTelemetry: 22,
    },
    batchLot: 'LOT-2026-A30',
  },
  {
    productId: 'PRD-VLV-334',
    productName: 'Cryogenic High-Pressure Gate Valve',
    parameters: {
      designComplexity: 7.1,
      manufacturingDefects: 4,
      supplierQuality: 83,
      warrantyClaims: 3,
      safetyCompliance: 86,
      maintenanceCost: 2800,
      toolWearTelemetry: 61,
    },
    batchLot: 'LOT-2026-V12',
  },
];

export function getProcessedInitialProducts(): ProductRecord[] {
  return INITIAL_SAMPLE_PRODUCTS.map(p => ({
    ...p,
    prediction: predictEngineeringChange(p.parameters),
  }));
}

/**
 * Generate CSV text representation of products
 */
export function exportProductsToCSV(products: ProductRecord[]): string {
  const headers = [
    'Product_ID',
    'Product_Name',
    'Design_Complexity',
    'Manufacturing_Defects',
    'Supplier_Quality',
    'Warranty_Claims',
    'Safety_Compliance',
    'Maintenance_Cost',
    'Tool_Wear_Telemetry',
    'Product_Health_Score',
    'Risk_Level',
    'ECR_Required',
    'Confidence_Percent',
    'Primary_Influencer',
    'Recommended_Action',
  ];

  const rows = products.map(p => {
    const pred = p.prediction;
    return [
      `"${p.productId}"`,
      `"${p.productName.replace(/"/g, '""')}"`,
      p.parameters.designComplexity,
      p.parameters.manufacturingDefects,
      p.parameters.supplierQuality,
      p.parameters.warrantyClaims,
      p.parameters.safetyCompliance,
      p.parameters.maintenanceCost,
      p.parameters.toolWearTelemetry,
      pred?.productHealthScore ?? '',
      `"${pred?.riskLevel ?? ''}"`,
      `"${pred?.ecrRequired ?? ''}"`,
      pred?.confidence ?? '',
      `"${pred?.primaryInfluencer ?? ''}"`,
      `"${(pred?.recommendedAction ?? '').replace(/"/g, '""')}"`,
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}

/**
 * Generates an empty / sample template CSV for upload
 */
export function generateTemplateCSV(): string {
  return [
    'Product_ID,Product_Name,Design_Complexity,Manufacturing_Defects,Supplier_Quality,Warranty_Claims,Safety_Compliance,Maintenance_Cost,Tool_Wear_Telemetry',
    'P001,Hydraulic Pump Housing,6.5,4,85,2,91,1500,35',
    'P002,Spur Gear Assembly,3.2,1,96,0,98,700,12',
    'P003,Turbine Rotor Blade,8.8,6,74,5,82,3400,75',
    'P004,Shaft Retaining Flange,2.5,0,98,0,100,420,10',
    'P005,Safety Relief Valve,7.2,5,79,3,76,2600,68',
  ].join('\n');
}

/**
 * Robust CSV parser that handles various common header synonyms
 */
export function parseEngineeringCSV(csvText: string): { records: ProductRecord[]; errors: string[] } {
  const lines = csvText
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => l.length > 0);

  if (lines.length < 2) {
    return { records: [], errors: ['CSV file is empty or missing data rows.'] };
  }

  // Parse header
  const headerTokens = parseCSVLine(lines[0]).map(h =>
    h.toLowerCase().replace(/[\s\-_()]/g, '')
  );

  // Helper to find column index with aliases
  const findCol = (aliases: string[]) => {
    return headerTokens.findIndex(h => aliases.some(alias => h.includes(alias)));
  };

  const idCol = findCol(['productid', 'id', 'partno', 'partnumber', 'item']);
  const nameCol = findCol(['productname', 'name', 'description', 'partname']);
  const dcCol = findCol(['designcomplexity', 'complexity', 'dc']);
  const mdCol = findCol(['manufacturingdefects', 'defects', 'defectcount', 'mfgdefects']);
  const sqCol = findCol(['supplierquality', 'supplier', 'supplierrating', 'sq']);
  const wcCol = findCol(['warrantyclaims', 'warranty', 'fieldclaims', 'claims']);
  const scCol = findCol(['safetycompliance', 'safety', 'compliance', 'safetyscore']);
  const mcCol = findCol(['maintenancecost', 'maintenance', 'maintcost', 'cost']);
  const twCol = findCol(['toolwear', 'telemetry', 'anomaly', 'toolweartelemetry', 'telemetryanomaly']);

  const errors: string[] = [];
  const records: ProductRecord[] = [];

  for (let i = 1; i < lines.length; i++) {
    const rawTokens = parseCSVLine(lines[i]);
    if (rawTokens.length < 3) continue;

    const rowNum = i + 1;
    const productId = idCol !== -1 && rawTokens[idCol] ? rawTokens[idCol].trim() : `P${String(i).padStart(3, '0')}`;
    const productName = nameCol !== -1 && rawTokens[nameCol] ? rawTokens[nameCol].trim() : `Component Batch ${productId}`;

    const num = (colIdx: number, defaultVal: number, min: number, max: number) => {
      if (colIdx === -1 || !rawTokens[colIdx]) return defaultVal;
      const parsed = parseFloat(rawTokens[colIdx].replace(/[^\d.-]/g, ''));
      if (isNaN(parsed)) return defaultVal;
      return Math.max(min, Math.min(max, parsed));
    };

    const params: EngineeringParameters = {
      designComplexity: num(dcCol, 5.0, 1, 10),
      manufacturingDefects: Math.round(num(mdCol, 0, 0, 100)),
      supplierQuality: num(sqCol, 90, 0, 100),
      warrantyClaims: Math.round(num(wcCol, 0, 0, 100)),
      safetyCompliance: num(scCol, 95, 0, 100),
      maintenanceCost: Math.round(num(mcCol, 1000, 0, 50000)),
      toolWearTelemetry: num(twCol, 20, 0, 100),
    };

    const prediction = predictEngineeringChange(params);

    records.push({
      productId,
      productName,
      parameters: params,
      prediction,
      batchLot: `LOT-IMP-${rowNum}`,
    });
  }

  if (records.length === 0) {
    errors.push('No valid engineering records could be extracted. Please check header columns.');
  }

  return { records, errors };
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}
