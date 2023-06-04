const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const process = require('process');

const { userRouter } = require('./routes/users');
const { cardsRouter } = require('./routes/cards');
const { NOT_FOUND_CODE } = require('./utils/errorCodes');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(bodyParser.json());
app.use((req, res, next) => {
  req.user = {
    _id: '647777752c190ee018edd5e7',
  };

  next();
});
app.use('/', userRouter);
app.use('/', cardsRouter);
app.use((req, res) => {
  res.status(NOT_FOUND_CODE).send({
    message: 'Невалидный роут',
  });
});

const { PORT = 3000 } = process.env;

app.listen(PORT);
