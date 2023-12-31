const monk = require('monk');
const logger = require('../utils/logger');
require('dotenv').config();

const { MONGO_DB_URI } = process.env;

const db = monk(MONGO_DB_URI);

db.then(() => logger.info('Successfully connected to MongoDB'));

module.exports = db;
