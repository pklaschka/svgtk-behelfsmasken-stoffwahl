const express = require('express');
const router = express.Router();
const model = require('@alias/model');

/* GET home page. */
router.get('/', async (req, res) => {
    const fabrics = await model.Fabric.findAll({attributes: ['id', 'name']});
    res.render('index', {
        fabrics
    });
});

router.use('/fabric', require('./fabric'));
router.use('/api', require('./api'));

module.exports = router;
