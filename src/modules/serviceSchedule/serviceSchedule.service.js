import serviceScheduleRepository from './serviceSchedule.repo.js';
import { safeTime } from '../../utils/time.util.js';
import { safeDate } from '../../utils/date.util.js';

const getServiceSchedule = async (request) => {
  let startDate = request.startDate ? safeDate(request.startDate) : null;
  let endDate = request.endDate ? safeDate(request.endDate) : null;

  let startTime = request.startTime ? safeTime(request.startTime) : null;
  let endTime = request.endTime ? safeTime(request.endTime) : null;

  if (startDate && endDate && startDate > endDate) {
    endDate = startDate;
  }

  if (startTime && endTime && startTime > endTime) {
    endTime = startTime;
  }

  return serviceScheduleRepository.findAllServiceSchedules({
    startDate,
    endDate,
    startTime,
    endTime,
    page: request.page,
    perPage: request.perPage,
  });
};

const getServiceScheduleAvailable = async (request) => {
  let startDate = request.startDate ? safeDate(request.startDate) : null;
  let endDate = request.endDate ? safeDate(request.endDate) : null;

  let startTime = request.startTime ? safeTime(request.startTime) : null;
  let endTime = request.endTime ? safeTime(request.endTime) : null;

  if (startDate && endDate && startDate > endDate) {
    endDate = startDate;
  }

  if (startTime && endTime && startTime > endTime) {
    endTime = startTime;
  }

  return serviceScheduleRepository.findAllServiceSchedulesAvailable({
    startDate,
    endDate,
    startTime,
    endTime,
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

export default {
  getServiceSchedule,
  getServiceScheduleAvailable,
  findServiceScheduleById,
  findServiceScheduleByIdAvailable,
};
