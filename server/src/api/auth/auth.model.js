const db = require('../../database/connection');

const users = db.get('users');
users.createIndex('email', { unique: true });

module.exports = users;
