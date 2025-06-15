import React from 'react';

export default function Layout_StatusBar({ connectionStatus, wsConnected }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return '#4ade80';
      case 'disconnected': return '#ef4444';
      default: return '#6b7280';
    }
  };
  
  return (
    <div className="status-bar">
      <div className="status-item">
        <span 
          className="status-dot" 
          style={{ backgroundColor: getStatusColor(connectionStatus) }}
        />
        <span>cTrader: {connectionStatus}</span>
      </div>
      
      <div className="status-item">
        <span 
          className="status-dot" 
          style={{ backgroundColor: wsConnected ? '#4ade80' : '#ef4444' }}
        />
        <span>WebSocket: {wsConnected ? 'connected' : 'disconnected'}</span>
      </div>
      
      <div className="status-item">
        <span>StoneTrader v1.0.0</span>
      </div>
    </div>
  );
}
