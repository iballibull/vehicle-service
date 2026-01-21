import { ResponseError } from '../errors/response.error.js';
import { INTERNAL_SERVER_ERROR } from '../constants/error.constant.js';
import process from 'process';

const errorMiddleware = (err, req, res, next) => {
  if (!err) {
    return next();
  }

  if (err instanceof ResponseError) {
    return res
      .status(err.status)
      .json({
        success: false,
        message: err.message,
        errors: err.errors,
      })
      .end();
  }

  return res
    .status(500)
    .json({
      success: false,
      message: INTERNAL_SERVER_ERROR,
      errors: {
        global: [process.env.APP_DEBUG ? err.message : 'Internal server error'],
      },
    })
    .end();
};

export { errorMiddleware };
