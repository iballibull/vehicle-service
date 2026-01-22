import serviceScheduleRepository from './serviceSchedule.repo.js';
import { safeDate } from '../../utils/date.util.js';
import { NOT_FOUND_ERROR, VALIDATION_ERROR } from '../../constants/error.constant.js';
import { ResponseError } from '../../errors/response.error.js';
import { prisma } from '../../config/prisma.config.js';

const getServiceSchedule = async (request) => {
  let startDate = request.startDate ? safeDate(request.startDate) : null;
  let endDate = request.endDate ? safeDate(request.endDate) : null;

  if (startDate && endDate && startDate > endDate) {
    endDate = startDate;
  }

  return serviceScheduleRepository.findAllServiceSchedules({
    startDate,
    endDate,
    page: request.page,
    perPage: request.perPage,
  });
};

const getServiceScheduleAvailable = async (request) => {
  let startDate = request.startDate ? safeDate(request.startDate) : null;
  let endDate = request.endDate ? safeDate(request.endDate) : null;

  if (startDate && endDate && startDate > endDate) {
    endDate = startDate;
  }

  return serviceScheduleRepository.findAllServiceSchedulesAvailable({
    startDate,
    endDate,
    page: request.page,
    perPage: request.perPage,
  });
};

const findServiceScheduleById = async (request) => {
  return serviceScheduleRepository.findServiceScheduleById(request.id);
};

const findServiceScheduleByIdAvailable = async (request) => {
  return serviceScheduleRepository.findServiceScheduleByIdAvailable(request.id);
};

const createServiceSchedule = async (request) => {
  request.serviceDate = safeDate(request.serviceDate);
  request.remainingQuota = request.quota;

  return prisma.$transaction(async (tx) => {
    const schedule = await serviceScheduleRepository.findServiceScheduleByDate(tx, request.serviceDate);

    if (schedule) {
      throw new ResponseError(400, VALIDATION_ERROR, [{ serviceDate: 'schedule already exists for the given date.' }]);
    }

    return serviceScheduleRepository.createServiceSchedule(tx, request);
  });
};

const updateServiceSchedule = async (request) => {
  return prisma.$transaction(async (tx) => {
    const serviceSchedule = await serviceScheduleRepository.findServiceScheduleByIdWithBookings(tx, request.id);

    if (!serviceSchedule) {
      throw new ResponseError(404, NOT_FOUND_ERROR, [{ resources: ['service schedule not found'] }]);
    }

    const activeBookingCount = serviceSchedule._count.bookings;

    if (request.quota < activeBookingCount) {
      throw new ResponseError(400, VALIDATION_ERROR, [
        { quota: [`cannot set quota to ${request.quota}, there are already ${activeBookingCount} active bookings.`] },
      ]);
    }

    const isDateChange = request.serviceDate !== serviceSchedule.serviceDate.toISOString().split('T')[0];

    if (isDateChange && !activeBookingCount) {
      throw new ResponseError(400, VALIDATION_ERROR, [
        {
          schedule: [`cannot change date, there are ${activeBookingCount} active bookings on this schedule.`],
        },
      ]);
    }

    let scheduleWithDate;

    if (request.serviceDate) {
      request.serviceDate = safeDate(request.serviceDate);
      scheduleWithDate = await serviceScheduleRepository.findServiceScheduleByDate(tx, request.serviceDate);
    }

    if (scheduleWithDate && scheduleWithDate.id !== request.id) {
      throw new ResponseError(400, VALIDATION_ERROR, [{ serviceDate: 'schedule already exists for the given date.' }]);
    }

    let newRemainingQuota = 0;

    if (request.quota) {
      newRemainingQuota = request.quota - activeBookingCount;
    }

    return serviceScheduleRepository.updateServiceSchedule(tx, {
      id: request.id,
      serviceDate: request.serviceDate || serviceSchedule.serviceDate,
      quota: request.quota ?? serviceSchedule.quota,
      remainingQuota: newRemainingQuota ?? serviceSchedule.remainingQuota,
    });
  });
};

export default {
  getServiceSchedule,
  getServiceScheduleAvailable,
  findServiceScheduleById,
  findServiceScheduleByIdAvailable,
  createServiceSchedule,
  updateServiceSchedule,
};
