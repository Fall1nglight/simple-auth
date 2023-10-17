const jwt = require('jsonwebtoken');

const checkTokenSetUser = (req, res, next) => {
  const {
    headers: { authorization: rawToken },
  } = req;

  if (!rawToken) return next();

  console.log({ rawToken });

  const prefix = 'Bearer ';
  const [, token] = rawToken.split(prefix);

  if (!token) return next();

  jwt.verify(token, process.env.SECRET, (error, user) => {
    if (error) return console.error(error);

    req.user = user;
  });

  next();
};

module.exports = { checkTokenSetUser };
