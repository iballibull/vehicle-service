import authService from './auth.service.js';
import authSchema from './auth.schema.js';
import { validate } from '../../utils/validate.util.js';

const login = async (req, res, next) => {
  try {
    const request = validate(authSchema.login, req.body);
    const result = await authService.login(request);

    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export default {
  login,
};
