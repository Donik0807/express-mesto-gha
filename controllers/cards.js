const Card = require('../models/cards');
const ForbiddenError = require('../utils/ForbiddenError');
const InvalidDataError = require('../utils/InvalidDataError');
const NotFoundError = require('../utils/NotFoundError');

const getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => Card.findById(card._id).populate('owner'))
    .then((populatedCard) => {
      res.send(populatedCard);
    })
    .catch((err) => {
      let customError = err;
      if (err.name === 'ValidationError') {
        customError = new InvalidDataError('Переданы некорректные данные при создании карточки');
      }
      next(customError);
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId).orFail()
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        return card.deleteOne().then(() => {
          res.send({ message: 'Пост удален' });
        });
      }
      return Promise.reject(new ForbiddenError('Нельзя удалить чужую карточку'));
    })
    .catch((err) => {
      let customError = err;
      if (err.name === 'CastError') {
        customError = new InvalidDataError('Переданы некорректные данные при удаления карточки');
      }

      if (err.name === 'DocumentNotFoundError') {
        customError = new NotFoundError('Карточка с указанным _id не найдена.');
      }

      next(customError);
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    {
      new: true,
    },
  ).populate(['owner', 'likes']).orFail()
    .then((card) => res.send(card))
    .catch((err) => {
      let customError = err;
      if (err.name === 'CastError') {
        customError = new InvalidDataError('Переданы некорректные данные для постановке лайка');
      }
      if (err.name === 'DocumentNotFoundError') {
        customError = new NotFoundError('Карточка не найдена');
      }
      next(customError);
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    {
      new: true,
    },
  ).populate(['owner', 'likes']).orFail()
    .then((card) => res.send(card))
    .catch((err) => {
      let customError = err;
      if (err.name === 'CastError') {
        customError = new InvalidDataError('Переданы некорректные данные для снятия лайка');
      }
      if (err.name === 'DocumentNotFoundError') {
        customError = new NotFoundError('Карточка не найдена');
      }
      next(customError);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
