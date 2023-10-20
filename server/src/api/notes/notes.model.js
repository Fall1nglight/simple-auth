const db = require('../../database/connection');

const notes = db.get('notes');

module.exports = notes;
