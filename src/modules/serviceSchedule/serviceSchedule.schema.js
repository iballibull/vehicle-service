import Joi from 'joi';

const id = Joi.object({
  id: Joi.string().uuid().required(),
});

export default {
  id,
};
