// frontend/src/components/Chart/TradingChart.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

const TradingChart = () => {
  const { accessToken, isAuthenticated } = useAuth();
  const chartContainerRef = useRef(null);
  const wsRef = useRef(null);
  const chartRef = useRef(null);
  
  const [priceData, setPriceData] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [lastUpdate, setLastUpdate] = useState(null);

  // Initialize Lightweight Charts
  useEffect(() => {
    if (!chartContainerRef.current || chartRef.current) return;

    // Create chart with professional styling
    const chart = window.LightweightCharts.createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        background: { color: '#1a1a1a' },
        textColor: '#d1d4dc',
        fontSize: 12,
        fontFamily: 'Inter, sans-serif',
      },
      grid: {
        vertLines: { color: '#2a2a2a' },
        horzLines: { color: '#2a2a2a' },
      },
      crosshair: {
        mode: window.LightweightCharts.CrosshairMode.Normal,
        vertLine: {
          color: '#c94e5c',
          width: 1,
          style: window.LightweightCharts.LineStyle.Solid,
        },
        horzLine: {
          color: '#c94e5c',
          width: 1,
          style: window.LightweightCharts.LineStyle.Solid,
        },
      },
      rightPriceScale: {
        borderColor: '#2a2a2a',
        textColor: '#d1d4dc',
      },
      timeScale: {
        borderColor: '#2a2a2a',
        textColor: '#d1d4dc',
        timeVisible: true,
        secondsVisible: true,
      },
    });

    // Add candlestick series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    // Add line series for real-time price
    const lineSeries = chart.addLineSeries({
      color: '#00d4aa',
      lineWidth: 2,
      priceLineVisible: true,
      lastValueVisible: true,
    });

    chartRef.current = { chart, candlestickSeries, lineSeries };

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.chart.remove();
        chartRef.current = null;
      }
    };
  }, []);

  // WebSocket connection for live data
  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      setConnectionStatus('not_authenticated');
      return;
    }

    const connectWebSocket = () => {
      try {
        setConnectionStatus('connecting');
        
        // cTrader WebSocket URL for live data
        const wsUrl = 'wss://live.ctraderapi.com/';
        wsRef.current = new WebSocket(wsUrl);

        wsRef.current.onopen = () => {
          console.log('WebSocket connected to cTrader');
          setConnectionStatus('connected');
          
          // Send authentication message
          const authMessage = {
            msgType: 'AUTH_REQ',
            accessToken: accessToken,
            applicationId: '15501'
          };
          
          wsRef.current.send(JSON.stringify(authMessage));
          
          // Subscribe to EURUSD price updates
          setTimeout(() => {
            const subscribeMessage = {
              msgType: 'SPOT_SUBSCRIPTION',
              symbolName: 'EURUSD',
              subscriptionType: 'QUOTES_AND_TRADES'
            };
            wsRef.current.send(JSON.stringify(subscribeMessage));
          }, 1000);
        };

        wsRef.current.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            handleMarketData(data);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        wsRef.current.onerror = (error) => {
          console.error('WebSocket error:', error);
          setConnectionStatus('error');
        };

        wsRef.current.onclose = () => {
          console.log('WebSocket disconnected');
          setConnectionStatus('disconnected');
          
          // Auto-reconnect after 3 seconds
          setTimeout(() => {
            if (isAuthenticated && accessToken) {
              connectWebSocket();
            }
          }, 3000);
        };

      } catch (error) {
        console.error('Failed to connect WebSocket:', error);
        setConnectionStatus('error');
      }
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [isAuthenticated, accessToken]);

  // Handle incoming market data
  const handleMarketData = (data) => {
    try {
      if (data.msgType === 'SPOT_EVENT' && data.symbolName === 'EURUSD') {
        const timestamp = Math.floor(Date.now() / 1000);
        const price = (data.bid + data.ask) / 2; // Mid price
        
        setCurrentPrice({
          bid: data.bid,
          ask: data.ask,
          mid: price,
          spread: data.ask - data.bid,
          timestamp: new Date()
        });
        
        setLastUpdate(new Date());
        
        // Add to chart (line series for real-time)
        if (chartRef.current) {
          const newPoint = {
            time: timestamp,
            value: price
          };
          
          chartRef.current.lineSeries.update(newPoint);
          
          // Keep only last 1000 points for performance
          setPriceData(prev => {
            const newData = [...prev, newPoint];
            return newData.slice(-1000);
          });
        }
      }
    } catch (error) {
      console.error('Error handling market data:', error);
    }
  };

  // Generate demo data if not connected (fallback)
  useEffect(() => {
    if (connectionStatus !== 'connected' && chartRef.current) {
      const generateDemoData = () => {
        const now = Math.floor(Date.now() / 1000);
        const demoData = [];
        let price = 1.0850; // Starting EURUSD price
        
        for (let i = 0; i < 100; i++) {
          const time = now - (100 - i) * 60; // 1 minute intervals
          price += (Math.random() - 0.5) * 0.0010; // Random walk
          
          demoData.push({
            time: time,
            open: price,
            high: price + Math.random() * 0.0005,
            low: price - Math.random() * 0.0005,
            close: price + (Math.random() - 0.5) * 0.0003,
          });
        }
        
        chartRef.current.candlestickSeries.setData(demoData);
      };
      
      const timer = setTimeout(generateDemoData, 1000);
      return () => clearTimeout(timer);
    }
  }, [connectionStatus]);

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return '#26a69a';
      case 'connecting': return '#ff9800';
      case 'error': return '#ef5350';
      case 'not_authenticated': return '#757575';
      default: return '#757575';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'Live Data Connected';
      case 'connecting': return 'Connecting to cTrader...';
      case 'error': return 'Connection Error';
      case 'not_authenticated': return 'Authentication Required';
      default: return 'Disconnected';
    }
  };

  return (
    <div className="trading-chart">
      {/* Chart Header */}
      <div className="chart-header">
        <div className="chart-title">
          <h3>EURUSD Live Chart</h3>
          <div className="chart-status" style={{ color: getStatusColor() }}>
            <span className="status-dot" style={{ backgroundColor: getStatusColor() }}></span>
            {getStatusText()}
          </div>
        </div>
        
        {currentPrice && (
          <div className="price-info">
            <div className="current-price">
              <span className="price-value">{currentPrice.mid?.toFixed(5)}</span>
              <span className="price-change">
                {currentPrice.spread?.toFixed(5)} spread
              </span>
            </div>
            <div className="bid-ask">
              <span className="bid">Bid: {currentPrice.bid?.toFixed(5)}</span>
              <span className="ask">Ask: {currentPrice.ask?.toFixed(5)}</span>
            </div>
            {lastUpdate && (
              <div className="last-update">
                Updated: {lastUpdate.toLocaleTimeString()}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Chart Container */}
      <div 
        ref={chartContainerRef}
        className="chart-container"
        style={{ 
          width: '100%', 
          height: '400px',
          backgroundColor: '#1a1a1a',
          border: '1px solid #2a2a2a',
          borderRadius: '4px'
        }}
      />

      {/* Chart Controls */}
      <div className="chart-controls">
        <button 
          className="chart-btn"
          onClick={() => {
            if (chartRef.current) {
              chartRef.current.chart.timeScale().fitContent();
            }
          }}
        >
          Fit Content
        </button>
        
        <button 
          className="chart-btn"
          onClick={() => {
            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
              wsRef.current.close();
            }
          }}
        >
          Disconnect
        </button>
        
        <div className="data-points">
          Data Points: {priceData.length}
        </div>
      </div>

      <style jsx>{`
        .trading-chart {
          width: 100%;
          background: #1a1a1a;
          border-radius: 8px;
          overflow: hidden;
        }
        
        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          background: #2a2a2a;
          border-bottom: 1px solid #3a3a3a;
        }
        
        .chart-title h3 {
          margin: 0 0 4px 0;
          color: #ffffff;
          font-size: 18px;
          font-weight: 600;
        }
        
        .chart-status {
          display: flex;
          align-items: center;
          font-size: 12px;
          font-weight: 500;
        }
        
        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-right: 6px;
        }
        
        .price-info {
          text-align: right;
          color: #ffffff;
        }
        
        .current-price {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 4px;
        }
        
        .price-value {
          font-size: 24px;
          font-weight: 700;
          color: #00d4aa;
        }
        
        .price-change {
          font-size: 12px;
          color: #888;
        }
        
        .bid-ask {
          display: flex;
          gap: 16px;
          font-size: 12px;
          margin-bottom: 4px;
        }
        
        .bid {
          color: #ef5350;
        }
        
        .ask {
          color: #26a69a;
        }
        
        .last-update {
          font-size: 10px;
          color: #666;
        }
        
        .chart-container {
          position: relative;
        }
        
        .chart-controls {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: #2a2a2a;
          border-top: 1px solid #3a3a3a;
        }
        
        .chart-btn {
          background: #3a3a3a;
          border: 1px solid #4a4a4a;
          color: #ffffff;
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
          transition: background 0.2s;
        }
        
        .chart-btn:hover {
          background: #4a4a4a;
        }
        
        .data-points {
          margin-left: auto;
          font-size: 12px;
          color: #888;
        }
      `}</style>
    </div>
  );
};

export default TradingChart;
