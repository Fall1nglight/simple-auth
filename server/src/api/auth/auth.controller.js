const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const users = require('./auth.model');

// helper function(s)
const createTokenSendResponse = (user, res, next) => {
  const { password, ...payload } = user;

  jwt.sign(payload, process.env.SECRET, { expiresIn: '1h' }, (error, token) => {
    if (error) return next(error);

    res.json({ token });
  });
};

const checkUser = async (req, res, next) => {
  try {
    const { user } = req;
    res.json({ user });
  } catch (error) {
    next(error);
  }
};

const signup = async (req, res, next) => {
  try {
    const {
      body: { email, password },
    } = req;

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUserPayload = {
      email,
      password: hashedPassword,
      role: 'user',
      createdAt: new Date().getTime(),
      lastLogin: new Date().getTime(),
      updatedAt: 0,
      active: true,
    };

    const newUser = await users.insert(newUserPayload);

    if (!newUser)
      throw new Error('Failed to create user. Please try again later!');

    createTokenSendResponse(newUser, res, next);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const {
      body: { password },
      loggingInUser: user,
    } = req;

    const correctPassword = await bcrypt.compare(password, user.password);
    if (!correctPassword) {
      res.status(403);
      throw new Error('Invalid login credentials. Please try again!');
    }

    createTokenSendResponse(user, res, next);
  } catch (error) {
    next(error);
  }
};

module.exports = { checkUser, signup, login };
