require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const process = require('process');
const { celebrate, errors } = require('celebrate');
const cors = require('cors');

const { userRouter } = require('./routes/users');
const { cardsRouter } = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { loginValidator, registerValidator } = require('./utils/validators');
const globalHandler = require('./utils/globalHandler');
const NotFoundError = require('./utils/NotFoundError');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const corsOptions = require('./utils/corsOptions');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(requestLogger);
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(bodyParser.json());
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.post('/signin', celebrate(loginValidator), login);
app.post('/signup', celebrate(registerValidator), createUser);
app.use(auth);
app.use('/', userRouter);
app.use('/', cardsRouter);
app.use(errorLogger);
app.use(errors());
app.use((req, res, next) => {
  next(new NotFoundError('Невалидный роут'));
});
app.use(globalHandler);

const { PORT = 3000 } = process.env;

app.listen(PORT);

module.exports = app;
