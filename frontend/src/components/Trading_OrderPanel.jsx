import React, { useState } from 'react';

export default function Trading_OrderPanel({ onOrder, connectionStatus }) {
  const [volume, setVolume] = useState('0.01');
  const [symbol, setSymbol] = useState('EURUSD');
  
  const handleOrder = (side) => {
    if (connectionStatus !== 'connected') {
      alert('Not connected to trading server');
      return;
    }
    
    onOrder({
      symbol,
      side,
      volume: parseFloat(volume),
      type: 'market'
    });
  };
  
  return (
    <div className="order-panel">
      <h3>Quick Order</h3>
      
      <div className="order-form">
        <div className="form-group">
          <label>Symbol</label>
          <select value={symbol} onChange={(e) => setSymbol(e.target.value)}>
            <option value="EURUSD">EUR/USD</option>
            <option value="GBPUSD">GBP/USD</option>
            <option value="USDJPY">USD/JPY</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Volume</label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
          />
        </div>
        
        <div className="order-buttons">
          <button
            className="order-btn buy-btn"
            onClick={() => handleOrder('buy')}
            disabled={connectionStatus !== 'connected'}
          >
            BUY
          </button>
          <button
            className="order-btn sell-btn"
            onClick={() => handleOrder('sell')}
            disabled={connectionStatus !== 'connected'}
          >
            SELL
          </button>
        </div>
      </div>
      
      <div className="shortcuts-help">
        <small>
          <strong>Shortcuts:</strong><br />
          Ctrl+Alt+B - Buy<br />
          Ctrl+Alt+S - Sell
        </small>
      </div>
    </div>
  );
}
