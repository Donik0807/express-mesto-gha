const { Joi } = require('celebrate');

const loginValidator = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
};

const registerValidator = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    avatar: Joi.string().uri(),
    about: Joi.string().min(2).max(30),
  }),
};

const getUserValidator = {
  params: Joi.object().keys({
    userId: Joi.string().required().length(24),
  }),
};

const updateUserValidator = {
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
};

const updateAvatarValidator = {
  body: Joi.object().keys({
    avatar: Joi.string().required().uri(),
  }),
};

const createCardValidator = {
  body: {
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().uri(),
  },
};

const likedeleteValidator = {
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24),
  }),
};

module.exports = {
  loginValidator,
  registerValidator,
  getUserValidator,
  updateUserValidator,
  updateAvatarValidator,
  createCardValidator,
  likedeleteValidator,
};
