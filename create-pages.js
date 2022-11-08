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

if(!fs.existsSync(path.join(__dirname, "html/"))) fs.mkdirSync(path.join(__dirname, "html/"));
var htmlpath = path.join(__dirname, "html/", bookToMerge);
if(!fs.existsSync(htmlpath)) fs.mkdirSync(htmlpath);

var template = fs.readFileSync(path.join(__dirname, "template.html")).toString();

for(var i = 0; i < bookInfo[bookToMerge].pages; i++) {
    var pagenum = i + 1;
    var pagenum_padded = pagenum.toLocaleString('en-GB', {minimumIntegerDigits:4,useGrouping:false});
    var imagePath = path.join(dirpath, "page" + pagenum_padded + "_4.jpg");
    var vectorPath = path.join(dirpath, pagenum_padded + ".svg");
    var file = template;
    file.replace(/PAGE_WIDTH/g, bookInfo[bookToMerge].pageWidth);
    file.replace(/PAGE_HEIGHT/g, bookInfo[bookToMerge].pageWidth);
    if(fs.existsSync(imagePath)) file.replace(/IMAGE_SUBSTRATE_FILE/g, "file:///" + imagePath);
    if(fs.existsSync(vectorPath)) file.replace(/SVG_FILE/g, "file:///" + vectorPath);
    fs.writeFileSync(path.join(htmlpath, pagenum_padded + ".html"), file);
}
