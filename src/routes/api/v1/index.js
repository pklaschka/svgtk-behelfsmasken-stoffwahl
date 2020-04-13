const express = require('express');
const router = express.Router();
const model = require('@alias/model');

router.all('/', (req, res) => {
    return res.json({
        status: 'ok',
        appVersion: require('@alias/package').version
    });
});

module.exports = router;

