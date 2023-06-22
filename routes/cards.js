const router = require('express').Router();
const { celebrate } = require('celebrate');
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const { createCardValidator, likedeleteValidator } = require('../utils/validators');

router.get('/cards', getCards);

router.post('/cards', celebrate(createCardValidator), createCard);

router.delete('/cards/:cardId', celebrate(likedeleteValidator), deleteCard);

router.put('/cards/:cardId/likes', celebrate(likedeleteValidator), likeCard);

router.delete('/cards/:cardId/likes', celebrate(likedeleteValidator), dislikeCard);

module.exports = {
  cardsRouter: router,
};
