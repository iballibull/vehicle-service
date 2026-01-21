import serviceScheduleRepository from './serviceSchedule.repo.js';
import { safeDate } from '../../utils/date.util.js';
import { NOT_FOUND_ERROR, SCHEDULE_EXISTS, CANNOT_UPDATE_SCHEDULE, INVALID_QUOTA } from '../../constants/error.constant.js';
import { ResponseError } from '../../errors/response.error.js';

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

  const schedule = await serviceScheduleRepository.findServiceScheduleByDate();

  if (schedule) {
    throw new ResponseError(400, SCHEDULE_EXISTS, [{ serviceDate: 'schedule already exists for the given date.' }]);
  }

  return serviceScheduleRepository.createServiceSchedule(request);
};

const updateServiceSchedule = async (request) => {
  const serviceSchedule = await serviceScheduleRepository.findServiceScheduleByIdWithBookings(request.id);

  if (!serviceSchedule) {
    throw new ResponseError(404, NOT_FOUND_ERROR, [{ resources: ['service schedule not found'] }]);
  }

  const activeBookingCount = serviceSchedule._count.bookings;

  if (request.quota < activeBookingCount) {
    throw new ResponseError(400, INVALID_QUOTA, [
      { quota: [`cannot set quota to ${request.quota}, there are already ${activeBookingCount} active bookings.`] },
    ]);
  }

  const isDateChange = request.serviceDate !== serviceSchedule.serviceDate.toISOString().split('T')[0];

  if (isDateChange && !activeBookingCount) {
    throw new ResponseError(400, CANNOT_UPDATE_SCHEDULE, [
      {
        schedule: [`cannot change date, there are ${activeBookingCount} active bookings on this schedule.`],
      },
    ]);
  }

  let scheduleWithDate;

  if (request.serviceDate) {
    request.serviceDate = safeDate(request.serviceDate);
    scheduleWithDate = await serviceScheduleRepository.findServiceScheduleByDate(request.serviceDate);
  }

  if (scheduleWithDate && scheduleWithDate.id !== request.id) {
    throw new ResponseError(400, SCHEDULE_EXISTS, [{ serviceDate: 'schedule already exists for the given date.' }]);
  }

  let newRemainingQuota = 0;

  if (request.quota) {
    newRemainingQuota = request.quota - activeBookingCount;
  }

  return serviceScheduleRepository.updateServiceSchedule({
    id: request.id,
    serviceDate: request.serviceDate || serviceSchedule.serviceDate,
    quota: request.quota ?? serviceSchedule.quota,
    remainingQuota: newRemainingQuota ?? serviceSchedule.remainingQuota,
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
