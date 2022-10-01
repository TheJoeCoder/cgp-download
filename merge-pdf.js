const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const ProgressBar = require('progress');
const SVGtoPDF = require("svg-to-pdfkit");
const { exit } = require("process");
const { error, log } = require("console");

PDFDocument.prototype.addSVG = function(svg, x, y, options) {
    return SVGtoPDF(this, svg, x, y, options), this;
};

var bookInfo = require("./books.json");

var bookToMerge = process.argv.slice(2).join("");

var dirpath = path.join(__dirname, "downloads/", bookToMerge);
if(!fs.existsSync(dirpath)) {
    error("Book doesn't exist!");
    exit(1);
}

if(!fs.existsSync(path.join(__dirname, "converted/"))) fs.mkdirSync(path.join(__dirname, "converted/"));
var convertpath = path.join(__dirname, "converted/", bookToMerge);
if(!fs.existsSync(convertpath)) fs.mkdirSync(convertpath);

var doc = new PDFDocument({size: "A4"});
doc.pipe(fs.createWriteStream(path.join(__dirname, "downloads/", bookToMerge + ".pdf")));

new Promise((resolve, reject) => {
    for(var i = 0; i < bookInfo[bookToMerge].pages; i++) {
        var pagenum = i + 1;
        var pagenum_padded = pagenum.toLocaleString('en-GB', {minimumIntegerDigits:4,useGrouping:false});
        var imagePath = path.join(dirpath, "page" + pagenum_padded + "_4.jpg");
        var vectorPath = path.join(convertpath, pagenum_padded + ".svg");
        var page = pagenum == 1 ? doc : doc.addPage({margin: 0, size: "A4"});
        if(fs.existsSync(imagePath)) page.image(imagePath, 0, 0, {align: "left", valign: "top", fit: [595.28, 841.89]});
        if(fs.existsSync(vectorPath)) page.addSVG(fs.readFileSync(vectorPath).toString(), 0, 0, {align: "left", valign: "top", fit: [595.28, 841.89], width: 595.28, height: 841.89, useCSS: true});
        if(i == (bookInfo[bookToMerge].pages - 1)) resolve();
    }
}).then(() => {
    doc.end();
});




