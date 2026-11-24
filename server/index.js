
const express = require('express');
const cors = require('cors');
const connectToMongo = require('./db');

const app = express();

const PORT = process.env.PORT || 8181;

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// Routes
app.use('/api/auth', require('./routes/auth'));

// Home route
app.get('/', (req, res) => {
    res.send('StayHealthy Server is Running!');
});

// Start server after MongoDB connection
const startServer = async () => {
    try {
        await connectToMongo();

        app.listen(PORT, () => {
            console.log(
                `Server is running on port http://localhost:${PORT}`
            );
        });

    } catch (error) {
        console.error('Server startup failed:', error.message);
        process.exit(1);
    }
};

startServer();
