const fs = require('fs');
const path = require('path');

const express = require('express');
const router = express.Router();
const model = require('@alias/model');
const bodyParser = require('body-parser')

const raw = fs.readdirSync(__dirname);
const versions = raw.filter(v => /^v[0-9]+/.test(v));

for (const version of versions) {
    router.use('/' + version, require(`./${version}`));
}

router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

router.use(bodyParser)

router.get('/', (req, res) => res.json({availableVersions: versions}))

module.exports = router;
