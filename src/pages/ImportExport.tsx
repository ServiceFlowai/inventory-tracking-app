import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const ImportExport: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        console.log(jsonData);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Data Import/Export</h1>
      <div className="bg-white p-4 shadow rounded">
        <input type="file" accept=".xlsx, .xls, .csv" onChange={handleFileChange} />
        <button onClick={handleImport} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">Import</button>
      </div>
    </div>
  );
};

export default ImportExport;