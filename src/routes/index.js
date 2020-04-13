const express = require('express');
const router = express.Router();
const model = require('../model');

/* GET home page. */
router.get('/', async (req, res) => {
    const fabrics = await model.Fabric.findAll({attributes: ['id', 'name']});
    res.render('index', {
        fabrics
    });
});

router.use('/fabric', require('./fabric'));

module.exports = router;
