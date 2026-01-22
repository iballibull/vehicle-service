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

const findById = async (id) => {
  return await prisma.serviceBooking.findUnique({
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

const findAllServiceBookings = async ({ startDate, endDate, status, page = 1, perPage = 10, search }) => {
  const where = {};

  startDate = startDate ? new Date(startDate) : null;
  endDate = endDate ? new Date(endDate) : null;

  if (startDate && !endDate) {
    endDate = startDate;
  }

  if (!startDate && endDate) {
    startDate = endDate;
  }

  if (startDate && endDate && startDate > endDate) {
    endDate = startDate;
  }

  if (startDate || endDate) {
    where.serviceSchedule = {
      serviceDate: {
        ...(startDate && { gte: startDate }),
        ...(endDate && { lte: endDate }),
      },
    };
  }

  if (status?.length) {
    where.status = {
      in: status,
    };
  }

  if (search) {
    where.OR = [
      { customerName: { contains: search } },
      { phoneNo: { contains: search } },
      { vehicleType: { contains: search } },
      { licensePlate: { contains: search } },
    ];
  }

  const skip = (page - 1) * perPage;
  const take = Number(perPage);

  const [totalItems, data] = await Promise.all([
    prisma.serviceBooking.count({ where }),
    prisma.serviceBooking.findMany({
      where,
      skip,
      take,
      include: {
        serviceSchedule: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    }),
  ]);

  return {
    data,
    meta: {
      total: totalItems,
      page,
      perPage,
      totalPages: Math.ceil(totalItems / perPage),
    },
  };
};

export default {
  createServiceBooking,
  findByIdTransaction,
  updateStatusServiceBooking,
  findById,
  findAllServiceBookings,
};
