var jimp = require("jimp");

jimp.read("./serve/tst_raw.jpg").then(function (image) {
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
    image.write("./serve/preproc.jpeg");
}).catch(function (err) {
    console.error(err);
});

/* var sharp = require("sharp");

sharp("./serve/tst_raw.jpg")
    .threshold(200)
    .toFile("./serve/preprocsharp200.jpeg"); */
