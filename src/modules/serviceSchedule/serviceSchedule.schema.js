import Joi from 'joi';

const id = Joi.object({
  id: Joi.string().uuid().required(),
});

const getAll = Joi.object({
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  page: Joi.number().integer().min(1).optional(),
  perPage: Joi.number().integer().min(1).optional(),
}).optional();

const create = Joi.object({
  serviceDate: Joi.date().required(),
  quota: Joi.number().integer().min(1).required(),
}).required();

const update = Joi.object({
  id: Joi.string().uuid().required(),
  serviceDate: Joi.date().optional(),
  quota: Joi.number().integer().min(1).optional(),
}).required();

export default {
  id,
  create,
  update,
  getAll,
};
