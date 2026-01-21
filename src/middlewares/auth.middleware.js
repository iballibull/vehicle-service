import { UNAUTHORIZED_ERROR } from '../constants/error.constant.js';
import { ResponseError } from '../errors/response.error.js';
import jwt from 'jsonwebtoken';
import process from 'process';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    throw new ResponseError(401, UNAUTHORIZED_ERROR);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (err) {
    next(err);
  }
};

export { authenticateToken };
