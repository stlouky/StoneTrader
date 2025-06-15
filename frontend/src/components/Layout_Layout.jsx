import React from 'react';

export default function Layout_Layout({ children }) {
  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="header-content">
          <h1>🏛️ StoneTrader</h1>
          <div className="header-info">
            <span>Professional Trading Client</span>
          </div>
        </div>
      </header>
      <main className="app-main">
        {children}
      </main>
    </div>
  );
}
