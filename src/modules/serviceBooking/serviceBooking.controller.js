import serviceBookingService from './serviceBooking.service.js';
import createServiceBookingSchema from './serviceBooking.schema.js';
import { validate } from '../../utils/validate.util.js';

const createServiceBooking = async (req, res, next) => {
  try {
    const request = validate(createServiceBookingSchema.create, req.body);
    const data = await serviceBookingService.createServiceBooking(request);

    return res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export default {
  createServiceBooking,
};
