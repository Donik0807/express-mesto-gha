const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const User = require('../models/user');
const ConflictError = require('../utils/ConflictError');
const AuthError = require('../utils/AuthError');
const InvalidDataError = require('../utils/InvalidDataError');
const NotFoundError = require('../utils/NotFoundError');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  User.findById(req.params.userId).orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      let customError = err;
      if (err.name === 'CastError') {
        customError = new InvalidDataError('Переданы некорректные данные пользователя');
      }
      if (err.name === 'DocumentNotFoundError') {
        customError = new NotFoundError('Пользователь не найден');
      }
      next(customError);
    });
};

const createUser = (req, res, next) => {
  const { password, ...rest } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      ...rest,
      password: hash,
    })).select('-password')
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      let customError = err;
      if (err.name === 'ValidationError') {
        customError = new ConflictError('Пользователь с таким email уже существует');
      }
      next(customError);
    });
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true }).orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      let customError = err;

      if (err.name === 'ValidationError' || err.name === 'CastError') {
        customError = new InvalidDataError('Переданы некорректные данные при обновлении профиля');
      }

      if (err.name === 'DocumentNotFoundError') {
        customError = new NotFoundError('Пользователь по указанному _id не найден');
      }

      next(customError);
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true }).orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      let customError = err;

      if (err.name === 'ValidationError' || err.name === 'CastError') {
        customError = new InvalidDataError('Переданы некорректные данные при обновлении аватара');
      }

      if (err.name === 'DocumentNotFoundError') {
        customError = new NotFoundError('Пользователь по указанному _id не найден');
      }

      next(customError);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password').orFail()
    .then((user) => bcrypt.compare(password, user.password)
      .then((matched) => {
        if (!matched) {
          return Promise.reject(new AuthError('Неправильная почта или пароль'));
        }
        const token = jsonwebtoken.sign({ _id: user._id }, 'some-secret-key', {
          expiresIn: '7d',
        });

        return res.send({ token });
      }))
    .catch((err) => {
      let customError = err;

      if (err.name === 'DocumentNotFoundError') {
        customError = new AuthError('Неправильная почта или пароль');
      }

      next(customError);
    });
};

const getMe = (req, res, next) => {
  const { _id } = req.user;

  User.findById(_id).orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      let customError = err;
      if (err.name === 'CastError') {
        customError = new InvalidDataError('Переданы некорректные данные пользователя');
      }
      if (err.name === 'DocumentNotFoundError') {
        customError = new NotFoundError('Пользователь не найден');
      }
      next(customError);
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
  login,
  getMe,
};
