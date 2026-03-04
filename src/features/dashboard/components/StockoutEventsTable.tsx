import React from 'react';
import { StockoutEvent } from '../types';
import { formatDateTime, formatNumber } from '../../../utils/numberFormat';

interface StockoutEventsTableProps {
  events: StockoutEvent[];
  isLoading?: boolean;
}

const severityClassMap: Record<StockoutEvent['severity'], string> = {
  LOW: 'badge--low',
  MEDIUM: 'badge--medium',
  HIGH: 'badge--high',
  CRITICAL: 'badge--critical',
};

const StockoutEventsTable: React.FC<StockoutEventsTableProps> = ({ events, isLoading }) => {
  return (
    <section className="panel" aria-label="Stockout events">
      <header className="panel__header">
        <h3>Stockout Events</h3>
      </header>
      <div className="panel__body">
        {isLoading ? (
          <div className="panel__empty">Loading stockout events…</div>
        ) : events.length === 0 ? (
          <div className="panel__empty">No stockout events in this period 🎉</div>
        ) : (
          <div className="table-wrapper">
            <table className="table" role="grid">
              <thead>
                <tr>
                  <th scope="col">SKU</th>
                  <th scope="col">Location</th>
                  <th scope="col">Started</th>
                  <th scope="col">Resolved</th>
                  <th scope="col">Quantity Short</th>
                  <th scope="col">Severity</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id}>
                    <td>{event.sku}</td>
                    <td>{event.locationName}</td>
                    <td>{formatDateTime(event.occurredAt)}</td>
                    <td>{event.resolvedAt ? formatDateTime(event.resolvedAt) : 'Open'}</td>
                    <td>{formatNumber(event.quantityShort)}</td>
                    <td>
                      <span className={`badge ${severityClassMap[event.severity]}`}>{event.severity}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

export default StockoutEventsTable;
