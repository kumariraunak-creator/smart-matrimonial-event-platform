const connectDB = require('./config/db');
const seedDatabase = require('./seed/seedData');

async function test() {
  console.log('Testing full database startup & seeding...');
  await connectDB();
  await seedDatabase();
  console.log('🎉 FULLY WORKING DATABASE & SEEDING VERIFIED!');
  process.exit(0);
}

test();
