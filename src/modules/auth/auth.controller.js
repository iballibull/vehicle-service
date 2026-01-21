import authService from './auth.service.js';

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);

    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export default {
  login,
};
