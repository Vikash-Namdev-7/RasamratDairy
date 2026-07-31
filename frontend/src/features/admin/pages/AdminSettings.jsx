import React from 'react';

export const AdminSettings = () => (
  <div className="admin-page-container">
    <h2 className="font-display" style={{ fontSize: '1.5rem', color: 'var(--color-navy)', fontWeight: '700', marginBottom: '0.5rem' }}>
      Admin Settings
    </h2>
    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
      Dairy store profile, notification preferences, and system parameters.
    </p>
  </div>
);

export default AdminSettings;
