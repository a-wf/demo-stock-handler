import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Credential, CredentialWithToken } from 'token-auth';

import { server } from '../config';

async function createToken({ username, password }: Credential): Promise<string> {
  const hashedPassword: string = await bcrypt.hash(password, 10);
  const credentials: Credential = {
    username,
    password: hashedPassword
  };

  const token = jwt.sign(credentials, server.token_secret);
  return token;
}

async function validateToken({ username, password, token }: CredentialWithToken): Promise<boolean | string> {
  try {
    const decoded: Credential = Object.assign({}, { username: '', password: '' }, jwt.verify(token, server.token_secret));
    let valid = true;
    valid = username === decoded.username && valid;
    valid = (await bcrypt.compare(password, decoded.password)) && valid;

    return valid;
  } catch (error) {
    return error.message;
  }
}

module.exports = { createToken, validateToken };
