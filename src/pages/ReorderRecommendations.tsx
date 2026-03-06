import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReorderRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    axios.get('/api/reorder-recommendations')
      .then(response => setRecommendations(response.data))
      .catch(error => console.error('Error fetching reorder recommendations:', error));
  }, []);

  return (
    <div className="reorder-recommendations">
      <h1 className="text-2xl font-bold">Reorder Recommendations</h1>
      <table className="min-w-full mt-4 bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">SKU</th>
            <th className="py-2 px-4 border-b">Recommended Quantity</th>
            <th className="py-2 px-4 border-b">Current Stock</th>
            <th className="py-2 px-4 border-b">Lead Time</th>
          </tr>
        </thead>
        <tbody>
          {recommendations.map((rec: any) => (
            <tr key={rec.sku}>
              <td className="py-2 px-4 border-b">{rec.sku}</td>
              <td className="py-2 px-4 border-b">{rec.recommendedQuantity}</td>
              <td className="py-2 px-4 border-b">{rec.currentStock}</td>
              <td className="py-2 px-4 border-b">{rec.leadTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReorderRecommendations;