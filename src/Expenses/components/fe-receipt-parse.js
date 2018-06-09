import {Tesseract} from 'tesseract.ts';
import {stringToCents} from '../../utils/algs2.js';

function runOCR(image, callback) {
    let success = true;
    let output = '';

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
    let priceRegex = new RegExp('[0-9]*\\.[0-9]{2}(?!.*[0-9]*\\.[0-9]{2})');
    let lines = input.split('\n');
    let output = [];

    for (let line of lines) {
        if (priceRegex.test(line)) {
            let price = priceRegex.exec(line)[0];
            let item = line.split(price)[0];
            let toPush = [item.trim(), stringToCents(price)];
            output.push(toPush);
        }
    }
    callback(output);
}

function generateItemList(img, callback) {
    /* Run OCR on image to extract raw text */
    runOCR(img, (success, output) => {
        if (success) {
            receiptTextToArray(output, callback);
        } else {
            console.error('OCR Failed.');
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
