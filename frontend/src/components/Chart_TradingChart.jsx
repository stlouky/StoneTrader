import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';

export default function Chart_TradingChart() {
  const chartContainerRef = useRef();
  
  useEffect(() => {
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        backgroundColor: '#1a1a1a',
        textColor: '#d1d4dc',
      },
      grid: {
        vertLines: { color: '#2d2d2d' },
        horzLines: { color: '#2d2d2d' },
      }
    });
    
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#4ade80',
      downColor: '#ef4444',
      borderDownColor: '#ef4444',
      borderUpColor: '#4ade80',
      wickDownColor: '#ef4444',
      wickUpColor: '#4ade80',
    });
    
    // Sample data
    const sampleData = [];
    for (let i = 0; i < 50; i++) {
      const time = Math.floor(Date.now() / 1000) - (50 - i) * 60;
      const price = 1.1000 + (Math.random() - 0.5) * 0.01;
      sampleData.push({
        time,
        open: price,
        high: price + Math.random() * 0.005,
        low: price - Math.random() * 0.005,
        close: price + (Math.random() - 0.5) * 0.002
      });
    }
    candlestickSeries.setData(sampleData);
    
    return () => chart.remove();
  }, []);
  
  return (
    <div className="trading-chart">
      <div className="chart-header">
        <h3>EURUSD</h3>
      </div>
      <div ref={chartContainerRef} className="chart-container" />
    </div>
  );
}
