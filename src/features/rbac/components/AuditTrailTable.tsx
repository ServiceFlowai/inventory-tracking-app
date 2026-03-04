import React, { useEffect, useState } from 'react';
import { fetchAuditEvents } from '../api';
import { AuditEvent, AuditEventFilters } from '../types';
import { formatDateTime } from '../../../utils/numberFormat';

interface AuditTrailTableProps {
  defaultFilters?: AuditEventFilters;
}

const AuditTrailTable: React.FC<AuditTrailTableProps> = ({ defaultFilters = {} }) => {
  const [filters, setFilters] = useState<AuditEventFilters>(defaultFilters);
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    fetchAuditEvents(filters)
      .then((result) => {
        if (isMounted) {
          setEvents(result);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Unable to load audit events');
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [filters]);

  return (
    <section className="panel" aria-label="Audit trail">
      <header className="panel__header">
        <div>
          <h2>Audit Trail</h2>
          <p>Every change to roles, permissions, and inventory is logged.</p>
        </div>
        <div className="panel__filters">
          <input
            type="text"
            placeholder="Filter by resource"
            value={filters.resourceType ?? ''}
            onChange={(event) => setFilters((prev) => ({ ...prev, resourceType: event.target.value || undefined }))}
          />
          <input
            type="text"
            placeholder="Filter by user ID"
            value={filters.actorId ?? ''}
            onChange={(event) => setFilters((prev) => ({ ...prev, actorId: event.target.value || undefined }))}
          />
        </div>
      </header>
      <div className="panel__body">
        {error && <div className="alert alert--error">{error}</div>}
        {isLoading ? (
          <div className="panel__empty">Loading audit history…</div>
        ) : events.length === 0 ? (
          <div className="panel__empty">No audit events found for the selected filters.</div>
        ) : (
          <div className="table-wrapper">
            <table className="table" role="grid">
              <thead>
                <tr>
                  <th scope="col">Time</th>
                  <th scope="col">Actor</th>
                  <th scope="col">Action</th>
                  <th scope="col">Resource</th>
                  <th scope="col">Metadata</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id}>
                    <td>{formatDateTime(event.occurredAt)}</td>
                    <td>{event.actorName}</td>
                    <td>{event.action}</td>
                    <td>{event.resourceType}</td>
                    <td>
                      {event.metadata ? (
                        <pre className="audit__metadata">{JSON.stringify(event.metadata, null, 2)}</pre>
                      ) : (
                        '—'
                      )}
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

export default AuditTrailTable;
