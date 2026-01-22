import { prisma } from '../../config/prisma.config.js';
import { startOfDay } from '../../utils/date.util.js';

const findServiceScheduleById = async (id) => {
  const serviceSchedule = await prisma.serviceSchedule.findUnique({
    where: {
      id,
    },
    include: {
      bookings: {
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  return serviceSchedule;
};

const findServiceScheduleByIdAvailable = async (id) => {
  const minAllowedDate = startOfDay(new Date());
  minAllowedDate.setDate(minAllowedDate.getDate() + 1);

  const serviceSchedule = await prisma.serviceSchedule.findFirst({
    where: {
      id,
      serviceDate: { gte: minAllowedDate },
      remainingQuota: { gt: 0 },
    },
  });

  return serviceSchedule;
};

const findServiceScheduleByIdAvailableTransaction = async (tx, id) => {
  const minAllowedDate = startOfDay(new Date());
  minAllowedDate.setDate(minAllowedDate.getDate() + 1);

  const serviceSchedule = await tx.serviceSchedule.findFirst({
    where: {
      id,
      serviceDate: { gte: minAllowedDate },
      remainingQuota: { gt: 0 },
    },
  });

  return serviceSchedule;
};

const findAllServiceSchedules = async ({ startDate, endDate, page = 1, perPage = 10 }) => {
  const where = {};

  if (startDate && !endDate) {
    endDate = startDate;
  }

  if (!startDate && endDate) {
    startDate = endDate;
  }

  if (startDate && endDate) {
    where.serviceDate = {
      gte: startDate,
      lte: endDate,
    };
  }

  const skip = (page - 1) * perPage;
  const take = Number(perPage);

  const [total, serviceSchedules] = await Promise.all([
    prisma.serviceSchedule.count({ where }),
    prisma.serviceSchedule.findMany({
      where,
      skip,
      take,
      orderBy: [{ serviceDate: 'asc' }],
    }),
  ]);

  return {
    data: serviceSchedules,
    meta: {
      total,
      page,
      perPage,
      totalPages: Math.ceil(total / perPage),
    },
  };
};

const findAllServiceSchedulesAvailable = async ({ startDate, endDate, page = 1, perPage = 10 }) => {
  const today = startOfDay(new Date());
  const minAllowedDate = new Date(today);
  minAllowedDate.setDate(today.getDate() + 1);

  if (startDate && !endDate) {
    endDate = startDate;
  }

  if (!startDate && endDate) {
    startDate = endDate;
  }

  if (endDate && endDate < minAllowedDate) {
    return {
      data: [],
      meta: {
        total: 0,
        page,
        perPage,
        totalPages: 0,
      },
    };
  }

  if (!startDate || startDate < minAllowedDate) {
    startDate = minAllowedDate;
  }

  const where = {
    remainingQuota: { gt: 0 },
    serviceDate: {
      gte: startDate,
      lte: endDate,
    },
  };

  const skip = (page - 1) * perPage;
  const take = Number(perPage);

  const [total, serviceSchedules] = await Promise.all([
    prisma.serviceSchedule.count({ where }),
    prisma.serviceSchedule.findMany({
      where,
      skip,
      take,
      orderBy: [{ serviceDate: 'asc' }],
    }),
  ]);

  return {
    data: serviceSchedules,
    meta: {
      total,
      page,
      perPage,
      totalPages: Math.ceil(total / perPage),
    },
  };
};

const findServiceScheduleByDate = async (tx, serviceDate) => {
  const serviceSchedule = await tx.serviceSchedule.findFirst({
    where: {
      serviceDate,
    },
  });

  return serviceSchedule;
};

const createServiceSchedule = async (tx, { serviceDate, quota, remainingQuota }) => {
  const newServiceSchedule = await tx.serviceSchedule.create({
    data: {
      serviceDate,
      quota,
      remainingQuota,
    },
  });

  return newServiceSchedule;
};

const findServiceScheduleByIdWithBookings = async (tx, id) => {
  const serviceSchedule = await prisma.serviceSchedule.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          bookings: {
            where: {
              status: { not: 'konfirmasi_batal' },
            },
          },
        },
      },
    },
  });

  return serviceSchedule;
};

const updateServiceSchedule = async (tx, { id, serviceDate, quota, remainingQuota }) => {
  const updatedServiceSchedule = await tx.serviceSchedule.update({
    where: {
      id,
    },
    data: {
      serviceDate,
      quota,
      remainingQuota,
    },
    include: {
      bookings: true,
    },
  });

  return updatedServiceSchedule;
};

export default {
  findServiceScheduleById,
  findAllServiceSchedules,
  findAllServiceSchedulesAvailable,
  findServiceScheduleByIdAvailable,
  createServiceSchedule,
  updateServiceSchedule,
  findServiceScheduleByDate,
  findServiceScheduleByIdWithBookings,
  findServiceScheduleByIdAvailableTransaction,
};
