const notes = require('./notes.model');

const getAllPublic = async (req, res, next) => {
  try {
    const publicNotes = await notes.find({ public: true });

    res.json({ publicNotes });
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const allNotes = await notes.find({});

    res.json({ allNotes });
  } catch (error) {
    next(error);
  }
};

const getUserNotes = async (req, res, next) => {
  try {
    const {
      user: { _id: userId },
    } = req;

    const userNotes = await notes.find({ userId });

    if (!userNotes)
      throw new Error('Failed to fetch user notes from database!');

    res.json({ userNotes });
  } catch (error) {
    next(error);
  }
};

const get = async (req, res, next) => {
  try {
    const {
      params: { id: _id },
    } = req;

    const note = await notes.findOne({ _id });

    if (!note) {
      res.status(404);
      throw new Error('Failed to find note with the given id!');
    }

    res.json({ note });
  } catch (error) {
    next(error);
  }
};

const post = async (req, res, next) => {
  try {
    const {
      body: note,
      user: { _id: userId },
    } = req;

    const notePayload = {
      ...note,
      userId,
      createdAt: new Date().getTime(),
      updatedAt: 0,
    };

    const newNote = await notes.insert(notePayload);

    if (!newNote) throw new Error('Failed to insert note to database!');

    res.json({ newNote });
  } catch (error) {
    next(error);
  }
};

// todo
// note összekötése userId-val
// patch csak akkor működik ha megyezik a user._id és a note-on bellüli userId
// ez vonatkozzon a delete-re is

const patch = async (req, res, next) => {
  try {
    const {
      body: note,
      params: { id: _id },
    } = req;

    const updatedNote = await notes.findOneAndUpdate(
      {
        _id,
      },
      {
        $set: { ...note, updatedAt: new Date().getTime() },
      },
    );

    if (!updatedNote) throw new Error('Failed to update note in database!');

    res.json({ updatedNote });
  } catch (error) {
    next(error);
  }
};

const del = async (req, res, next) => {
  try {
    const {
      params: { id: _id },
    } = req;

    const deletedNote = await notes.findOneAndDelete({ _id });

    if (!deletedNote) throw new Error('Failed to delete note from database!');

    res.json({ deletedNote });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getAllPublic, getUserNotes, get, post, patch, del };
