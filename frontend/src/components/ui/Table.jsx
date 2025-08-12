import React from 'react';
import './Table.css';

const Table = ({ children, className = '', striped = false, hover = false, ...props }) => {
  const baseClasses = 'table';
  const stripedClasses = striped ? 'table--striped' : '';
  const hoverClasses = hover ? 'table--hover' : '';

  const tableClasses = [
    baseClasses,
    stripedClasses,
    hoverClasses,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="table-container">
      <table className={tableClasses} {...props}>
        {children}
      </table>
    </div>
  );
};

const TableHeader = ({ children, className = '' }) => (
  <thead className={`table__header ${className}`}>
    {children}
  </thead>
);

const TableBody = ({ children, className = '' }) => (
  <tbody className={`table__body ${className}`}>
    {children}
  </tbody>
);

const TableRow = ({ children, className = '', ...props }) => (
  <tr className={`table__row ${className}`} {...props}>
    {children}
  </tr>
);

const TableHeaderCell = ({ children, className = '', ...props }) => (
  <th className={`table__header-cell ${className}`} {...props}>
    {children}
  </th>
);

const TableCell = ({ children, className = '', ...props }) => (
  <td className={`table__cell ${className}`} {...props}>
    {children}
  </td>
);

Table.Header = TableHeader;
Table.Body = TableBody;
Table.Row = TableRow;
Table.HeaderCell = TableHeaderCell;
Table.Cell = TableCell;

export default Table;