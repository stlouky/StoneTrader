const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const { createServer } = require('http');
const { WebSocketServer } = require('ws');
require('dotenv').config();

const EventSystem = require('./events/EventSystem');
const CTraderAPI = require('./services/CTraderAPI');
const ConnectionManager = require('./services/ConnectionManager');

// Import API routes
const authRoutes = require('./api/auth');
const tradingRoutes = require('./api/trading');
const accountRoutes = require('./api/accounts'); // NEW: Account management routes

class StoneTraderServer {
    constructor() {
        this.app = express();
        this.server = createServer(this.app);
        this.wss = new WebSocketServer({ server: this.server });
        
        // Initialize core services
        this.eventSystem = new EventSystem();
        this.ctraderAPI = new CTraderAPI(this.eventSystem);
        this.connectionManager = new ConnectionManager(this.wss, this.eventSystem);
        
        this.setupMiddleware();
        this.setupRoutes();
        this.setupWebSocket();
        
        console.log('🏛️ StoneTrader Server initialized with real cTrader API');
    }
    
    setupMiddleware() {
        // Security
        this.app.use(helmet());
        this.app.use(cors({
            origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
            credentials: true
        }));
        
        // Session management
        this.app.use(session({
            secret: process.env.SESSION_SECRET || 'fallback-secret',
            resave: false,
            saveUninitialized: false,
            cookie: { 
                secure: false, // Set to true in production with HTTPS
                maxAge: 24 * 60 * 60 * 1000 // 24 hours
            }
        }));
        
        // Rate limiting
        const limiter = rateLimit({
            windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
            max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 1000,
            message: { error: 'Too many requests' }
        });
        this.app.use('/api', limiter);
        
        // Body parsing
        this.app.use(express.json({ limit: '1mb' }));
        this.app.use(express.urlencoded({ extended: true }));
    }
    
    setupRoutes() {
        // Health check
        this.app.get('/health', (req, res) => {
            res.json({ 
                status: 'ok', 
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
                ctrader: "API initialized"
            });
        });
        
        // Root endpoint with API documentation
        this.app.get('/', (req, res) => {
            res.json({
                message: '🏛️ StoneTrader Backend API',
                version: '1.0.0',
                status: 'running',
                endpoints: {
                    health: '/health',
                    auth: '/auth/*',
                    trading: '/api/trading/*',
                    accounts: '/api/accounts/*' // NEW!
                },
                docs: 'https://github.com/stlouky/StoneTrader'
            });
        });
        
        // Inject cTrader API into routes
        // authRoutes.setCTraderAPI(this.ctraderAPI); // Removed - not needed
        // tradingRoutes.setCTraderAPI(this.ctraderAPI); // Not needed
        
        // API routes
        this.app.use('/auth', authRoutes);
        this.app.use('/api/trading', tradingRoutes); // Re-enabled for future use
        this.app.use('/api/accounts', accountRoutes); // NEW: Account management routes
        
        // 404 handler
        this.app.use('*', (req, res) => {
            res.status(404).json({ 
                error: 'Endpoint not found',
                path: req.originalUrl,
                method: req.method,
                timestamp: new Date().toISOString()
            });
        });
        
        // Error handler
        this.app.use((error, req, res, next) => {
            console.error('❌ Server error:', error);
            res.status(500).json({ 
                error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
                timestamp: new Date().toISOString()
            });
        });
    }
    
    setupWebSocket() {
        this.wss.on('connection', (ws) => {
            console.log('📡 WebSocket client connected');
            this.connectionManager.addConnection(ws);
            
            ws.on('message', (data) => {
                try {
                    const message = JSON.parse(data);
                    this.connectionManager.handleMessage(ws, message);
                } catch (error) {
                    ws.send(JSON.stringify({ error: 'Invalid message' }));
                }
            });
            
            ws.on('close', () => {
                this.connectionManager.removeConnection(ws);
            });
        });
    }
    
    start() {
        const port = process.env.PORT || 3001;
        this.server.listen(port, () => {
            console.log(`🏛️ StoneTrader Backend running on port ${port}`);
            console.log(`🔗 cTrader OAuth: http://localhost:${port}/auth/login`);
            console.log(`📊 Health check: http://localhost:${port}/health`);
            console.log(`🏦 Account API: http://localhost:${port}/api/accounts`); // NEW!
            console.log(`⚠️  Remember to set CTRADER_CLIENT_SECRET in .env`);
            
            // Log available endpoints
            console.log(`
📋 Available API Endpoints:
   GET  /health              - Health check
   GET  /                    - API documentation
   
   🔐 Auth endpoints:
   GET  /auth/login          - Start OAuth login
   GET  /auth/callback       - OAuth callback
   GET  /auth/user           - Get current user
   POST /auth/logout         - Logout user
   
   📊 Trading endpoints:
   GET  /api/trading/status  - Trading status
   POST /api/trading/order   - Place order
   
   🏦 Account endpoints:     [NEW!]
   GET  /api/accounts        - List all accounts
   GET  /api/accounts/current - Get active account  
   POST /api/accounts/switch - Switch active account
   GET  /api/accounts/:id    - Get account details
            `);
        });
    }
}

const server = new StoneTraderServer();
server.start();

module.exports = StoneTraderServer;