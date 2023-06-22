const { celebrate } = require('celebrate');
const router = require('express').Router();
const {
  getUser,
  getUsers,
  updateUser,
  updateAvatar,
  getMe,
} = require('../controllers/users');
const { getUserValidator, updateUserValidator, updateAvatarValidator } = require('../utils/validators');

router.get('/users/me', getMe);

router.get('/users', getUsers);

router.get('/users/:userId', celebrate(getUserValidator), getUser);

router.patch('/users/me', celebrate(updateUserValidator), updateUser);

router.patch('/users/me/avatar', celebrate(updateAvatarValidator), updateAvatar);

module.exports = {
  userRouter: router,
};
