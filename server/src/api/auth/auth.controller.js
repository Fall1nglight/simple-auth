const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const users = require('./auth.model');

// signup flow
// amikor regisztrál a felhasználó megnézzük hogy szabad-e az általa megadott email cím
//  ha nem akkor visszatérünk egy hibaüzenettel
// hasheljük a jelszót, hogy ne sima szövegként tároljuk az adatbázisban
// létrehozunk egy payload-ot, majd feltöltjük az adatbázisba
//  ha nem sikerül a feltöltés visszatérünk egy hibaüzenettel
// létrehozunk egy jwt-t amit res.json()-al visszaküldünk a felhasználónak

// login flow
// amikor regisztrál a felhasználó megnézzük hogy létezik-e ezzel az email címmel fiók
//  ha nem, visszatérünk egy hibaüzenettel
// lekérjük az adatbázisból a felhasználó rekordját, az általa megadott email címmel
// összevejük a tárolt, hashelt jelszóval, az általa megadott jelszót
//  ha nincs egyezés visszatérünk egy hibaüzenettel
// frissítjük a felhasználó lastLoginAt property-jét
// létrehozunk egy payload-ot
// létrehozunk egy jwt-t a payload alapján, amit a res.json()-al visszaküldünk a felhasználónak

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

    const user = await users.findOne({ email });

    if (user) {
      res.status(409);
      throw new Error('User already exists with the given email.');
    }

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
      body: { email, password },
    } = req;

    const user = await users.findOne({ email });

    if (!user) {
      res.status(403);
      // todo | set  same error message as below to prevent users from bruteforcing valid emails
      throw new Error(
        'User does not exists with the given email. Please try again!',
      );
    }

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
