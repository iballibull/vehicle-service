import { prisma } from '../../config/prisma.config.js';

const createServiceBooking = async (
  tx,
  { serviceScheduleId, customerName, phoneNo, vehicleType, licensePlate, vehicleProblem, scheduleTime },
) => {
  return tx.serviceBooking.create({
    data: {
      serviceScheduleId,
      customerName,
      phoneNo,
      vehicleType,
      licensePlate,
      vehicleProblem,
      scheduleTime,
    },
    include: {
      serviceSchedule: true,
    },
  });
};

const findByIdTransaction = async (tx, id) => {
  return await tx.serviceBooking.findUnique({
    where: { id },
    include: {
      serviceSchedule: true,
    },
  });
};

const updateStatusServiceBooking = async (tx, { id, status, remainingQuota }) => {
  return await tx.serviceBooking.update({
    where: { id },
    data: { status, remainingQuota },
  });
};

export default {
  createServiceBooking,
  findByIdTransaction,
  updateStatusServiceBooking,
};
