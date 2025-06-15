import React from 'react';
import { useAuth } from './hooks/useAuth';

// Loading Component
function LoadingScreen() {
    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#0f0f0f',
            color: '#e5e5e5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Arial, sans-serif'
        }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{
                    width: '60px',
                    height: '60px',
                    border: '3px solid #333',
                    borderTop: '3px solid #4ade80',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto 1rem'
                }}>
                </div>
                <p style={{ color: '#9ca3af' }}>Connecting to StoneTrader...</p>
            </div>
        </div>
    );
}

// Simple Login Component
function LoginScreen({ onLogin }) {
    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#0f0f0f',
            color: '#e5e5e5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Arial, sans-serif'
        }}>
            <div style={{
                background: '#1a1a1a',
                padding: '3rem',
                borderRadius: '12px',
                border: '1px solid #333',
                textAlign: 'center',
                maxWidth: '400px'
            }}>
                <h1 style={{ color: '#4ade80', marginBottom: '1rem' }}>
                    🏛️ StoneTrader
                </h1>
                <p style={{ color: '#9ca3af', marginBottom: '2rem' }}>
                    Professional Linux Trading Client
                </p>
                
                <div style={{
                    background: '#2d2d2d',
                    padding: '1.5rem',
                    borderRadius: '8px',
                    marginBottom: '2rem'
                }}>
                    <h3 style={{ color: '#e5e5e5', marginBottom: '1rem' }}>
                        Connect to cTrader
                    </h3>
                    <p style={{ color: '#9ca3af', fontSize: '0.9rem', lineHeight: '1.6' }}>
                        Click below to authenticate with your cTrader account and start trading.
                    </p>
                </div>
                
                <button
                    onClick={onLogin}
                    style={{
                        background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                        color: 'white',
                        border: 'none',
                        padding: '1rem 2rem',
                        borderRadius: '8px',
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        width: '100%',
                        transition: 'transform 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                    onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                >
                    🔐 Login with cTrader
                </button>
                
                <p style={{ 
                    fontSize: '0.8rem', 
                    color: '#6b7280', 
                    marginTop: '1.5rem' 
                }}>
                    App ID: 15501 | Secure OAuth 2.0 Authentication
                </p>
            </div>
        </div>
    );
}

// Main Trading Interface
function TradingInterface({ authStatus, onLogout }) {
    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#0f0f0f',
            color: '#e5e5e5',
            fontFamily: 'Arial, sans-serif'
        }}>
            <header style={{
                background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
                padding: '1rem 2rem',
                borderBottom: '1px solid #333',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div>
                    <h1 style={{ color: '#4ade80', margin: 0, fontSize: '1.5rem' }}>
                        🏛️ StoneTrader
                    </h1>
                    <p style={{ color: '#9ca3af', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
                        Connected to cTrader • {authStatus.accounts.length} accounts
                    </p>
                </div>
                <button
                    onClick={onLogout}
                    style={{
                        background: '#dc2626',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Logout
                </button>
            </header>
            
            <main style={{ padding: '2rem' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 300px',
                    gap: '1rem',
                    minHeight: '70vh'
                }}>
                    <div style={{
                        background: '#1a1a1a',
                        borderRadius: '8px',
                        border: '1px solid #333',
                        padding: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <h3 style={{ color: '#4ade80', marginBottom: '1rem' }}>
                                📈 Live Chart
                            </h3>
                            <p style={{ color: '#9ca3af', marginBottom: '1rem' }}>
                                Real-time market data from cTrader
                            </p>
                            <div style={{
                                background: '#2d2d2d',
                                padding: '2rem',
                                borderRadius: '8px',
                                border: '1px solid #404040'
                            }}>
                                <p style={{ color: '#6b7280' }}>
                                    Chart component will be loaded here
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div style={{
                        background: '#1a1a1a',
                        borderRadius: '8px',
                        border: '1px solid #333',
                        padding: '1.5rem'
                    }}>
                        <h3 style={{ color: '#4ade80', marginBottom: '1rem' }}>
                            🎯 Quick Trade
                        </h3>
                        
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', color: '#9ca3af', marginBottom: '0.5rem' }}>
                                Account:
                            </label>
                            <select style={{
                                width: '100%',
                                padding: '0.5rem',
                                background: '#2d2d2d',
                                border: '1px solid #404040',
                                borderRadius: '4px',
                                color: '#e5e5e5'
                            }}>
                                {authStatus.accounts.map((account, i) => (
                                    <option key={i} value={account.accountId}>
                                        {account.accountId} - ${account.balance || '0.00'}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', color: '#9ca3af', marginBottom: '0.5rem' }}>
                                Symbol:
                            </label>
                            <select style={{
                                width: '100%',
                                padding: '0.5rem',
                                background: '#2d2d2d',
                                border: '1px solid #404040',
                                borderRadius: '4px',
                                color: '#e5e5e5'
                            }}>
                                <option value="EURUSD">EUR/USD</option>
                                <option value="GBPUSD">GBP/USD</option>
                                <option value="USDJPY">USD/JPY</option>
                                <option value="USDCHF">USD/CHF</option>
                            </select>
                        </div>
                        
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', color: '#9ca3af', marginBottom: '0.5rem' }}>
                                Volume:
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                defaultValue="0.1"
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    background: '#2d2d2d',
                                    border: '1px solid #404040',
                                    borderRadius: '4px',
                                    color: '#e5e5e5'
                                }}
                            />
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                            <button style={{
                                background: '#059669',
                                color: 'white',
                                border: 'none',
                                padding: '0.75rem',
                                borderRadius: '4px',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}>
                                BUY
                            </button>
                            <button style={{
                                background: '#dc2626',
                                color: 'white',
                                border: 'none',
                                padding: '0.75rem',
                                borderRadius: '4px',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}>
                                SELL
                            </button>
                        </div>
                        
                        <div style={{
                            marginTop: '1.5rem',
                            padding: '1rem',
                            background: '#2d2d2d',
                            borderRadius: '6px',
                            border: '1px solid #404040'
                        }}>
                            <h4 style={{ color: '#4ade80', margin: '0 0 0.5rem 0' }}>
                                Connection Status
                            </h4>
                            <p style={{ color: '#9ca3af', margin: 0, fontSize: '0.9rem' }}>
                                🟢 {authStatus.connected ? 'Connected' : 'Disconnected'}
                            </p>
                            <p style={{ color: '#9ca3af', margin: '0.25rem 0 0 0', fontSize: '0.8rem' }}>
                                {authStatus.accounts.length} accounts available
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

// Main App Component
function App() {
    const authStatus = useAuth();
    
    React.useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);
    
    if (authStatus.loading) {
        return <LoadingScreen />;
    }
    
    if (!authStatus.authenticated) {
        return <LoginScreen onLogin={authStatus.login} />;
    }
    
    return <TradingInterface authStatus={authStatus} onLogout={authStatus.logout} />;
}

export default App;
