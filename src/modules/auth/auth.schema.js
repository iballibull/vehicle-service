import Joi from 'joi';

const login = Joi.object({
  username: Joi.string().max(50).required(),
  password: Joi.string().required(),
})
  .required()
  .unknown(false);

export default {
  login,
};
