// backend/src/api/accounts.js
const express = require('express');
const router = express.Router();

// Mock data pro 4 účty (3 live + 1 demo) - později nahradíme real cTrader API
const MOCK_ACCOUNTS = [
  {
    id: 'live_12345678',
    name: 'Live-12345678',
    type: 'live',
    balance: 10000.00,
    equity: 10150.30,
    margin: 500.00,
    freeMargin: 9650.30,
    marginLevel: 2030.06,
    currency: 'USD',
    broker: 'Pepperstone',
    server: 'Pepperstone-Live',
    status: 'connected'
  },
  {
    id: 'live_87654321',
    name: 'Live-87654321', 
    type: 'live',
    balance: 25000.00,
    equity: 24850.75,
    margin: 1200.00,
    freeMargin: 23650.75,
    marginLevel: 2070.90,
    currency: 'USD',
    broker: 'Pepperstone',
    server: 'Pepperstone-Live',
    status: 'connected'
  },
  {
    id: 'live_11223344',
    name: 'Live-11223344',
    type: 'live', 
    balance: 5000.00,
    equity: 5125.40,
    margin: 250.00,
    freeMargin: 4875.40,
    marginLevel: 2050.16,
    currency: 'USD',
    broker: 'Pepperstone',
    server: 'Pepperstone-Live',
    status: 'connected'
  },
  {
    id: 'demo_99887766',
    name: 'Demo-99887766',
    type: 'demo',
    balance: 100000.00,
    equity: 100345.80,
    margin: 2000.00,
    freeMargin: 98345.80,
    marginLevel: 5017.29,
    currency: 'USD',
    broker: 'Pepperstone',
    server: 'Pepperstone-Demo',
    status: 'connected'
  }
];

// Globální state pro aktivní účet
let activeAccountId = 'live_12345678'; // default

// GET /api/accounts - Seznam všech účtů
router.get('/', (req, res) => {
  try {
    console.log('📋 GET /api/accounts - Requesting accounts list');
    
    const accountsList = MOCK_ACCOUNTS.map(account => ({
      id: account.id,
      name: account.name,
      type: account.type,
      balance: account.balance,
      currency: account.currency,
      status: account.status,
      isActive: account.id === activeAccountId
    }));

    res.json({
      success: true,
      accounts: accountsList,
      activeAccount: activeAccountId,
      totalAccounts: accountsList.length
    });
  } catch (error) {
    console.error('❌ Error getting accounts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve accounts'
    });
  }
});

// GET /api/accounts/current - Aktuální aktivní účet  
router.get('/current', (req, res) => {
  try {
    console.log('🎯 GET /api/accounts/current - Getting active account');
    
    const currentAccount = MOCK_ACCOUNTS.find(acc => acc.id === activeAccountId);
    
    if (!currentAccount) {
      return res.status(404).json({
        success: false,
        error: 'Active account not found'
      });
    }

    res.json({
      success: true,
      account: currentAccount,
      isActive: true
    });
  } catch (error) {
    console.error('❌ Error getting current account:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get current account'
    });
  }
});

// POST /api/accounts/switch - Přepnutí na jiný účet
router.post('/switch', (req, res) => {
  try {
    const { accountId } = req.body;
    
    console.log(`🔄 POST /api/accounts/switch - Switching to account: ${accountId}`);
    
    if (!accountId) {
      return res.status(400).json({
        success: false,
        error: 'Account ID is required'
      });
    }

    // Ověřit, že účet existuje
    const targetAccount = MOCK_ACCOUNTS.find(acc => acc.id === accountId);
    
    if (!targetAccount) {
      return res.status(404).json({
        success: false,
        error: 'Account not found'
      });
    }

    // Přepnout aktivní účet
    const previousAccountId = activeAccountId;
    activeAccountId = accountId;

    console.log(`✅ Account switched: ${previousAccountId} → ${activeAccountId}`);

    res.json({
      success: true,
      message: 'Account switched successfully',
      previousAccount: previousAccountId,
      newAccount: activeAccountId,
      accountDetails: targetAccount
    });
  } catch (error) {
    console.error('❌ Error switching account:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to switch account'
    });
  }
});

// GET /api/accounts/:id - Detail konkrétního účtu
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔍 GET /api/accounts/${id} - Getting account details`);
    
    const account = MOCK_ACCOUNTS.find(acc => acc.id === id);
    
    if (!account) {
      return res.status(404).json({
        success: false,
        error: 'Account not found'
      });
    }

    res.json({
      success: true,
      account: account,
      isActive: account.id === activeAccountId
    });
  } catch (error) {
    console.error('❌ Error getting account details:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get account details'
    });
  }
});

module.exports = router;
