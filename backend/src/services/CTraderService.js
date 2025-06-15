const { WebSocket } = require('ws');

class CTraderService {
    constructor(eventSystem) {
        this.eventSystem = eventSystem;
        this.ws = null;
        this.isConnected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 1000;
    }
    
    async connect() {
        if (this.isConnected) return;
        
        console.log('🔌 Connecting to cTrader API...');
        
        try {
            this.ws = new WebSocket('wss://demo-api.ctrader.com/ws');
            this.setupWebSocketHandlers();
        } catch (error) {
            console.error('❌ cTrader connection failed:', error);
            this.scheduleReconnect();
        }
    }
    
    setupWebSocketHandlers() {
        this.ws.on('open', () => {
            console.log('✅ cTrader API connected');
            this.isConnected = true;
            this.reconnectAttempts = 0;
            this.eventSystem.emit('ctrader:connected');
        });
        
        this.ws.on('close', () => {
            console.log('🔌 cTrader API disconnected');
            this.isConnected = false;
            this.eventSystem.emit('ctrader:disconnected');
            this.scheduleReconnect();
        });
        
        this.ws.on('error', (error) => {
            console.error('❌ cTrader API error:', error);
        });
    }
    
    scheduleReconnect() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            setTimeout(() => {
                this.reconnectAttempts = 0;
                this.scheduleReconnect();
            }, 30000);
            return;
        }
        
        setTimeout(() => {
            this.reconnectAttempts++;
            this.reconnectDelay = Math.min(this.reconnectDelay * 2, 16000);
            this.connect();
        }, this.reconnectDelay);
    }
}

module.exports = CTraderService;
