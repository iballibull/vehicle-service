import Joi from 'joi';

const create = Joi.object({
  serviceScheduleId: Joi.string().uuid().required(),
  customerName: Joi.string().max(100).required(),
  phoneNo: Joi.string().max(15).required(),
  vehicleType: Joi.string().max(50).required(),
  licensePlate: Joi.string().max(20).required(),
  vehicleProblem: Joi.string().max(500).required(),
  scheduleTime: Joi.string()
    .pattern(/^\d{2}:\d{2}(:\d{2})?$/)
    .required(),
}).required();

export default {
  create,
};
