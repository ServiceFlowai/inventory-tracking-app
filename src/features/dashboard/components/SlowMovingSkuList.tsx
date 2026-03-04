import React from 'react';
import { SlowMovingSku } from '../types';
import { formatDateTime, formatNumber } from '../../../utils/numberFormat';

interface SlowMovingSkuListProps {
  skus: SlowMovingSku[];
  isLoading?: boolean;
}

const SlowMovingSkuList: React.FC<SlowMovingSkuListProps> = ({ skus, isLoading }) => {
  return (
    <section className="panel" aria-label="Slow moving SKUs">
      <header className="panel__header">
        <h3>Slow Moving SKUs</h3>
      </header>
      <div className="panel__body">
        {isLoading ? (
          <div className="panel__empty">Analyzing SKU velocity…</div>
        ) : skus.length === 0 ? (
          <div className="panel__empty">All SKUs are moving within expected velocity.</div>
        ) : (
          <div className="table-wrapper">
            <table className="table" role="grid">
              <thead>
                <tr>
                  <th scope="col">SKU</th>
                  <th scope="col">Description</th>
                  <th scope="col">Location</th>
                  <th scope="col">Qty on Hand</th>
                  <th scope="col">Days in Inventory</th>
                  <th scope="col">Last Movement</th>
                </tr>
              </thead>
              <tbody>
                {skus.map((sku) => (
                  <tr key={`${sku.sku}-${sku.locationName}`}>
                    <td>{sku.sku}</td>
                    <td>{sku.description}</td>
                    <td>{sku.locationName}</td>
                    <td>{formatNumber(sku.quantityOnHand)}</td>
                    <td>{formatNumber(sku.daysInInventory)}</td>
                    <td>{formatDateTime(sku.lastMovementAt)}</td>
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

export default SlowMovingSkuList;
