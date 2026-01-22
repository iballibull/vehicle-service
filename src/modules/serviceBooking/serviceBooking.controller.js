import serviceBookingService from './serviceBooking.service.js';
import serviceBookingSchema from './serviceBooking.schema.js';
import { validate } from '../../utils/validate.util.js';

const createServiceBooking = async (req, res, next) => {
  try {
    const request = validate(serviceBookingSchema.create, req.body);
    const data = await serviceBookingService.createServiceBooking(request);

    return res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const updateStatusServiceBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const request = validate(serviceBookingSchema.updateStatus, { id, status });
    const data = await serviceBookingService.updateStatusServiceBooking(request);

    return res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const findById = async (req, res, next) => {
  try {
    const request = validate(serviceBookingSchema.id, req.params);

    const data = await serviceBookingService.findById(request);

    return res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export default {
  createServiceBooking,
  updateStatusServiceBooking,
  findById,
};
