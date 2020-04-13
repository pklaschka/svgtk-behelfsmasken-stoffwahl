'use strict';

const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
const env = process.env['NODE_ENV'] || 'development';

var {Sequelize} = require('sequelize')

let sequelize;
if (process.env.HEROKU_POSTGRESQL_BRONZE_URL) {
    // the application is executed on Heroku ... use the postgres database
    sequelize = new Sequelize(process.env.HEROKU_POSTGRESQL_BRONZE_URL, {
        dialect: 'postgres',
        // protocol: 'postgres',
        // port:     match[4],
        // host:     match[3],
        logging: false //false
    })
} else {
    if (env !== 'development') {
        throw new Error('PostgresSQL user data not found in non-development environment.');
    }
    // the application is executed on the local machine ... use mysql
    sequelize = new Sequelize('sqlite::memory:')
}

let db = { sequelize, Sequelize }

fs
    .readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
        const model = sequelize['import'](path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;

db.sequelize.sync().then(async () => {
    if (env === 'development') {
        // Setup test data
        await (require('./example-data/setup'))(db);
    }
});

module.exports = db;
