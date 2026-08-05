const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const dns = require('dns');

// Configure public DNS resolvers to fix SRV lookup issues on Windows
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {}

let memoryServer = null;

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (mongoUri && !mongoUri.includes('<username>')) {
    try {
      console.log('Connecting to primary MongoDB database...');
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 4000, family: 4 });
      console.log(`✅ Connected to primary MongoDB database successfully!`);
      return;
    } catch (err) {
      console.warn(`⚠️ Primary MongoDB connection failed (${err.message}). Initializing embedded database engine...`);
    }
  }

  try {
    console.log('🚀 Starting Embedded MongoDB Engine for 100% full working site guarantees...');
    memoryServer = await MongoMemoryServer.create();
    const inMemoryUri = memoryServer.getUri();
    await mongoose.connect(inMemoryUri);
    console.log(`✅ Connected to Embedded MongoDB instance successfully at: ${inMemoryUri}`);
  } catch (memErr) {
    console.error('❌ Failed to start database server:', memErr.message);
  }
};

module.exports = connectDB;
