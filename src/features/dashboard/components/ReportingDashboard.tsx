import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { DashboardSnapshot, DateRange, DateRangePreset } from '../types';
import { fetchDashboardSnapshot, triggerDashboardRefresh } from '../api';
import KpiSummaryCards from './KpiSummaryCards';
import StockoutEventsTable from './StockoutEventsTable';
import SlowMovingSkuList from './SlowMovingSkuList';
import ProgressToTargetPanel from './ProgressToTargetPanel';

interface ReportingDashboardProps {
  defaultRange?: DateRangePreset;
  locationIds?: string[];
}

const presetToRange = (preset: DateRangePreset): DateRange => {
  const now = new Date();
  const end = new Date(now);
  const start = new Date(now);

  switch (preset) {
    case 'TODAY':
      start.setHours(0, 0, 0, 0);
      break;
    case 'LAST_7_DAYS':
      start.setDate(start.getDate() - 6);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case 'LAST_30_DAYS':
      start.setDate(start.getDate() - 29);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case 'LAST_90_DAYS':
      start.setDate(start.getDate() - 89);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case 'CUSTOM':
    default:
      start.setDate(start.getDate() - 6);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
  }

  return { start: start.toISOString(), end: end.toISOString(), preset };
};

const ReportingDashboard: React.FC<ReportingDashboardProps> = ({ defaultRange = 'LAST_30_DAYS', locationIds }) => {
  const [rangePreset, setRangePreset] = useState<DateRangePreset>(defaultRange);
  const [range, setRange] = useState<DateRange>(() => presetToRange(defaultRange));
  const [snapshot, setSnapshot] = useState<DashboardSnapshot | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePresetChange = useCallback((preset: DateRangePreset) => {
    setRangePreset(preset);
    setRange(presetToRange(preset));
  }, []);

  const loadSnapshot = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchDashboardSnapshot({
        range,
        locationIds,
        includeEvents: true,
        includeSlowMoving: true,
      });
      setSnapshot(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load dashboard metrics');
    } finally {
      setIsLoading(false);
    }
  }, [range, locationIds]);

  useEffect(() => {
    loadSnapshot();
  }, [loadSnapshot]);

  const handleRefresh = useCallback(async () => {
    setIsLoading(true);
    try {
      await triggerDashboardRefresh();
      await loadSnapshot();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to refresh dashboard');
    } finally {
      setIsLoading(false);
    }
  }, [loadSnapshot]);

  const rangeLabel = useMemo(() => {
    const start = new Date(range.start).toLocaleDateString();
    const end = new Date(range.end).toLocaleDateString();
    return `${start} — ${end}`;
  }, [range]);

  return (
    <div className="reporting-dashboard">
      <header className="reporting-dashboard__header">
        <div>
          <h1>Inventory Performance Dashboard</h1>
          <p className="reporting-dashboard__subtitle">Stockouts, turnover, and progress to goal in one place.</p>
        </div>
        <div className="reporting-dashboard__filters">
          <label className="form-field">
            <span>Date Range</span>
            <select value={rangePreset} onChange={(event) => handlePresetChange(event.target.value as DateRangePreset)}>
              <option value="TODAY">Today</option>
              <option value="LAST_7_DAYS">Last 7 days</option>
              <option value="LAST_30_DAYS">Last 30 days</option>
              <option value="LAST_90_DAYS">Last 90 days</option>
            </select>
          </label>
          <div className="reporting-dashboard__range-label" aria-live="polite">
            {rangeLabel}
          </div>
        </div>
      </header>

      {error && <div className="alert alert--error">{error}</div>}

      <KpiSummaryCards
        stockouts={snapshot?.stockouts ?? {
          totalStockouts: 0,
          stockoutPercentage: 0,
          averageDurationHours: 0,
          criticalSkuCount: 0,
          byLocation: [],
        }}
        turnover={snapshot?.turnover ?? {
          turnoverRatio: 0,
          trailingPeriods: 0,
          daysOfCover: 0,
          daysOfCoverTarget: 0,
          periodComparisonDelta: 0,
        }}
        progress={snapshot?.targetProgress ?? []}
        isLoading={isLoading && !snapshot}
        lastUpdated={snapshot?.generatedAt}
        onRefresh={handleRefresh}
      />

      <div className="reporting-dashboard__grid">
        <StockoutEventsTable events={snapshot?.stockoutEvents ?? []} isLoading={isLoading && !snapshot} />
        <SlowMovingSkuList skus={snapshot?.slowMovingSkus ?? []} isLoading={isLoading && !snapshot} />
        <ProgressToTargetPanel progress={snapshot?.targetProgress ?? []} isLoading={isLoading && !snapshot} />
      </div>
    </div>
  );
};

export default ReportingDashboard;
