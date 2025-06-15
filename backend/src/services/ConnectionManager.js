class ConnectionManager {
    constructor(wss, eventSystem) {
        this.wss = wss;
        this.eventSystem = eventSystem;
        this.connections = new Set();
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        this.eventSystem.on('ctrader:connected', () => {
            this.broadcast('system:status', { ctrader: 'connected' });
        });
        
        this.eventSystem.on('ctrader:disconnected', () => {
            this.broadcast('system:status', { ctrader: 'disconnected' });
        });
    }
    
    addConnection(ws) {
        ws.id = Math.random().toString(36).substr(2, 9);
        this.connections.add(ws);
        ws.send(JSON.stringify({ type: 'system:connected', connectionId: ws.id }));
    }
    
    removeConnection(ws) {
        this.connections.delete(ws);
    }
    
    handleMessage(ws, message) {
        if (message.type === 'ping') {
            ws.send(JSON.stringify({ type: 'pong' }));
        }
    }
    
    broadcast(type, data) {
        const message = JSON.stringify({ type, data, timestamp: Date.now() });
        this.connections.forEach(ws => {
            if (ws.readyState === ws.OPEN) {
                ws.send(message);
            }
        });
    }
}

module.exports = ConnectionManager;
