const Buffer = require('buffer');

function runOCR(image, callback) {
    var success = true;
    var output = "";

    const tesseract = require('tesseract.js');
    var path = "http://10.0.0.239:5000/"; /* "http://" + document.domain + ":" window.location.port + "/"; */
    var tesseractPromise = tesseract.create({ langPath: path }).recognize(image, 'eng');
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
    /* Run OCR on image to extract raw text */
    runOCR(img, (success, output) => {
        if (success) {
	    receiptTextToArray(output, callback);
        } else {
            console.error("OCR Failed.");
            callback([]);
        }
    });
}

/* to test script for now */

/* var image = "./tst2.png";

generateItemList(image, (output) => {
    console.log(output);
}); */
