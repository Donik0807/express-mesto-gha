const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const process = require('process');
const { celebrate, errors } = require('celebrate');

const { userRouter } = require('./routes/users');
const { cardsRouter } = require('./routes/cards');
const { NOT_FOUND_CODE } = require('./utils/errorCodes');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { loginValidator, registerValidator } = require('./utils/validators');
const globalHandler = require('./utils/globalHandler');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(bodyParser.json());
app.use('/signin', celebrate(loginValidator), login);
app.use('/signup', celebrate(registerValidator), createUser);
app.use(auth);
app.use('/', userRouter);
app.use('/', cardsRouter);
app.use(errors());
app.use(globalHandler);

app.use((req, res) => {
  res.status(NOT_FOUND_CODE).send({
    message: 'Невалидный роут',
  });
});

const { PORT = 3000 } = process.env;

app.listen(PORT);

module.exports = app;
