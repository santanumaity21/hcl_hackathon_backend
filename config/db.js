const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();

        console.log('MongoDB Memory Server URI:', uri);

        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('In-memory MongoDB connected');
    } catch (error) {
        console.error('Error connecting to in-memory MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
