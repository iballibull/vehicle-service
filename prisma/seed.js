import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { safeTime } from '../src/utils/time.util.js';

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

async function serviceScheduleSeed() {
  try {
    console.log('Seeding service schedule data.');

    const createDate = (daysFromNow) => {
      const date = new Date();
      date.setDate(date.getDate() + daysFromNow);
      date.setHours(0, 0, 0, 0);
      return date;
    };

    const serviceTimes = ['09:00:00', '11:00:00', '13:00:00', '15:00:00', '17:00:00'];

    for (let day = 1; day <= 7; day++) {
      const serviceDate = createDate(day - 1);

      for (const timeSlot of serviceTimes) {
        const serviceTime = safeTime(timeSlot);

        let quota = 10;

        const hour = Number(timeSlot.slice(0, 2));

        if (day === 1 && hour === 9) {
          quota = 5;
        } else if (day === 2 && hour === 11) {
          quota = 15;
        } else if (day === 3 && hour === 13) {
          quota = 3;
        }

        await prisma.serviceSchedule.create({
          data: {
            serviceDate,
            serviceTime,
            quota,
            remainingQuota: quota,
          },
        });
      }
    }

    console.log(`Created ${7 * serviceTimes.length}`);
  } catch (e) {
    console.error('Error seeding service schedules:', e);
  }
}

async function main() {
  await dealerSeed();
  await serviceScheduleSeed();
}

main();
