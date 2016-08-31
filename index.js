'use strict';
var Canvas = require('canvas')
    , Image = Canvas.Image

var resize = function(input) {
    let pixelsArray = input.pixelsArray;
    var size = Math.sqrt(input.pixelsArray.length)
    let width = size;
    let height = size;
    let toWidth = input.toWidth;
    let toHeight = input.toHeight;

    var canvas = new Canvas(width, height)
         , ctx = canvas.getContext('2d');

    var imageData = ctx.getImageData(0,0,width,height);
    pixelsArray.forEach(function(value, index) {
        index++;
        if(value > 0) {
            imageData.data[(index * 4)-4] = 0;
            imageData.data[(index * 4)-3] = 0;
            imageData.data[(index * 4)-2] = 0;
            imageData.data[(index * 4)-1] = 255;
        }
    });
    ctx.putImageData(imageData, 0 , 0);

    var dataUrl = canvas.toDataURL();

    canvas = new Canvas(toWidth, toHeight);
    ctx = canvas.getContext('2d');
    var img = new Image;
    img.src = dataUrl;
    ctx.drawImage(img, 0, 0, toWidth, toHeight);

    var reducedImageData = ctx.getImageData(0,0,toWidth,toHeight);

    let dataArray = reducedImageData.data;
    let pixelsArrayReduced = new Array(reducedImageData.width * reducedImageData.height);
    for(let i = 0,pixelCount = 0, n = dataArray.length; i < n; i += 4,pixelCount++) {
        let red = dataArray[i];
        let green = dataArray[i + 1];
        let blue = dataArray[i + 2];
        let alpha = dataArray[i + 3];
        let pixelPresent = ((red > 0) || (green > 0 ) || (blue > 0) || (alpha > 0))
        if(pixelPresent){
            pixelsArrayReduced[pixelCount] = (1);
        }else {
            pixelsArrayReduced[pixelCount] = (0);
        }
    }
    return pixelsArrayReduced;
}

module.exports = resize;