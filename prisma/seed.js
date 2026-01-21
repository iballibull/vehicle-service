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

async function serviceScheduleSeed() {
  try {
    console.log('Seeding service schedule data.');

    const createDate = (daysFromNow) => {
      const date = new Date();
      date.setDate(date.getDate() + daysFromNow);
      date.setHours(0, 0, 0, 0);
      return date;
    };

    for (let day = 1; day <= 7; day++) {
      const serviceDate = createDate(day - 1);

      let quota = 10;

      if (day === 1) {
        quota = 5;
      } else if (day === 2) {
        quota = 15;
      } else if (day === 3) {
        quota = 3;
      }

      await prisma.serviceSchedule.create({
        data: {
          serviceDate,
          quota,
          remainingQuota: quota,
        },
      });
    }

    console.log(`Created service schedule data successfully.`);
  } catch (e) {
    console.error('Error seeding service schedules:', e);
  }
}

async function serviceBookingSeed() {
  try {
    console.log('Seeding service booking data.');

    const schedules = await prisma.serviceSchedule.findMany({
      take: 3,
    });

    for (const schedule of schedules) {
      await prisma.serviceBooking.create({
        data: {
          serviceScheduleId: schedule.id,
          customerName: `Customer for ${schedule.serviceDate.toDateString()}`,
          phoneNo: `0812345${Math.floor(Math.random() * 1000)}`,
          vehicleType: 'Car',
          licensePlate: `VEH-${Math.floor(Math.random() * 1000)}`,
          vehicleProblem: 'Regular maintenance',
          scheduleTime: '09:00:00',
        },
      });

      await prisma.serviceSchedule.update({
        where: { id: schedule.id },
        data: {
          remainingQuota: schedule.remainingQuota - 1,
        },
      });
    }

    console.log('Service booking data seeded successfully.');
  } catch (e) {
    console.error('Error seeding service bookings:', e);
  }
}

async function main() {
  await dealerSeed();
  await serviceScheduleSeed();
  await serviceBookingSeed();
}

main();
