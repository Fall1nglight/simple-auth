const jwt = require('jsonwebtoken');
const users = require('./auth.model');

const checkTokenSetUser = (req, res, next) => {
  const {
    headers: { authorization: rawToken },
  } = req;

  if (!rawToken) return next();

  const prefix = 'Bearer ';
  const [, token] = rawToken.split(prefix);

  if (!token) return next();

  jwt.verify(token, process.env.SECRET, (error, user) => {
    if (error) return console.error(error);

    req.user = user;
  });

  next();
};

/**
 * @param {import('joi').Schema} schema
 */
const validateSchema = (schema) => async (req, res, next) => {
  try {
    const { body } = req;

    await schema.validateAsync(body);

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * @param {Boolean} forwardOnFound
 */
const findUser = (forwardOnFound) => async (req, res, next) => {
  try {
    const {
      body: { email },
    } = req;

    const user = await users.findOne({ email });

    // ha regisztrálni próbál a felhasználó és szabad az email
    if (!forwardOnFound && !user) return next();

    // ha regisztrálni próbál  a felhasználó és nem szabad az email
    if (!forwardOnFound && user) {
      res.status(409);
      throw new Error('Email already in use!');
    }

    // ha bejelentkezni próbál a felhasználó és létezik az email
    if (forwardOnFound && user) {
      req.loggingInUser = user;
      return next();
    }

    // ha bejelentkezni próbál a felhasználó és nem létezik az email
    res.status(409);
    throw new Error('User does not exists with the given email.');
  } catch (error) {
    next(error);
  }
};

const unAuthorized = (res, next) => {
  const error = new Error('Unauthorized request!');

  res.status(401);
  next(error);
};

const isLoggedIn = (req, res, next) => {
  if (!req.user) return unAuthorized(res, next);

  next();
};

const isAdmin = (req, res, next) => {
  const {
    user: { role },
  } = req;

  if (role !== 'admin') return unAuthorized(res, next);

  next();
};

module.exports = {
  checkTokenSetUser,
  validateSchema,
  findUser,
  unAuthorized,
  isLoggedIn,
  isAdmin,
};
