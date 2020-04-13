const fs = require('fs');
const path = require('path');
const imageData = fs.readFileSync(path.join(__dirname, 'image.png'));

module.exports = async (model) => {
    console.log('Setting up example data...');
    await model.Fabric.create({
        image: imageData,
        name: 'Häkelblüten'
    });

    console.log('Example data setup completed.')
}
