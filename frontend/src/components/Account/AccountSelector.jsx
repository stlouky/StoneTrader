// frontend/src/components/Account/AccountSelector.jsx
import React, { useState, useEffect } from 'react';
import './AccountSelector.css';

const AccountSelector = () => {
  const [accounts, setAccounts] = useState([]);
  const [activeAccount, setActiveAccount] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Načtení seznamu účtů při mount
  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      console.log('📋 Fetching accounts list...');
      
      const response = await fetch('/api/accounts');
      const data = await response.json();
      
      if (data.success) {
        setAccounts(data.accounts || []);
        
        // Najít aktivní účet
        const active = data.accounts?.find(acc => acc.isActive) || data.accounts?.[0];
        setActiveAccount(active);
        
        console.log('✅ Accounts loaded:', data.accounts?.length || 0);
        console.log('🎯 Active account:', active?.name);
      } else {
        throw new Error(data.error || 'Failed to fetch accounts');
      }
    } catch (err) {
      console.error('❌ Error fetching accounts:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAccountSwitch = async (account) => {
    if (account.id === activeAccount?.id) {
      setIsDropdownOpen(false);
      return; // Už je aktivní
    }

    try {
      setLoading(true);
      console.log(`🔄 Switching to account: ${account.name}`);
      
      const response = await fetch('/api/accounts/switch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accountId: account.id })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setActiveAccount(account);
        setIsDropdownOpen(false);
        console.log(`✅ Switched to account: ${account.name}`);
        
        // Event pro ostatní komponenty
        window.dispatchEvent(new CustomEvent('accountChanged', { 
          detail: { account: account } 
        }));
      } else {
        throw new Error(data.error || 'Failed to switch account');
      }
    } catch (err) {
      console.error('❌ Error switching account:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const getAccountIcon = (type) => {
    return type === 'demo' ? '🎮' : '💰';
  };

  const formatBalance = (balance) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(balance);
  };

  if (loading && !activeAccount) {
    return (
      <div className="account-selector loading">
        <div className="account-selector-button">
          <span>Loading accounts...</span>
        </div>
      </div>
    );
  }

  if (error && !activeAccount) {
    return (
      <div className="account-selector error">
        <div className="account-selector-button">
          <span>❌ Error loading accounts</span>
        </div>
      </div>
    );
  }

  return (
    <div className="account-selector">
      <div 
        className={`account-selector-button ${isDropdownOpen ? 'open' : ''} ${loading ? 'loading' : ''}`}
        onClick={toggleDropdown}
      >
        <span className="account-icon">
          {activeAccount ? getAccountIcon(activeAccount.type) : '❓'}
        </span>
        <span className="account-info">
          <span className="account-name">
            {activeAccount?.name || 'No Account'}
          </span>
          {activeAccount && (
            <span className="account-balance">
              {formatBalance(activeAccount.balance)}
            </span>
          )}
        </span>
        <span className={`dropdown-arrow ${isDropdownOpen ? 'up' : 'down'}`}>
          ▼
        </span>
      </div>

      {isDropdownOpen && (
        <div className="account-dropdown">
          <div className="dropdown-header">
            <span>Select Account</span>
            <span className="accounts-count">({accounts.length} accounts)</span>
          </div>
          
          <div className="accounts-list">
            {accounts.map((account) => (
              <div
                key={account.id}
                className={`account-item ${account.isActive ? 'active' : ''} ${loading ? 'disabled' : ''}`}
                onClick={() => !loading && handleAccountSwitch(account)}
              >
                <span className="account-icon">
                  {getAccountIcon(account.type)}
                </span>
                <div className="account-details">
                  <div className="account-name">
                    {account.name}
                    {account.isActive && <span className="active-badge">●</span>}
                  </div>
                  <div className="account-meta">
                    <span className="account-type">
                      {account.type.toUpperCase()}
                    </span>
                    <span className="account-balance">
                      {formatBalance(account.balance)}
                    </span>
                  </div>
                </div>
                <div className="account-status">
                  <span className={`status-indicator ${account.status}`}>
                    {account.status === 'connected' ? '🟢' : '🔴'}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {error && (
            <div className="dropdown-error">
              ⚠️ {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AccountSelector;
