'use strict';

const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
const env = process.env['NODE_ENV'] || 'development';

var {Sequelize} = require('sequelize')

let sequelize;
if (process.env.DATABASE_URL && env === 'production') {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        logging: false //false
    })
} else {
    if (env !== 'development') {
        throw new Error('PostgresSQL user data not found in non-development environment.');
    }
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
