import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Solved } from './models/Solved.js';

dotenv.config();

const users = [
  {
    email: "admin@phisherman.ctf",
    name: "Admin",
    avatar: "AD",
    points: "0",
    score: "0",
    flag1: "",
    flag2: "",
    flag3: "",
    flag4: "",
    flagtime: ""
  },
  {
    email: "afnanothayi232500@gmail.com",
    name: "a.fnan",
    avatar: "AF",
    points: "0",
    score: "0",
    flag1: "",
    flag2: "",
    flag3: "",
    flag4: "",
    flagtime: ""
  },
  {
    email: "kiranng@yahoo.com",
    name: "Crzaycat007",
    avatar: "CC",
    points: "0",
    score: "0",
    flag1: "",
    flag2: "",
    flag3: "",
    flag4: "",
    flagtime: ""
  },
  {
    email: "nivednarayananm2@gmail.com",
    name: "devil_42401",
    avatar: "DV",
    points: "0",
    score: "0",
    flag1: "",
    flag2: "",
    flag3: "",
    flag4: "",
    flagtime: ""
  },
  {
    email: "bansilsaji03@gmail.com",
    name: "bytetyson_71338",
    avatar: "BT",
    points: "0",
    score: "0",
    flag1: "",
    flag2: "",
    flag3: "",
    flag4: "",
    flagtime: ""
  },
  {
    email: "dhaneshupai7@gmail.com",
    name: "n70ue",
    avatar: "NU",
    points: "0",
    score: "0",
    flag1: "",
    flag2: "",
    flag3: "",
    flag4: "",
    flagtime: ""
  }
];

async function seedDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.ATLAS_URL);
    console.log('✅ Connected to MongoDB Atlas!');

    console.log('🗑️  Clearing existing users...');
    await Solved.deleteMany({});

    console.log('👥 Adding users...');
    for (const user of users) {
      await Solved.create(user);
      console.log(`   ✅ Added: ${user.name} (${user.email})`);
    }

    console.log('\n🎉 Database seeded successfully!');
    console.log(`   Total users: ${users.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
}

seedDatabase();
