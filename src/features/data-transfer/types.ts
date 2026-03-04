export type ImportFileType = 'csv' | 'xlsx';

export interface ImportUploadResponse {
  jobId: string;
  sourceColumns: string[];
  sampleRows: Record<string, string>[];
  detectedMappings?: ColumnMapping[];
}

export interface ColumnMapping {
  sourceColumn: string;
  targetField: string;
  required?: boolean;
}

export interface ImportValidationIssue {
  rowNumber: number;
  column: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface ImportValidationResult {
  issues: ImportValidationIssue[];
  canProceed: boolean;
}

export interface SubmitImportPayload {
  jobId: string;
  mappings: ColumnMapping[];
  dryRun?: boolean;
}

export interface ImportJobStatus {
  jobId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  processedRows: number;
  importedRows: number;
  failedRows: number;
  startedAt: string;
  completedAt?: string;
  issues?: ImportValidationIssue[];
}

export interface ExportInventoryPayload {
  format: 'csv' | 'xlsx';
  includeSupplierData?: boolean;
  locationIds?: string[];
}
