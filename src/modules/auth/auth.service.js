import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import authRepository from './auth.repo.js';
import { jwtConfig } from '../../config/jwt.config.js';
import { ResponseError } from '../../errors/response.error.js';
import { AUTHENTICATION_ERROR } from '../../constants/error.constant.js';

const login = async (request) => {
  const dealer = await authRepository.findUserByUsername(request?.username);

  if (!dealer) {
    throw new ResponseError(401, AUTHENTICATION_ERROR, { credentials: ['Username or password wrong'] });
  }

  const match = await bcrypt.compare(request?.password, dealer?.password);

  if (!match) {
    throw new ResponseError(401, AUTHENTICATION_ERROR, { credentials: ['Username or password wrong'] });
  }

  const token = jwt.sign(
    {
      name: dealer?.name,
      address: dealer?.address,
    },
    jwtConfig.secret,
    {
      expiresIn: jwtConfig?.expiresIn,
    },
  );

  return { token };
};

export default {
  login,
};
