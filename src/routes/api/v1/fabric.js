const express = require('express');
const router = express.Router();
const Jimp = require('jimp');

const model = require('@alias/model');

router.param('fabricId', async (req, res, next, id) => {
    const fabric = await model['Fabric'].findByPk(id);

    if (fabric) {
        req.fabric = fabric;
        next();
    } else {
        return res.sendStatus(404);
    }
});

router.get('/', async (req, res) => {
    return res.json(await model['Fabric'].findAll({attributes: ['id', 'name']}))
});

router.post('/', async (req, res) => {
    if (!req.body.name || !req.files.image) {
        return res.sendStatus(400);
    }

    // Process the image
    const image = await Jimp.read(req.files.image.data);
    console.log(image);
    const imageBuffer = await image.cover(1024, 1024).quality(95).getBufferAsync(Jimp.MIME_JPEG);

    // Save the fabric to the DB
    const fabric = await model['Fabric'].create({
        name: req.body.name,
        image: imageBuffer
    });

    return res.json({id: fabric.id, name: fabric.name});
});

router.delete('/:fabricId', async (req, res) => {
    await req.fabric.destroy();
    return res.sendStatus(204);
});

module.exports = router;
