const express = require('express');
const router = express.Router();
const model = require('../model');

router.param('id', async (req, res, next, id) => {
    try {
        const fabric = await model.Fabric.findByPk(id)
        req.fabric = fabric;
        next();
    } catch (e) {
        next(new Error('not found'))
    }
});

/* GET home page. */
router.get('/:id', function (req, res) {
    res.json({
        id: req.fabric.id,
        name: req.fabric.name,
        image: `./image`
    });
});

router.get('/:id/image', (req, res) => {
    res.contentType('image/png')
    return res.send(req.fabric.image);
});

module.exports = router;
