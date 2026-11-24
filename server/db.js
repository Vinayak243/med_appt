
const mongoose = require('mongoose');

const connectToMongo = async () => {
    const host = process.env.MONGO_HOST;
    const port = process.env.MONGO_PORT;
    const username = process.env.MONGO_USERNAME || 'root';
    const password = process.env.MONGO_PASSWORD;

    if (!host || !port || !password) {
        throw new Error('MongoDB environment variables are missing!');
    }

    const mongoURI =
        `mongodb://${encodeURIComponent(username)}:${encodeURIComponent(password)}@${host}:${port}/?authSource=admin`;

    await mongoose.connect(mongoURI, {
        dbName: 'stayhealthybeta1',
        serverSelectionTimeoutMS: 15000
    });

    console.log('Connected to Mongo Successfully');
};

module.exports = connectToMongo;
