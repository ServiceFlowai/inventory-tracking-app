import {
  ColumnMapping,
  ExportInventoryPayload,
  ImportJobStatus,
  ImportUploadResponse,
  ImportValidationResult,
  SubmitImportPayload,
} from './types';

const DATA_TRANSFER_BASE_URL = '/api/data-transfer';

async function request<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    credentials: 'include',
    ...init,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message ?? 'Request failed');
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function uploadImportFile(file: File): Promise<ImportUploadResponse> {
  const formData = new FormData();
  formData.append('file', file);
  return request<ImportUploadResponse>(`${DATA_TRANSFER_BASE_URL}/import/upload`, {
    method: 'POST',
    body: formData,
  });
}

export async function validateImportMappings(jobId: string, mappings: ColumnMapping[]): Promise<ImportValidationResult> {
  return request<ImportValidationResult>(`${DATA_TRANSFER_BASE_URL}/import/${jobId}/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mappings }),
  });
}

export async function submitImport(payload: SubmitImportPayload): Promise<ImportJobStatus> {
  return request<ImportJobStatus>(`${DATA_TRANSFER_BASE_URL}/import/${payload.jobId}/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function fetchImportStatus(jobId: string): Promise<ImportJobStatus> {
  return request<ImportJobStatus>(`${DATA_TRANSFER_BASE_URL}/import/${jobId}/status`);
}

export async function exportInventorySnapshot(payload: ExportInventoryPayload): Promise<Response> {
  return fetch(`${DATA_TRANSFER_BASE_URL}/export/snapshot`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}
