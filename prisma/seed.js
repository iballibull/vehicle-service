import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function dealerSeed() {
  try {
    console.log('Seeding dealer data.');
    const password = await bcrypt.hash('password123', 10);
    await prisma.dealer.create({
      data: {
        name: 'Dealer Test',
        username: 'dealertest',
        password: password,
        address: 'Address Test',
      },
    });
    console.log('Dealer data seeded successfully.');
  } catch (e) {
    console.log(e);
  }
}

dealerSeed();
