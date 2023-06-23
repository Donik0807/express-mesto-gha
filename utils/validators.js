const { Joi } = require('celebrate');
const urlExpression = require('./urlExpression');

const linkValidator = (value, helpers) => {
  if (!urlExpression.test(value)) {
    return helpers.error('incorrect avatar');
  }
  return value;
};

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
    avatar: Joi.string().custom(linkValidator),
    about: Joi.string().min(2).max(30),
  }),
};

const getUserValidator = {
  params: Joi.object().keys({
    userId: Joi.string().required().hex(),
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
    avatar: Joi.string().required().custom(linkValidator),
  }),
};

const createCardValidator = {
  body: {
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(linkValidator),
  },
};

const idValidator = {
  params: Joi.object().keys({
    cardId: Joi.string().required().hex(),
  }),
};

module.exports = {
  loginValidator,
  registerValidator,
  getUserValidator,
  updateUserValidator,
  updateAvatarValidator,
  createCardValidator,
  idValidator,
};
