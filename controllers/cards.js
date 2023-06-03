const Card = require('../models/cards');
const ERROR_CODES = require('../utils/errorCodes');

const getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch(() => {
      res.status(ERROR_CODES[500]).send({
        message: 'На сервере произошла ошибка',
      });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => Card.findById(card._id).populate('owner'))
    .then((populatedCard) => {
      res.send(populatedCard);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODES[400]).send({
          message: ' Переданы некорректные данные при создании карточки',
        });
      } else {
        res.status(ERROR_CODES[500]).send({
          message: 'На сервере произошла ошибка',
        });
      }
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId).orFail()
    .then(() => res.send({ message: 'Пост удален' }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(ERROR_CODES[404]).send({
          message: 'Карточка с указанным _id не найдена.',
        });
      } else {
        res.status(ERROR_CODES[500]).send({
          message: 'На сервере произошла ошибка',
        });
      }
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    {
      new: true,
      runValidators: true,
    },
  ).populate(['owner', 'likes']).orFail()
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(ERROR_CODES[400]).send({
          message: 'Переданы некорректные данные для постановки лайка',
        });
        return;
      }
      if (err.name === 'DocumentNotFoundError') {
        res.status(ERROR_CODES[404]).send({
          message: 'Карточка с указанным _id не найдена.',
        });
        return;
      }
      res.status(ERROR_CODES[500]).send({
        message: 'На сервере произошла ошибка',
      });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    {
      new: true,
      runValidators: true,
    },
  ).populate(['owner', 'likes']).orFail()
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(ERROR_CODES[400]).send({
          message: 'Переданы некорректные данные для постановки лайка',
        });
        return;
      }
      if (err.name === 'DocumentNotFoundError') {
        res.status(ERROR_CODES[404]).send({
          message: 'Карточка с указанным _id не найдена.',
        });
        return;
      }
      res.status(ERROR_CODES[500]).send({
        message: 'На сервере произошла ошибка',
      });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
