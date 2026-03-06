import React, { useState } from 'react';

const Receiving: React.FC = () => {
  const [receivingRecords, setReceivingRecords] = useState([]);

  const handleReceive = (event: React.FormEvent) => {
    event.preventDefault();
    // Logic to handle receiving
    alert('Receiving record created!');
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Receiving</h1>
      <form onSubmit={handleReceive} className="mb-4">
        <input type="text" placeholder="Item SKU" className="border p-2 mr-2" required />
        <input type="number" placeholder="Quantity" className="border p-2 mr-2" required />
        <button type="submit" className="bg-blue-500 text-white p-2">Receive</button>
      </form>
      <div>
        <h2 className="text-xl font-bold mb-2">Receiving Records</h2>
        <ul>
          {receivingRecords.map((record, index) => (
            <li key={index} className="border p-2 mb-2">{record}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Receiving;