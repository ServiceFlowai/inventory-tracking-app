import React, { useState } from 'react';

const OrderWorkflow = () => {
  const [receivingRecords, setReceivingRecords] = useState([]);

  const handleReceiveShipment = () => {
    // Logic to receive shipment and update inventory
    const newRecord = { id: Date.now(), status: 'Received', items: [] };
    setReceivingRecords([...receivingRecords, newRecord]);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Order Receiving & Workflow</h1>
      <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded" onClick={handleReceiveShipment}>Receive Shipment</button>
      <div className="mt-4">
        <h2 className="text-xl">Receiving Records</h2>
        <ul>
          {receivingRecords.map(record => (
            <li key={record.id} className="border p-2 mt-2">
              Record ID: {record.id}, Status: {record.status}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OrderWorkflow;
