const express = require('express');
const router = express.Router();

let ctraderAPI = null;

router.setCTraderAPI = (api) => {
    ctraderAPI = api;
};

// Middleware to check auth
const requireAuth = (req, res, next) => {
    if (!req.session.authenticated) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    next();
};

// Get accounts
router.get('/accounts', requireAuth, async (req, res) => {
    try {
        const accounts = await ctraderAPI.getAccounts();
        res.json({ accounts });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get symbols
router.get('/symbols', requireAuth, async (req, res) => {
    try {
        const symbols = await ctraderAPI.getSymbols();
        res.json({ symbols });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create market order
router.post('/orders', requireAuth, async (req, res) => {
    try {
        const { accountId, symbol, side, volume } = req.body;
        
        if (!accountId || !symbol || !side || !volume) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        const result = await ctraderAPI.createMarketOrder(accountId, symbol, side, volume);
        res.json({ success: true, order: result });
    } catch (error) {
        console.error('❌ Order creation failed:', error);
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
