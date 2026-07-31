import React from 'react';

export const DataTable = ({ headers = [], rows = [] }) => (
  <div style={{ overflowX: 'auto', backgroundColor: 'var(--color-cream-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
      <thead>
        <tr style={{ backgroundColor: 'var(--color-navy)', color: '#FFFFFF' }}>
          {headers.map((h, idx) => (
            <th key={idx} style={{ padding: '0.75rem 1rem' }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rIdx) => (
          <tr key={rIdx} style={{ borderBottom: '1px solid var(--color-border)' }}>
            {row.map((cell, cIdx) => (
              <td key={cIdx} style={{ padding: '0.75rem 1rem' }}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default DataTable;
