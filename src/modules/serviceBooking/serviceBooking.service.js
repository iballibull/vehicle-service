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

export default {
  createServiceBooking,
};
