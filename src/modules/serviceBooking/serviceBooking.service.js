import { prisma } from '../../config/prisma.config.js';
import serviceScheduleRepo from '../serviceSchedule/serviceSchedule.repo.js';
import serviceBookingRepo from './serviceBooking.repo.js';
import { ResponseError } from '../../errors/response.error.js';
import { NOT_FOUND_ERROR, VALIDATION_ERROR } from '../../constants/error.constant.js';

const createServiceBooking = async (request) => {
  const { serviceScheduleId, customerName, phoneNo, vehicleType, licensePlate, vehicleProblem, scheduleTime } = request;
  return prisma.$transaction(async (tx) => {
    const serviceSchedule = await serviceScheduleRepo.findServiceScheduleByIdAvailableTransaction(tx, serviceScheduleId);

    if (!serviceSchedule) {
      throw new ResponseError(404, NOT_FOUND_ERROR, [{ resources: ['service schedule not found'] }]);
    }

    if (serviceSchedule.remainingQuota <= 0) {
      throw new ResponseError(400, VALIDATION_ERROR, [{ resources: ['no remaining quota on selected schedule'] }]);
    }

    const serviceBooking = await serviceBookingRepo.createServiceBooking(tx, {
      serviceScheduleId,
      customerName,
      phoneNo,
      vehicleType,
      licensePlate,
      vehicleProblem,
      scheduleTime,
    });

    if (!serviceBooking) {
      throw new Error('Failed to create service booking');
    }

    const updatedServiceSchedule = await serviceScheduleRepo.updateServiceSchedule(tx, {
      id: serviceScheduleId,
      remainingQuota: serviceSchedule.remainingQuota - 1,
      serviceDate: serviceSchedule.serviceDate,
      quota: serviceSchedule.quota,
    });

    if (!updatedServiceSchedule) {
      throw new Error('Failed to update service schedule quota');
    }

    const serviceBookingWithSchedule = await serviceBookingRepo.findByIdTransaction(tx, serviceBooking.id);

    return serviceBookingWithSchedule;
  });
};

const updateStatusServiceBooking = async (request) => {
  const { id, status } = request;

  return prisma.$transaction(async (tx) => {
    const serviceBooking = await serviceBookingRepo.findByIdTransaction(tx, id);

    if (!serviceBooking) {
      throw new ResponseError(404, NOT_FOUND_ERROR, [{ resources: ['service booking not found'] }]);
    }

    const schedule = serviceBooking.serviceSchedule;
    let remainingQuota = schedule.remainingQuota;

    const wasCancelled = serviceBooking.status === 'konfirmasi_batal';
    const willBeCancelled = status === 'konfirmasi_batal';

    if (serviceBooking.status === status) {
      return serviceBooking;
    }

    if (!wasCancelled && willBeCancelled) {
      remainingQuota += 1;
    }

    if (wasCancelled && !willBeCancelled) {
      if (remainingQuota <= 0) {
        throw new ResponseError(400, VALIDATION_ERROR, [{ resources: ['no remaining quota available'] }]);
      }
      remainingQuota -= 1;
    }

    await serviceBookingRepo.updateStatusServiceBooking(tx, {
      id,
      status,
    });

    await serviceScheduleRepo.updateServiceSchedule(tx, {
      id: schedule.id,
      remainingQuota,
      quota: schedule.quota,
      serviceDate: schedule.serviceDate,
    });

    const booking = await serviceBookingRepo.findByIdTransaction(tx, id);

    return booking;
  });
};

const findById = async (request) => {
  const { id } = request;
  const serviceBooking = await serviceBookingRepo.findById(id);

  if (!serviceBooking) {
    throw new ResponseError(404, NOT_FOUND_ERROR, [{ resources: ['service booking not found'] }]);
  }

  return serviceBooking;
};

const getServiceBookings = async (request) => {
  let { startDate, endDate, status } = request;

  if (startDate && !endDate) endDate = startDate;
  if (!startDate && endDate) startDate = endDate;

  if (status && !Array.isArray(status)) {
    status = [status];
  }

  return serviceBookingRepo.findAllServiceBookings({
    startDate,
    endDate,
    status,
    page: request.page,
    perPage: request.perPage,
    search: request.search,
  });
};

export default {
  createServiceBooking,
  updateStatusServiceBooking,
  findById,
  getServiceBookings,
};
