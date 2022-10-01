const fs = require("fs");
const path = require("path");
const { exit } = require("process");
const replace = require('replace-in-file');
const fs_Extra = require("fs-extra");
const { error, log } = require("console");

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

/*
for(var i = 0; i < bookInfo[bookToMerge].pages; i++) {
    var pagenum = i + 1;
    var pagenum_padded = pagenum.toLocaleString('en-GB', {minimumIntegerDigits:4,useGrouping:false});
    var vectorPath = path.join(dirpath, pagenum_padded + ".svg");
    var convertedVectorPath = path.join(convertpath, pagenum_padded + ".svg");
    if(fs.existsSync(vectorPath)) 
        fs.writeFileSync(convertedVectorPath, fs.readFileSync(vectorPath).toString().replace("<svg:", "<").replace("</svg:", "</"));
}*/

replace({files: ["converted/" + bookToMerge + "/*.svg"], from: /<svg:/g, to: "<"})
    .then((results) => {
        log("First pass results" + results);
        replace({files: ["converted/" + bookToMerge + "/*.svg"], from: /<\/svg:/g, to: "</"})
            .then(((results) => {
                log("Second pass results: " + results);
    }));
});
