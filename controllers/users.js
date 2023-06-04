const User = require('../models/user');
const { INVALID_DATA_CODE, NOT_FOUND_CODE, DEFAULT_ERROR_CODE } = require('../utils/errorCodes');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(() => {
      res.status(DEFAULT_ERROR_CODE.send({
        message: 'На сервере произошла ошибка',
      }));
    });
};

const getUser = (req, res) => {
  User.findById(req.params.userId).orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(INVALID_DATA_CODE).send({
          message: 'Переданы некорректные данные при получении пользователя',
        });
        return;
      }
      if (err.name === 'DocumentNotFoundError') {
        res.status(NOT_FOUND_CODE).send({
          message: 'Пользователь по указанному _id не найден',
        });
        return;
      }
      res.status(DEFAULT_ERROR_CODE).send({
        message: 'На сервере произошла ошибка',
      });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(INVALID_DATA_CODE).send({
          message: 'Переданы некорректные данные при создании пользователя',
        });
      } else {
        res.status(DEFAULT_ERROR_CODE).send({
          message: 'На сервере произошла ошибка',
        });
      }
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true }).orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(INVALID_DATA_CODE).send({
          message: 'Переданы некорректные данные при обновлении профиля.',
        });
        return;
      }
      if (err.name === 'DocumentNotFoundError') {
        res.status(NOT_FOUND_CODE).send({
          message: 'Пользователь по указанному _id не найден',
        });
        return;
      }
      res.status(DEFAULT_ERROR_CODE).send({
        message: 'На сервере произошла ошибка',
      });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true }).orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(INVALID_DATA_CODE).send({
          message: 'Переданы некорректные данные при обновлении аватара.',
        });
        return;
      }
      if (err.name === 'DocumentNotFoundError') {
        res.status(NOT_FOUND_CODE).send({
          message: 'Пользователь по указанному _id не найден',
        });
        return;
      }
      res.status(DEFAULT_ERROR_CODE).send({
        message: 'На сервере произошла ошибка',
      });
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
};
