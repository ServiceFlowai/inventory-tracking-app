import { DashboardApiParams, DashboardApiResponse, DateRange, StockoutEvent } from './types';

const DASHBOARD_BASE_URL = '/api/dashboard';

async function request<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    ...init,
  });

  if (!response.ok) {
    const message = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(message?.message ?? 'Unable to process request');
  }

  return response.json() as Promise<T>;
}

export async function fetchDashboardSnapshot(params: DashboardApiParams): Promise<DashboardApiResponse> {
  const query = new URLSearchParams();
  query.set('start', params.range.start);
  query.set('end', params.range.end);
  if (params.range.preset) {
    query.set('preset', params.range.preset);
  }
  if (params.locationIds?.length) {
    params.locationIds.forEach((locationId) => query.append('locationId', locationId));
  }
  if (params.includeEvents) {
    query.set('includeEvents', 'true');
  }
  if (params.includeSlowMoving) {
    query.set('includeSlowMoving', 'true');
  }

  return request<DashboardApiResponse>(`${DASHBOARD_BASE_URL}/snapshot?${query.toString()}`);
}

export async function fetchStockoutEvents(range: DateRange, locationId?: string): Promise<StockoutEvent[]> {
  const query = new URLSearchParams();
  query.set('start', range.start);
  query.set('end', range.end);
  if (locationId) {
    query.set('locationId', locationId);
  }
  return request<StockoutEvent[]>(`${DASHBOARD_BASE_URL}/stockout-events?${query.toString()}`);
}

export async function triggerDashboardRefresh(): Promise<void> {
  await request(`${DASHBOARD_BASE_URL}/refresh`, { method: 'POST' });
}
