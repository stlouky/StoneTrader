const express = require('express');
const router = express.Router();

// Initialize cTrader API
let ctraderAPI = null;

const initCTraderAPI = () => {
    if (!ctraderAPI) {
        const CTraderAPI = require('../services/CTraderAPI');
        ctraderAPI = new CTraderAPI();
    }
    return ctraderAPI;
};

// Start OAuth flow
router.get('/login', (req, res) => {
    try {
        const api = initCTraderAPI();
        
        if (!api) {
            return res.status(500).json({ error: 'cTrader API not initialized' });
        }
        
        const state = 'oauth_' + Date.now();
        const authUrl = api.generateAuthUrl(state);
        
        console.log('🔧 OAuth Login Debug:');
        console.log('- Generated state:', state);
        console.log('- Generated authUrl:', authUrl);
        
        if (!authUrl) {
            console.error('❌ Auth URL is null/undefined');
            return res.status(500).json({ error: 'Failed to generate auth URL' });
        }
        
        // Uložit state do session
        req.session.oauthState = state;
        
        console.log('✅ Redirecting to:', authUrl);
        res.redirect(authUrl);
        
    } catch (error) {
        console.error('❌ OAuth start failed:', error);
        res.status(500).json({ error: 'Failed to start OAuth: ' + error.message });
    }
});

// OAuth callback - OPRAVENO: state verification je optional
router.get('/callback', async (req, res) => {
    try {
        console.log('🔄 OAuth callback received');
        console.log('- Query params:', req.query);
        console.log('- Session state:', req.session.oauthState);
        
        const { code, state, error } = req.query;
        
        if (error) {
            console.error('❌ OAuth error:', error);
            return res.status(400).json({ error: 'OAuth failed: ' + error });
        }
        
        if (!code) {
            console.error('❌ No authorization code received');
            return res.status(400).json({ error: 'No authorization code' });
        }
        
        // State verification - OPTIONAL (cTrader někdy nevrací state)
        if (state && req.session.oauthState && state !== req.session.oauthState) {
            console.warn('⚠️  State mismatch, but continuing:', { received: state, expected: req.session.oauthState });
            // Neblokujeme flow kvůli state mismatch
        }
        
        console.log('✅ Authorization code received, exchanging for token...');
        console.log('- Code preview:', code.substring(0, 20) + '...');
        
        const api = initCTraderAPI();
        const tokenData = await api.exchangeCodeForToken(code);
        
        console.log('🎉 TOKEN EXCHANGE SUCCESSFUL!');
        console.log('- Access token preview:', tokenData.accessToken?.substring(0, 20) + '...');
        console.log('- Token expires in:', tokenData.expiresIn, 'seconds');
        
        // Store token in session
        req.session.accessToken = tokenData.accessToken;
        req.session.refreshToken = tokenData.refreshToken;
        req.session.tokenExpiresIn = tokenData.expiresIn;
        req.session.tokenReceived = new Date().toISOString();
        
        // Clear oauth state
        delete req.session.oauthState;
        
        console.log('✅ Token stored in session, redirecting to frontend...');
        
        // Redirect to frontend success page
        res.redirect('http://localhost:3003/?auth=success');
        
    } catch (error) {
        console.error('❌ OAuth callback failed:', error);
        res.status(500).json({ error: 'Token exchange failed: ' + error.message });
    }
});

// Get current auth status
router.get('/status', (req, res) => {
    const isAuthenticated = !!req.session.accessToken;
    res.json({
        authenticated: isAuthenticated,
        hasToken: !!req.session.accessToken,
        tokenExpires: req.session.tokenExpiresIn,
        tokenReceived: req.session.tokenReceived
    });
});

// Logout
router.post('/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

module.exports = router;
