import { connectDB } from '../lib/mongoose';
import { seedDatabase } from '../lib/data/seedData';

async function main() {
  try {
    console.log('🚀 Starting database seeding...');
    
    // Connect to database
    await connectDB();
    console.log('✅ Connected to database');
    
    // Seed the database
    await seedDatabase();
    
    console.log('🎉 Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

main(); 