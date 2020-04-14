const fs = require('fs');

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser')
const bcryptjs = require('bcryptjs');

const raw = fs.readdirSync(__dirname);
const versions = raw.filter(v => /^v[0-9]+/.test(v));

router.use(require('cors')());

for (const version of versions) {
    router.use('/' + version, require(`./${version}`));
}

router.use(bodyParser.json())

router.get('/', async (req, res) => res.json({
    availableVersions: versions,
    cryptCheck1: await bcryptjs.compare('12345', '$2a$08$e7EYk3aQlh77m4EzhC5ZseqcxV8ncUOQlLAjZLua.1Y4k9jqydbGK'),
    cryptCheck2: await bcryptjs.compare('abcdefg', '$2a$08$vH/O2Y8ThoKUXX24K8mWt.h/zAZVDMm0HPqN8hrMWANqfTYpLszDC')
}))

module.exports = router;
