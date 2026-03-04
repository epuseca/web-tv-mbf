require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const imageRoutes = require('./routes/imageRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ──────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(logger);

// ─── Routes ─────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
    res.status(200).json({
        success: true,
        message: 'WebTV Digital Signage API is running',
        timestamp: new Date().toISOString(),
    });
});

app.use('/api/images', imageRoutes);
app.use('/api/auth', authRoutes);

// ─── 404 Handler ────────────────────────────────────────
app.use((_req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
});

// ─── Error Handler ──────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ───────────────────────────────────────
const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`\n🚀 Server running on 0.0.0.0:${PORT}`);
            console.log(`📡 API: http://10.5.1.121:${PORT}/api`);
            console.log(`💚 Health: http://10.5.1.121:${PORT}/api/health\n`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error.message);
        process.exit(1);
    }
};

startServer();
