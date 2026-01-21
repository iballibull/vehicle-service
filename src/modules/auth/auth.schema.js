import Joi from 'joi';

const login = Joi.object({
  username: Joi.string().max(50).required(),
  password: Joi.string().required(),
});

export default {
  login,
};
