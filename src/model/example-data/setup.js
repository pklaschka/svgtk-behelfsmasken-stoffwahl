const fs = require('fs');
const path = require('path');
const imageData = fs.readFileSync(path.join(__dirname, 'image.png'));

module.exports = async (model) => {
    console.log('Setting up example data...');

    for (let i = 1; i <= 5; i++)
        await model.Fabric.create({
            image: imageData,
            name: `Häkelblüten, die ${i}te`
        });

    console.log('Example data setup completed.')
}
