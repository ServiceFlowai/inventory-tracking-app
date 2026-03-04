import React from 'react';

interface ImportPreviewTableProps {
  rows: Record<string, string>[];
}

const ImportPreviewTable: React.FC<ImportPreviewTableProps> = ({ rows }) => {
  if (!rows.length) {
    return <div className="panel__empty">No preview rows available.</div>;
  }

  const columns = Object.keys(rows[0]);

  return (
    <div className="table-wrapper">
      <table className="table" role="grid">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column} scope="col">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td key={column}>{row[column]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ImportPreviewTable;
