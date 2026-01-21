import serviceScheduleService from './serviceSchedule.service.js';
import getServiceScheduleSchema from './serviceSchedule.schema.js';
import { validate } from '../../utils/validate.util.js';

const fetchServiceSchedule = async (req, res, next) => {
  try {
    const request = validate(getServiceScheduleSchema.getAll, req.query);

    const result = await serviceScheduleService.getServiceSchedule(request);

    return res.status(200).json({ success: true, data: result.data, meta: result.meta });
  } catch (err) {
    next(err);
  }
};

const fetchServiceScheduleAvailable = async (req, res, next) => {
  try {
    const request = validate(getServiceScheduleSchema.getAll, req.query);

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

const createServiceSchedule = async (req, res, next) => {
  try {
    const request = validate(getServiceScheduleSchema.create, req.body);
    const serviceSchedule = await serviceScheduleService.createServiceSchedule(request);

    return res.status(201).json({ success: true, data: serviceSchedule });
  } catch (err) {
    next(err);
  }
};

const updateServiceSchedule = async (req, res, next) => {
  try {
    const request = validate(getServiceScheduleSchema.update, { ...req.body, ...req.params });
    const serviceSchedule = await serviceScheduleService.updateServiceSchedule(request);

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
  createServiceSchedule,
  updateServiceSchedule,
};
