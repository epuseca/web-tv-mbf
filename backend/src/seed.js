require('dotenv').config();

const mongoose = require('mongoose');
const User = require('./models/User');

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const username = process.env.ADMIN_USERNAME || 'admin';
        const password = process.env.ADMIN_PASSWORD || 'admin123';

        // Check if admin already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            console.log(`⚠️  Admin user "${username}" already exists. Skipping seed.`);
            process.exit(0);
        }

        // Create admin user
        const admin = new User({ username, password });
        await admin.save();

        console.log(`✅ Admin user created successfully`);
        console.log(`   Username: ${username}`);
        console.log(`   Password: ${password}`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Seed failed:', error.message);
        process.exit(1);
    }
};

seedAdmin();
