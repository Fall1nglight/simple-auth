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

const signup = async (req, res, next) => {
  try {
    const {
      body: { email, password },
    } = req;

    const result = await users.findOne({ email });

    if (result) {
      res.status(409);
      throw new Error('User already exists.');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = {
      email,
      password: hashedPassword,
      role: 'user',
      active: true,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    };

    const newUserrrr = await users.insert(newUser);

    if (!newUser) throw new Error('Failed to create user');

    const payload = {
      _id: newUser._id,
      email: newUser.email,
      role: newUser.role,
      active: newUser.active,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };

    jwt.sign(
      payload,
      process.env.SECRET,
      { expiresIn: '1h' },
      (error, token) => {
        if (!error) res.json({ token });

        return next(error);
      },
    );
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const {
      body: { email, password },
    } = req;

    const result = await users.findOne({ email });

    if (!result) throw new Error('Nincs ilyen emaillel felhasznalo');

    const correctPassword = await bcrypt.compare(password, result.password);
    if (!correctPassword) throw new Error('bad password');

    const payload = {
      _id: result._id,
      email: result.email,
      role: result.role,
      active: result.active,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };

    jwt.sign(
      payload,
      process.env.SECRET,
      { expiresIn: '1h' },
      (error, token) => {
        if (!error) res.json({ token });

        return next(error);
      },
    );
  } catch (error) {
    next(error);
  }
};

module.exports = { signup, login };
