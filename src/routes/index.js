const express = require('express');
const router = express.Router();
const model = require('@alias/model');

function stagingIndexingPrevention(req, res, next) {
    if (req.hostname === 'www.svgtk.de') {
        return next();
    } else {
        res.set('X-Robots-Tag', 'noindex');
        return next();
    }
}

router.use(stagingIndexingPrevention);

/* GET home page. */
router.get('/',  async (req, res) => {
    const fabrics = await model['Fabric'].findAll({attributes: ['id', 'name'], order: ['id']});
    res.render('index', {
        fabrics,
        active: 'start'
    });
});

router.get('/impressum',  (req, res) => res.render('impressum', {
    active: 'impressum',
    title: 'Impressum'
}))
router.get('/datenschutz', (req, res) => res.render('datenschutz', {
    active: 'datenschutz',
    title: 'Datenschutz'
}))

router.use('/fabric', require('./fabric'));
router.use('/api', require('./api'));

module.exports = router;
