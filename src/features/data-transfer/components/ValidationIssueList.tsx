import React from 'react';
import { ImportValidationIssue } from '../types';

interface ValidationIssueListProps {
  issues: ImportValidationIssue[];
}

const ValidationIssueList: React.FC<ValidationIssueListProps> = ({ issues }) => {
  if (!issues.length) return null;

  return (
    <div className="validation-issues" role="alert">
      <h4>Validation Issues</h4>
      <ul>
        {issues.map((issue, index) => (
          <li key={`${issue.rowNumber}-${issue.column}-${index}`} className={`validation-issues__item validation-issues__item--${issue.severity}`}>
            <strong>Row {issue.rowNumber} ({issue.column})</strong>: {issue.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ValidationIssueList;
