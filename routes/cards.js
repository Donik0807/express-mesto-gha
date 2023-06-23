const router = require('express').Router();
const { celebrate } = require('celebrate');
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const { createCardValidator, idValidator } = require('../utils/validators');

router.get('/cards', getCards);

router.post('/cards', celebrate(createCardValidator), createCard);

router.delete('/cards/:cardId', celebrate(idValidator), deleteCard);

router.put('/cards/:cardId/likes', celebrate(idValidator), likeCard);

router.delete('/cards/:cardId/likes', celebrate(idValidator), dislikeCard);

module.exports = {
  cardsRouter: router,
};
