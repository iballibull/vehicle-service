import serviceScheduleService from './serviceSchedule.service.js';
import getServiceScheduleSchema from './serviceSchedule.schema.js';
import { validate } from '../../utils/validate.util.js';

const fetchServiceSchedule = async (req, res, next) => {
  try {
    const request = {
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      startTime: req.query.startTime,
      endTime: req.query.endTime,
      page: req.query.page || 1,
      perPage: req.query.perPage || 10,
    };

    const result = await serviceScheduleService.getServiceSchedule(request);

    return res.status(200).json({ success: true, data: result.data, meta: result.meta });
  } catch (err) {
    next(err);
  }
};

const fetchServiceScheduleAvailable = async (req, res, next) => {
  try {
    const request = {
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      startTime: req.query.startTime,
      endTime: req.query.endTime,
      page: req.query.page || 1,
      perPage: req.query.perPage || 10,
    };

    const result = await serviceScheduleService.getServiceScheduleAvailable(request);

    return res.status(200).json({ success: true, data: result.data, meta: result.meta });
  } catch (err) {
    next(err);
  }
};

const findServiceScheduleById = async (req, res, next) => {
  try {
    const request = validate(getServiceScheduleSchema.id, req.params);
    const serviceSchedule = await serviceScheduleService.findServiceScheduleById(request);

    return res.status(200).json({ success: true, data: serviceSchedule });
  } catch (err) {
    next(err);
  }
};
const findServiceScheduleByIdAvailable = async (req, res, next) => {
  try {
    const request = validate(getServiceScheduleSchema.id, req.params);
    const serviceSchedule = await serviceScheduleService.findServiceScheduleByIdAvailable(request);

    return res.status(200).json({ success: true, data: serviceSchedule });
  } catch (err) {
    next(err);
  }
};

export default {
  fetchServiceSchedule,
  fetchServiceScheduleAvailable,
  findServiceScheduleById,
  findServiceScheduleByIdAvailable,
};
