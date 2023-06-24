const jsonwebtoken = require('jsonwebtoken');
const AuthError = require('../utils/AuthError');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new AuthError('Необходима авторизация'));
    return;
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jsonwebtoken.verify(token, 'some-secret-key');
  } catch (err) {
    next(new AuthError('Необходима авторизация'));
    return;
  }
  req.user = payload;
  next();
};

module.exports = auth;
