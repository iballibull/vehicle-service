import { prisma } from '../../config/prisma.config.js';
import { startOfDay } from '../../utils/date.util.js';

const findServiceScheduleById = async (id) => {
  const serviceSchedule = await prisma.serviceSchedule.findUnique({
    where: {
      id,
    },
  });

  return serviceSchedule;
};

const findServiceScheduleByIdAvailable = async (id) => {
  const where = {
    remainingQuota: { gt: 0 },
  };

  const minAllowedDate = startOfDay(new Date());
  minAllowedDate.setDate(minAllowedDate.getDate() + 1);

  const serviceSchedule = await prisma.serviceSchedule.findUnique({
    where: {
      id,
      serviceDate: { gte: minAllowedDate },
      remainingQuota: { gt: 0 },
    },
  });

  return serviceSchedule;
};

const findAllServiceSchedules = async ({ startDate, endDate, startTime, endTime, page = 1, perPage = 10 }) => {
  const where = {};

  if (startDate && endDate) {
    where.serviceDate = { gte: startDate, lte: endDate };
  } else if (startDate) {
    where.serviceDate = { gte: startDate, lte: startDate };
  } else if (endDate) {
    where.serviceDate = { lte: endDate, gte: endDate };
  }

  if (startTime && endTime) {
    where.serviceTime = { gte: startTime, lte: endTime };
  } else if (startTime) {
    where.serviceTime = { gte: startTime, lte: startTime };
  } else if (endTime) {
    where.serviceTime = { lte: endTime, gte: endTime };
  }

  const skip = (page - 1) * perPage;
  const take = perPage;

  const total = await prisma.serviceSchedule.count({ where });

  const serviceSchedules = await prisma.serviceSchedule.findMany({
    where,
    skip,
    take,
    orderBy: [{ serviceDate: 'asc' }, { serviceTime: 'asc' }],
  });

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

const findAllServiceSchedulesAvailable = async ({ startDate, endDate, startTime, endTime, page = 1, perPage = 10 }) => {
  const where = {
    remainingQuota: { gt: 0 },
  };

  const minAllowedDate = startOfDay(new Date());
  minAllowedDate.setDate(minAllowedDate.getDate() + 1);

  if (startDate && startDate < minAllowedDate) {
    startDate = minAllowedDate;
  }

  if (endDate && endDate < minAllowedDate) {
    endDate = minAllowedDate;
  }

  if (startDate && endDate) {
    where.serviceDate = { gte: startDate, lte: endDate };
  } else if (startDate) {
    where.serviceDate = { gte: startDate, lte: startDate };
  } else if (endDate) {
    where.serviceDate = { gte: endDate, lte: endDate };
  } else {
    where.serviceDate = { gte: minAllowedDate };
  }

  if (startTime && endTime) {
    where.serviceTime = { gte: startTime, lte: endTime };
  } else if (startTime) {
    where.serviceTime = { gte: startTime, lte: startTime };
  } else if (endTime) {
    where.serviceTime = { lte: endTime, gte: endTime };
  }

  const skip = (page - 1) * perPage;
  const take = perPage;

  const total = await prisma.serviceSchedule.count({ where });

  const serviceSchedules = await prisma.serviceSchedule.findMany({
    where,
    skip,
    take,
    orderBy: [{ serviceDate: 'asc' }, { serviceTime: 'asc' }],
  });

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

export default {
  findServiceScheduleById,
  findAllServiceSchedules,
  findAllServiceSchedulesAvailable,
  findServiceScheduleByIdAvailable,
};
