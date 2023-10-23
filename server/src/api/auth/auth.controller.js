const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const users = require('./auth.model');

// helper function(s)
const createTokenSendResponse = (user, res, next) => {
  const { password, iat, exp, ...payload } = user;

  jwt.sign(payload, process.env.SECRET, { expiresIn: '6m' }, (error, token) => {
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

const tokens = new Set();

const refreshToken = async (req, res, next) => {
  try {
    const {
      headers: { authorization: rawToken },
      user,
    } = req;

    const prefix = 'Bearer ';
    const [, token] = rawToken.split(prefix);

    if (tokens.has(token))
      throw new Error(
        'You have already claimed a refresh token. Please try again later!',
      );

    // calculate exp date
    const currentTime = new Date().getTime();
    const expiresAt = user.exp * 1000;
    const remainingMilis = expiresAt - currentTime;
    const remainingMins = remainingMilis / 60000;

    console.log({ remainingMins });

    if (remainingMins > 5)
      throw new Error(
        'Token is too fresh to require a refresh token. Please try again later!',
      );

    tokens.add(token);
    setTimeout(() => tokens.delete(token), remainingMilis);

    createTokenSendResponse(user, res, next);
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

    // todo | update user.lastLogin to new Date().getTime()

    const updatedUser = await users.findOneAndUpdate(
      { _id: user._id },
      {
        $set: {
          lastLogin: new Date().getTime(),
        },
      },
    );

    createTokenSendResponse(updatedUser, res, next);
  } catch (error) {
    next(error);
  }
};

module.exports = { checkUser, refreshToken, signup, login };
