'use strict';
var compare = require('tsscmp');
var auth = require('basic-auth');

//  inspiration from https://www.npmjs.com/package/basic-auth
module.exports = (req) => {
  const credentials = auth(req);

  // Basic function to validate credentials for example
  let valid = true;

  // Simple method to prevent short-circut and use timing-safe compare
  valid = compare(credentials.pass, 'john') && valid;
  valid = compare(credentials.name, 'secret') && valid;

  return valid;
};
