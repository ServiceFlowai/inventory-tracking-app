import React from 'react';
import { ProgressToTargetKpi } from '../types';
import { formatNumber, formatPercentage } from '../../../utils/numberFormat';

interface ProgressToTargetPanelProps {
  progress: ProgressToTargetKpi[];
  isLoading?: boolean;
}

const ProgressToTargetPanel: React.FC<ProgressToTargetPanelProps> = ({ progress, isLoading }) => {
  return (
    <section className="panel" aria-label="Progress to targets">
      <header className="panel__header">
        <h3>Progress to Targets</h3>
      </header>
      <div className="panel__body">
        {isLoading ? (
          <div className="panel__empty">Updating progress metrics…</div>
        ) : progress.length === 0 ? (
          <div className="panel__empty">No targets configured.</div>
        ) : (
          <ul className="progress-list">
            {progress.map((item) => (
              <li key={item.metricName} className="progress-list__item">
                <div className="progress-list__header">
                  <strong>{item.metricName}</strong>
                  <span>{formatPercentage(item.progressPercentage)}</span>
                </div>
                <div className="progress-list__meta">
                  <span>Actual {formatNumber(item.actual)}</span>
                  <span>Target {formatNumber(item.target)}</span>
                  {item.targetDate && <span>Target date {new Date(item.targetDate).toLocaleDateString()}</span>}
                </div>
                <div className="progress-list__bar" role="progressbar" aria-valuenow={item.progressPercentage} aria-valuemin={0} aria-valuemax={100}>
                  <div className="progress-list__bar-fill" style={{ width: `${Math.min(item.progressPercentage * 100, 100)}%` }} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default ProgressToTargetPanel;
