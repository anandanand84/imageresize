'use strict';
var d3     = require('d3');
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

var getPixelsForStockData = function(data) {
    var canvasWidth = 28;
    var canvasHeight = 28;
    var canvas = new Canvas(canvasWidth, canvasHeight);
    var ctx = canvas.getContext('2d');
    global.CanvasRenderingContext2D = {};
    global.CanvasRenderingContext2D.prototype = ctx;
    require('canvas-5-polyfill');

    if(!data || data.length <= 0)
        return [];
    var height =  canvasHeight;
    var width = canvasWidth;
    var start = Math.ceil(canvasWidth * 0.10);
    var x = d3.scale.linear().range([start, width - start]).domain([0 , data.length]);
    var y = d3.scale.log().range([start, height - start]).domain(d3.extent(data, function(d) { return d; }));

    var line = d3.svg.line()
        .x(function(d, i) { return x(i); })
        .y(function(d) { return y(d); })
        .interpolate('basis-open');
    ctx.strokeStyle = 'black';
    ctx.strokeWidth = 2;
    var path = line(data);
    var p = new Path2D(path);
    ctx.beginPath();
    ctx.stroke(p);

    var imageData = ctx.getImageData(0,0,width, height);
    var dataArray = imageData.data;
    var pixelsArray = new Array(imageData.width * imageData.height);
    for(var i = 0,pixelCount = 0, n = dataArray.length; i < n; i += 4,pixelCount++) {
        var red = dataArray[i];
        var green = dataArray[i + 1];
        var blue = dataArray[i + 2];
        var alpha = dataArray[i + 3];
        var pixelPresent = ((red > 0) || (green > 0 ) || (blue > 0) || (alpha > 0))
        if(pixelPresent){
            pixelsArray[pixelCount] = (1);
        }else {
            pixelsArray[pixelCount] = (0);
        }
    }
    return pixelsArray;
};

module.exports = {
    resize : resize,
    getPixelsForStockData : getPixelsForStockData
};