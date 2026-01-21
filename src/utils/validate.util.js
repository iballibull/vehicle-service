import { ResponseError } from '../errors/response.error.js';
import { VALIDATION_ERROR } from '../constants/error.constant.js';

export const validate = (schema, request) => {
  const result = schema.validate(request, {
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: true,
  });

  if (result.error) {
    const errors = {};
    result.error.details.forEach((detail) => {
      const field = detail.path.join('.');
      if (!errors[field]) errors[field] = [];
      const msg = detail.message.replace(/["]/g, '');
      errors[field].push(msg);
    });

    throw new ResponseError(422, VALIDATION_ERROR, errors);
  }

  return result.value;
};
