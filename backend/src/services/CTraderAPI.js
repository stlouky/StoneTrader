class CTraderAPI {
    constructor() {
        this.clientId = process.env.CLIENT_ID;
        this.clientSecret = process.env.CLIENT_SECRET;
        this.redirectUri = process.env.REDIRECT_URI;
        
        // Debug výpis při inicializaci
        console.log('🔧 CTraderAPI Constructor Debug:');
        console.log('- CLIENT_ID:', this.clientId?.substring(0, 15) + '...');
        console.log('- CLIENT_SECRET:', this.clientSecret ? 'SET' : 'NOT SET');
        console.log('- REDIRECT_URI:', this.redirectUri);
        
        // Kontrola povinných hodnot
        if (!this.clientId) {
            console.error('❌ CLIENT_ID is missing!');
        }
        if (!this.clientSecret) {
            console.error('❌ CLIENT_SECRET is missing!');
        }
        if (!this.redirectUri) {
            console.error('❌ REDIRECT_URI is missing!');
        }
    }

    generateAuthUrl(state = 'default_state') {
        console.log('🔧 generateAuthUrl called with state:', state);
        
        // Kontrola před generováním
        if (!this.clientId) {
            console.error('❌ Cannot generate auth URL: CLIENT_ID missing');
            return null;
        }
        if (!this.redirectUri) {
            console.error('❌ Cannot generate auth URL: REDIRECT_URI missing');
            return null;
        }
        
        try {
            const params = new URLSearchParams({
                client_id: this.clientId,
                redirect_uri: this.redirectUri,
                scope: 'trading',
                state: state
            });
            
            // Oficiální endpoint podle dokumentace
            const authUrl = `https://connect.spotware.com/apps/auth?${params.toString()}`;
            
            console.log('✅ Generated OAuth URL:', authUrl);
            return authUrl;
            
        } catch (error) {
            console.error('❌ Error generating auth URL:', error);
            return null;
        }
    }

    async exchangeCodeForToken(code) {
        console.log('🔄 Token exchange starting...');
        console.log('- Authorization code:', code?.substring(0, 15) + '...');
        
        if (!code) {
            throw new Error('Authorization code is required');
        }
        
        try {
            const tokenUrl = 'https://connect.spotware.com/apps/token';
            const params = new URLSearchParams({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: this.redirectUri,
                client_id: this.clientId,
                client_secret: this.clientSecret
            });
            
            console.log('Token exchange URL:', tokenUrl);
            
            const response = await fetch(`${tokenUrl}?${params.toString()}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            
            const responseText = await response.text();
            console.log('Token response:', response.status, responseText);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${responseText}`);
            }
            
            const data = JSON.parse(responseText);
            
            if (data.errorCode) {
                throw new Error(`cTrader Error: ${data.errorCode} - ${data.description}`);
            }
            
            console.log('✅ Token exchange successful!');
            return data;
            
        } catch (error) {
            console.error('❌ Token exchange failed:', error.message);
            throw error;
        }
    }
}

module.exports = CTraderAPI;
