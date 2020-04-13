const express = require('express');
const router = express.Router();
const fileUploadMiddleware = require('express-fileupload');

const model = require('@alias/model');
const auth = require('./auth');

router.use(fileUploadMiddleware({
    limits: {fileSize: 1024*1024*2}
}));

router.all('/', auth.jwtAuthorizationMiddleware, (req, res) => {
    return res.json({
        status: 'ok',
        appVersion: require('@alias/package').version
    });
});

router.post('/auth', async (req, res) => {
    try {
        return res.json({token: await auth.authenticate(req.body.email, req.body.password)})
    } catch (e) {
        return res.sendStatus(403)
    }
});

router.use('/fabric', auth.jwtAuthorizationMiddleware, require('./fabric'));

module.exports = router;

