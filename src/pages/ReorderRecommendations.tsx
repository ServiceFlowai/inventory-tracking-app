import React from 'react';

const ReorderRecommendations = () => {
  const recommendations = [
    { id: 1, product: 'Widget A', recommendedOrder: 100 },
    { id: 2, product: 'Widget B', recommendedOrder: 50 }
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Reorder Recommendations</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Product</th>
            <th className="py-2">Recommended Order</th>
          </tr>
        </thead>
        <tbody>
          {recommendations.map(rec => (
            <tr key={rec.id} className="border-t">
              <td className="py-2">{rec.product}</td>
              <td className="py-2">{rec.recommendedOrder}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReorderRecommendations;
