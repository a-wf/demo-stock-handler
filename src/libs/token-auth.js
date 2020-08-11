'use strict';

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { server } = require('../config');

async function createToken({ username, password }) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const credentials = await {
    username,
    password: hashedPassword
  };

  const token = jwt.sign(credentials, server.token_secret);
  return token;
}

async function validateToken({ username, password, token }) {
  const decoded = jwt.verify(token, server.token_secret);
  let valid = true;
  valid = username === decoded.username && valid;
  valid = (await bcrypt.compare(password, decoded.password)) && valid;

  return valid;
}

module.exports = { createToken, validateToken };
