const fs = require('fs');

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser')

const raw = fs.readdirSync(__dirname);
const versions = raw.filter(v => /^v[0-9]+/.test(v));

router.use(require('cors')());

for (const version of versions) {
    router.use('/' + version, require(`./${version}`));
}

router.use(bodyParser.json())

router.get('/', (req, res) => res.json({availableVersions: versions}))

module.exports = router;
