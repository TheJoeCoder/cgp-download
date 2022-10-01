const fs = require("fs");
const path = require("path");
const { exit } = require("process");
const { error, log } = require("console");
const { createConverter }  = require('convert-svg-to-png');

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

(async() => {
    var converter = createConverter();
    for(var i = 0; i < bookInfo[bookToMerge].pages; i++) {
        var pagenum = i + 1;
        var pagenum_padded = pagenum.toLocaleString('en-GB', {minimumIntegerDigits:4,useGrouping:false});
        var vectorPath = path.join(convertpath, pagenum_padded + ".svg");
        var convertedVectorPath = path.join(convertpath, pagenum_padded + ".svg.png");
        if(fs.existsSync(vectorPath)) {
            await converter.convertFile(vectorPath, {outputFilePath: convertedVectorPath});
        }
        if(i == (bookInfo[bookToMerge].pages - 1)) {
            await converter.destroy();
        }
    }
})();