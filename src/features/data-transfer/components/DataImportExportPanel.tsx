import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { exportInventorySnapshot, fetchImportStatus, submitImport, uploadImportFile, validateImportMappings } from '../api';
import {
  ColumnMapping,
  ImportJobStatus,
  ImportUploadResponse,
  ImportValidationIssue,
  ImportValidationResult,
  ImportFileType,
} from '../types';
import ColumnMapper from './ColumnMapper';
import ImportPreviewTable from './ImportPreviewTable';
import ValidationIssueList from './ValidationIssueList';
import { inferMappings, mergeMappings, isMappingComplete } from '../utils';

const TARGET_FIELDS: { field: string; label: string; required?: boolean }[] = [
  { field: 'sku', label: 'SKU', required: true },
  { field: 'name', label: 'Item Name', required: true },
  { field: 'quantity_on_hand', label: 'Quantity On Hand', required: true },
  { field: 'reorder_point', label: 'Reorder Point' },
  { field: 'supplier_name', label: 'Supplier Name' },
  { field: 'location', label: 'Location', required: true },
  { field: 'unit_cost', label: 'Unit Cost' },
];

const REQUIRED_FIELDS = TARGET_FIELDS.filter((field) => field.required).map((field) => field.field);

const DataImportExportPanel: React.FC = () => {
  const [fileType, setFileType] = useState<ImportFileType>('csv');
  const [uploadState, setUploadState] = useState<ImportUploadResponse | null>(null);
  const [mappings, setMappings] = useState<ColumnMapping[]>([]);
  const [validation, setValidation] = useState<ImportValidationResult | null>(null);
  const [jobStatus, setJobStatus] = useState<ImportJobStatus | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progressError, setProgressError] = useState<string>();
  const [exportFormat, setExportFormat] = useState<'csv' | 'xlsx'>('csv');
  const [isPollingStatus, setIsPollingStatus] = useState(false);

  useEffect(() => {
    let interval: number | undefined;
    if (jobStatus && ['pending', 'processing'].includes(jobStatus.status)) {
      setIsPollingStatus(true);
      interval = window.setInterval(async () => {
        const status = await fetchImportStatus(jobStatus.jobId);
        setJobStatus(status);
        if (!['pending', 'processing'].includes(status.status)) {
          window.clearInterval(interval);
          setIsPollingStatus(false);
        }
      }, 3000);
    }
    return () => {
      if (interval) window.clearInterval(interval);
    };
  }, [jobStatus]);

  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      try {
        const response = await uploadImportFile(file);
        setUploadState(response);
        const inferred = inferMappings(response.sourceColumns, TARGET_FIELDS.map((field) => field.field));
        const detected = response.detectedMappings ?? [];
        setMappings(mergeMappings(inferred, detected));
        setValidation(null);
        setProgressError(undefined);
      } catch (err) {
        setProgressError(err instanceof Error ? err.message : 'Upload failed');
      }
    },
    []
  );

  const handleValidate = useCallback(async () => {
    if (!uploadState) return;
    try {
      const result = await validateImportMappings(uploadState.jobId, mappings);
      setValidation(result);
      setProgressError(undefined);
    } catch (err) {
      setProgressError(err instanceof Error ? err.message : 'Validation failed');
    }
  }, [uploadState, mappings]);

  const handleSubmit = useCallback(
    async (dryRun: boolean) => {
      if (!uploadState) return;
      setIsSubmitting(true);
      try {
        const status = await submitImport({ jobId: uploadState.jobId, mappings, dryRun });
        setJobStatus(status);
        setProgressError(undefined);
      } catch (err) {
        setProgressError(err instanceof Error ? err.message : 'Import submission failed');
      } finally {
        setIsSubmitting(false);
      }
    },
    [uploadState, mappings]
  );

  const handleExport = useCallback(async () => {
    try {
      const response = await exportInventorySnapshot({ format: exportFormat });
      if (!response.ok) {
        throw new Error('Export failed');
      }
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `inventory-snapshot.${exportFormat}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      setProgressError(err instanceof Error ? err.message : 'Unable to export snapshot');
    }
  }, [exportFormat]);

  const validationIssues = useMemo<ImportValidationIssue[]>(() => validation?.issues ?? [], [validation]);
  const canProceed = useMemo(() => uploadState && isMappingComplete(mappings, REQUIRED_FIELDS), [uploadState, mappings]);

  return (
    <section className="panel" aria-label="Data import and export">
      <header className="panel__header">
        <div>
          <h2>Data Import & Export</h2>
          <p>Move your inventory and supplier data in or out with confidence.</p>
        </div>
      </header>
      <div className="panel__body data-transfer">
        {progressError && <div className="alert alert--error">{progressError}</div>}
        <div className="data-transfer__grid">
          <div className="data-transfer__section">
            <h3>Import Inventory/Supplier Data</h3>
            <p>Upload a CSV or Excel file, map its columns, validate, and import.</p>
            <label className="form-field">
              <span>File format</span>
              <select value={fileType} onChange={(event) => setFileType(event.target.value as ImportFileType)}>
                <option value="csv">CSV</option>
                <option value="xlsx">Excel (.xlsx)</option>
              </select>
            </label>
            <label className="form-field">
              <span>Upload file</span>
              <input
                type="file"
                accept={fileType === 'csv' ? '.csv' : '.xlsx'}
                onChange={handleFileUpload}
              />
            </label>

            {uploadState && (
              <>
                <ColumnMapper
                  sourceColumns={uploadState.sourceColumns}
                  targetFields={TARGET_FIELDS}
                  mappings={mappings}
                  onChange={setMappings}
                  onAutoMap={() => setMappings(inferMappings(uploadState.sourceColumns, TARGET_FIELDS.map((field) => field.field)))}
                />

                {validationIssues.length > 0 && <ValidationIssueList issues={validationIssues} />}

                <div className="data-transfer__actions">
                  <button className="btn btn-secondary" type="button" onClick={handleValidate} disabled={!canProceed}>
                    Validate
                  </button>
                  <button className="btn" type="button" onClick={() => handleSubmit(true)} disabled={isSubmitting || !canProceed}>
                    Dry Run
                  </button>
                  <button className="btn btn-primary" type="button" onClick={() => handleSubmit(false)} disabled={isSubmitting || !canProceed || (validation && !validation.canProceed)}>
                    Import
                  </button>
                </div>

                <div className="panel panel--nested" aria-label="Import preview">
                  <header className="panel__header">
                    <h4>Preview</h4>
                    <span>First {uploadState.sampleRows.length} rows</span>
                  </header>
                  <div className="panel__body">
                    <ImportPreviewTable rows={uploadState.sampleRows} />
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="data-transfer__section">
            <h3>Export Inventory Snapshot</h3>
            <p>Download current inventory positions for archival or reporting.</p>
            <label className="form-field">
              <span>Format</span>
              <select value={exportFormat} onChange={(event) => setExportFormat(event.target.value as 'csv' | 'xlsx')}>
                <option value="csv">CSV</option>
                <option value="xlsx">Excel (.xlsx)</option>
              </select>
            </label>
            <button className="btn btn-primary" type="button" onClick={handleExport}>
              Export Snapshot
            </button>

            {jobStatus && (
              <div className="status-card" aria-live="polite">
                <h4>Last Import Status</h4>
                <dl>
                  <div>
                    <dt>Status</dt>
                    <dd>{jobStatus.status}</dd>
                  </div>
                  <div>
                    <dt>Rows Processed</dt>
                    <dd>{jobStatus.processedRows}</dd>
                  </div>
                  <div>
                    <dt>Rows Imported</dt>
                    <dd>{jobStatus.importedRows}</dd>
                  </div>
                  <div>
                    <dt>Rows Failed</dt>
                    <dd>{jobStatus.failedRows}</dd>
                  </div>
                </dl>
                {isPollingStatus && <div className="status-card__progress">Updating…</div>}
                {jobStatus.issues && jobStatus.issues.length > 0 && <ValidationIssueList issues={jobStatus.issues} />}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DataImportExportPanel;
