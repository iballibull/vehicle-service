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

const updateStatus = Joi.object({
  id: Joi.string().uuid().required(),
  status: Joi.string().valid('menunggu_konfirmasi', 'konfirmasi_batal', 'konfirmasi_datang', 'tidak_datang', 'datang').required(),
}).required();

const id = Joi.object({
  id: Joi.string().uuid().required(),
}).required();

const getAll = Joi.object({
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  status: Joi.alternatives()
    .try(
      Joi.string().valid('menunggu_konfirmasi', 'konfirmasi_batal', 'konfirmasi_datang', 'tidak_datang', 'datang'),
      Joi.array().items(Joi.string().valid('menunggu_konfirmasi', 'konfirmasi_batal', 'konfirmasi_datang', 'tidak_datang', 'datang')),
    )
    .optional(),
  page: Joi.number().integer().min(1).optional(),
  perPage: Joi.number().integer().min(1).optional(),
  search: Joi.string().max(100).optional(),
});

export default {
  create,
  updateStatus,
  id,
  getAll,
};
