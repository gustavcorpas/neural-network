const fs = require('fs');

var dataFileBuffer  = fs.readFileSync(__dirname + '/train-images-idx3-ubyte');
var labelFileBuffer = fs.readFileSync(__dirname + '/train-labels-idx1-ubyte');
var pixelValues     = [];

for (var image = 0; image < 100; image++) {
    var pixels = [];

    for (var x = 0; x <= 27; x++) {
        for (var y = 0; y <= 27; y++) {
            pixels.push(dataFileBuffer[(image * 28 * 28) + (x + (y * 28)) + 15]);
        }
    }

    var imageData  = {};
    imageData[JSON.stringify(labelFileBuffer[image + 8])] = pixels;

    pixelValues.push(imageData);
}

fs.writeFileSync('./data/parsedImages.json', "imagedata = '" + JSON.stringify(pixelValues) + "'");
