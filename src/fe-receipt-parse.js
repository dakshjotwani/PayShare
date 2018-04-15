const Buffer = require('buffer');

function runOCR(image, callback) {
    var success = true;
    var output = "";

    const tesseract = require('tesseract.js');
    var tesseractPromise = tesseract.create({ langPath: "./" }).recognize(image, 'eng');
    tesseractPromise.then((result) => {
        output += result.text;
    });
    tesseractPromise.catch((error) => {
        console.log(err);
	success = false;
    });
    tesseractPromise.finally((info) => {
        callback(success, output);
    });
}

function receiptTextToArray(input, callback) {
    var price_regex = new RegExp("[0-9]*\\.[0-9]{2}");
    var lines = input.split('\n');
    var output = [];

    for (let line of lines) {
        if (price_regex.test(line)) {
            var price = price_regex.exec(line);
            var item = line.split(price)[0];
            var toPush = [item.trim(), parseFloat(price).toFixed(2)]
            output.push(toPush);
        }
    }
    callback(output);
}

window.generateItemList = function generateItemList (img, callback) {
    /* Pre-process image for Tesseract */
    /* var Buffer = require('buffer');
    var buf = Buffer.from(img); */
    var jimp = require("jimp");
    var processedWidth = 0;
    var processedHeight = 0;
    jimp.read(img).then(function (image) {
        image.resize(jimp.AUTO, 2500);
        processedWidth = image.bitmap.width;
        processedHeight = image.bitmap.height;
        image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
            var threshold = 190;

            var red   = this.bitmap.data[ idx + 0 ];
            var green = this.bitmap.data[ idx + 1 ];
            var blue  = this.bitmap.data[ idx + 2 ];

            if (0.2126 * red + 0.7152 * green + 0.0722 * blue > threshold) {
                this.bitmap.data[idx + 0] = 255;
                this.bitmap.data[idx + 1] = 255;
                this.bitmap.data[idx + 2] = 255;
            } else { 
                this.bitmap.data[idx + 0] = 0;
                this.bitmap.data[idx + 1] = 0;
                this.bitmap.data[idx + 2] = 0;
            }
        });  
        image.getBase64(jimp.MIME_JPEG, (err, src) => {
            var canvas = document.createElement("canvas");
            canvas.setAttribute("height", processedHeight);
            canvas.setAttribute("width", processedWidth);
            var ctx = canvas.getContext("2d");
            var srcImg = document.createElement("img");
            srcImg.setAttribute("src", src);
            srcImg.onload = () => {
                ctx.drawImage(srcImg, 0, 0);
                /* document.body.appendChild(canvas); */
                runOCR(canvas, (success, output) => {
                    if (success) {
                        receiptTextToArray(output, callback);
                    } else {
                        console.error("OCR Failed.");
                        callback([]);
                    }
                });
            };
        });
    }).catch(function (err) {
        console.error(err);
    });
    /* Run OCR on image to extract raw text */
    /* runOCR(image, (success, output) => {
        if (success) {
	    receiptTextToArray(output, callback);
        } else {
            console.error("OCR Failed.");
            callback([]);
        }
    }); */    
}

/* to test script for now */

/* var image = "./tst2.png";

generateItemList(image, (output) => {
    console.log(output);
}); */
