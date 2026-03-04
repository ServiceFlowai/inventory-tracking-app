import React from 'react';
import { ColumnMapping } from '../types';

interface ColumnMapperProps {
  sourceColumns: string[];
  targetFields: { field: string; label: string; required?: boolean }[];
  mappings: ColumnMapping[];
  onChange: (mappings: ColumnMapping[]) => void;
  onAutoMap?: () => void;
}

const ColumnMapper: React.FC<ColumnMapperProps> = ({ sourceColumns, targetFields, mappings, onChange, onAutoMap }) => {
  const getSourceValue = (targetField: string) => mappings.find((mapping) => mapping.targetField === targetField)?.sourceColumn ?? '';

  const handleSelectChange = (targetField: string, sourceColumn: string) => {
    const nextMappings = mappings.filter((mapping) => mapping.targetField !== targetField);
    if (sourceColumn) {
      nextMappings.push({ sourceColumn, targetField });
    }
    onChange(nextMappings);
  };

  return (
    <div className="column-mapper">
      <header className="column-mapper__header">
        <h3>Column Mapping</h3>
        <div className="column-mapper__actions">
          {onAutoMap && (
            <button className="btn btn-secondary" type="button" onClick={onAutoMap}>
              Auto map
            </button>
          )}
        </div>
      </header>

      <div className="column-mapper__table">
        <div className="column-mapper__row column-mapper__row--header">
          <div className="column-mapper__cell">Target Field</div>
          <div className="column-mapper__cell">Source Column</div>
        </div>
        {targetFields.map((target) => (
          <div className="column-mapper__row" key={target.field}>
            <div className="column-mapper__cell">
              <span>{target.label}</span>
              {target.required && <span className="column-mapper__required">Required</span>}
            </div>
            <div className="column-mapper__cell">
              <select value={getSourceValue(target.field)} onChange={(event) => handleSelectChange(target.field, event.target.value)}>
                <option value="">Select column…</option>
                {sourceColumns.map((column) => (
                  <option key={column} value={column}>
                    {column}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColumnMapper;
