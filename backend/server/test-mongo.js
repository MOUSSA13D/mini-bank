const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
  try {
    console.log('🔍 Testing MongoDB connection...');
    console.log('📋 Connection URI:', process.env.MONGODB_URI ? 'Found (hidden for security)' : 'NOT FOUND');
    console.log('📋 Database Name:', process.env.DB_NAME || 'NOT FOUND');

    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI environment variable is not set');
      console.log('💡 Please check your .env file and ensure MONGODB_URI is properly configured');
      return;
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.DB_NAME,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });

    console.log('✅ MongoDB connection successful!');
    console.log('📊 Connected to:', mongoose.connection.name);
    console.log('🌐 Host:', mongoose.connection.host);

    await mongoose.connection.close();
    console.log('🔒 Connection closed');

  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);

    if (error.message.includes('ENOTFOUND')) {
      console.log('💡 This is a DNS resolution error. Possible causes:');
      console.log('   - Network connectivity issues');
      console.log('   - VPN or proxy blocking MongoDB Atlas domains');
      console.log('   - DNS server configuration');
      console.log('   - MongoDB Atlas cluster URL is incorrect');
    }

    if (error.message.includes('Authentication failed')) {
      console.log('💡 Authentication error. Please check:');
      console.log('   - Username and password in connection string');
      console.log('   - Database user permissions in MongoDB Atlas');
    }

    if (error.message.includes('getaddrinfo')) {
      console.log('💡 Network error. Please check:');
      console.log('   - Internet connection');
      console.log('   - Firewall settings');
      console.log('   - Network restrictions');
    }
  }
};

testConnection();
