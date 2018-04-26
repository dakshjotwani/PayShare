import {Tesseract} from 'tesseract.ts';

function reactRunOCR(image, callback) {
    let success = true;
    let output = "";

    Tesseract
        .recognize(image)
        .then((result) => {
            output += result.text;
        })
        .catch((error) => {
            console.err(error);
            success = false;
        })
        .finally((info) => {
            callback(success, output);
        });
}

function receiptTextToArray(input, callback) {
    var price_regex = new RegExp("[0-9]*\\.[0-9]{2}(?!.*[0-9]*\\.[0-9]{2})");
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

function generateItemList (img, callback) {
    /* Run OCR on image to extract raw text */
    reactRunOCR(img, (success, output) => {
        if (success) {
	    receiptTextToArray(output, callback);
        } else {
            console.error("OCR Failed.");
            callback([]);
        }
    });
}

export default generateItemList;

/* to test script for now */

/* var image = "./tst2.png";

generateItemList(image, (output) => {
    console.log(output);
}); */
