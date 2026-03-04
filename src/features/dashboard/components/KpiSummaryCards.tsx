import React from 'react';
import { InventoryTurnoverKpi, ProgressToTargetKpi, StockoutKpi } from '../types';
import { formatNumber, formatPercentage, formatRelativeChange } from '../../../utils/numberFormat';

type CardVariant = 'primary' | 'warning' | 'success';

interface KpiSummaryCardsProps {
  stockouts: StockoutKpi;
  turnover: InventoryTurnoverKpi;
  progress: ProgressToTargetKpi[];
  isLoading?: boolean;
  onRefresh?: () => void;
  lastUpdated?: string;
}

interface SummaryCardProps {
  title: string;
  value: string;
  description?: string;
  variant?: CardVariant;
  footer?: React.ReactNode;
  isLoading?: boolean;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, description, variant = 'primary', footer, isLoading }) => {
  return (
    <article className={`summary-card summary-card--${variant}`} aria-busy={isLoading}>
      <header className="summary-card__header">
        <h3 className="summary-card__title">{title}</h3>
      </header>
      <div className="summary-card__body">
        <p className="summary-card__value">{isLoading ? '—' : value}</p>
        {description && <p className="summary-card__description">{description}</p>}
      </div>
      {footer && <footer className="summary-card__footer">{footer}</footer>}
    </article>
  );
};

const KpiSummaryCards: React.FC<KpiSummaryCardsProps> = ({ stockouts, turnover, progress, isLoading, onRefresh, lastUpdated }) => {
  const criticalStockoutShare = stockouts.totalStockouts === 0 ? 0 : stockouts.criticalSkuCount / stockouts.totalStockouts;
  const firstProgress = progress[0];

  return (
    <section className="kpi-summary" aria-label="Key performance indicators">
      <header className="kpi-summary__header">
        <h2>Performance Overview</h2>
        <div className="kpi-summary__header-actions">
          {lastUpdated && <span className="kpi-summary__timestamp">Updated {new Date(lastUpdated).toLocaleString()}</span>}
          <button className="btn btn-secondary" type="button" onClick={onRefresh} disabled={isLoading}>
            Refresh
          </button>
        </div>
      </header>
      <div className="kpi-summary__grid">
        <SummaryCard
          title="Stockouts"
          value={`${formatNumber(stockouts.totalStockouts)} (${formatPercentage(stockouts.stockoutPercentage)})`}
          description={`Critical impact SKUs: ${formatNumber(stockouts.criticalSkuCount)} (${formatPercentage(criticalStockoutShare)})`}
          variant={stockouts.stockoutPercentage > 0.04 ? 'warning' : 'primary'}
          isLoading={isLoading}
          footer={<span>Avg. duration: {formatNumber(stockouts.averageDurationHours)} hours</span>}
        />
        <SummaryCard
          title="Inventory Turnover"
          value={formatNumber(turnover.turnoverRatio, 2)}
          description={`Days of cover: ${formatNumber(turnover.daysOfCover)} (target ${formatNumber(turnover.daysOfCoverTarget)})`}
          variant={turnover.daysOfCover > turnover.daysOfCoverTarget ? 'warning' : 'primary'}
          isLoading={isLoading}
          footer={<span>Δ vs prior period: {formatRelativeChange(turnover.periodComparisonDelta)}</span>}
        />
        {firstProgress && (
          <SummaryCard
            title={firstProgress.metricName}
            value={formatPercentage(firstProgress.progressPercentage)}
            description={`Actual ${formatNumber(firstProgress.actual)} / Target ${formatNumber(firstProgress.target)}`}
            variant={firstProgress.progressPercentage >= 0.9 ? 'success' : 'primary'}
            isLoading={isLoading}
            footer={firstProgress.targetDate ? <span>Target date: {new Date(firstProgress.targetDate).toLocaleDateString()}</span> : undefined}
          />
        )}
      </div>
    </section>
  );
};

export default KpiSummaryCards;
