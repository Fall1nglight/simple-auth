const notes = require('./notes.model');

/**
 * @param {import('joi').Schema} schema
 */

const validateSchema = (schema) => async (req, res, next) => {
  try {
    const { body: note } = req;

    await schema.validateAsync(note);

    next();
  } catch (error) {
    res.status(406);
    next(error);
  }
};

const matchUserId = async (req, res, next) => {
  try {
    const {
      params: { id: noteId },
      user: { _id: userId },
    } = req;

    const note = await notes.findOne({ _id: noteId, userId });

    if (!note) {
      res.status(406);
      throw new Error('Could not fetch your note with the given id!');
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { validateSchema, matchUserId };
