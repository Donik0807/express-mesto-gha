const jsonwebtoken = require('jsonwebtoken');
const { AUTH_ERROR_CODE } = require('../utils/errorCodes');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    res.status(AUTH_ERROR_CODE).send({
      message: 'Необходима авторизация',
    });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jsonwebtoken.verify(token, 'some-secret-key');
  } catch (err) {
    res.status(AUTH_ERROR_CODE).send({
      message: 'Необходима авторизация',
    });
  }
  req.user = payload;
  next();
};

module.exports = auth;
