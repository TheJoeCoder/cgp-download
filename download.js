const fs = require("fs");
const path = require("path");
const request = require('request');
const ProgressBar = require('progress');

var bookInfo = require("./books.json");
var cookies = fs.readFileSync("./cookies.txt").toString().trim();
var links = require("./links.json");

if(!fs.existsSync(path.join(__dirname, "downloads/"))) fs.mkdirSync(path.join(__dirname, "downloads/"));

var bookToDownload = process.argv.slice(2).join("");
var dirpath = path.join(__dirname, "downloads/", bookToDownload);
if(!fs.existsSync(dirpath)) fs.mkdirSync(dirpath, {recursive: true});

var numPages = bookInfo[bookToDownload].pages;

var bar = new ProgressBar('Downloading [:bar] :percent :current/:total :etas', {
    total: (numPages * links.pagedownloads.length) + links.titledownloads.length
});

function download(url) {
    new Promise((resolve, reject) => {
        var urlpath = url.replace(/^(https?:|)\/\//, "");
        var filename = path.basename(urlpath);
        var dirpath = path.join(__dirname, "downloads", urlpath.slice(0, urlpath.length - filename.length));
        var filepath = path.join(dirpath, filename);
        if(!fs.existsSync(dirpath)) fs.mkdirSync(dirpath, {recursive: true});
        if(!fs.existsSync(filepath)) {
            var file = fs.createWriteStream(filepath, {flags: "w"});
            let stream = request({
                uri: url,
                headers: {
                    'Cache-Control': 'max-age=0',
                    'Connection': 'keep-alive',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Upgrade-Insecure-Requests': '1',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246',
                    'Cookie': cookies
                },
                gzip: false
            })
            .pipe(file)
            .on('finish', () => {
                bar.tick(1);
                if(fs.readFileSync(filepath).length == 0) {
                    fs.unlinkSync(filepath);
                    //console.log("Zero length file " + filepath);
                }
                if(fs.readFileSync(filepath).toString().includes("<Code>NoSuchKey</Code>")) {
                    fs.unlinkSync(filepath);
                    //console.log("404 error " + filepath);
                }
                //if(fs.readFileSync(filepath).toString().includes("<title>403 Access denied</title>")) fs.unlinkSync(filepath);
                //console.log("✔️ " + url);
                resolve();
            })
            .on('error', (error) => {
                bar.tick(1);
                console.log("DL error for " + url + ": " + error);
                reject(error);
            });
        } else {
            bar.tick(1);
            resolve();
        }
    }).catch((error) => {
        console.log("Error while downloading: " + error);
    });
}

//title-specific download
for(var k = 0; k < links.titledownloads.length; k++) {
    var link = links.titledownloads[k];
    var url = link.replace(/\{id\}/g, bookToDownload);
    download(url);
}

//page-specific download
for(var i = 0; i < numPages; i++) {
    var pagenum = i + 1;
    var pagenum_padded = pagenum.toLocaleString('en-GB', {minimumIntegerDigits:4,useGrouping:false});
    //for all links
    for(var j = 0; j < links.pagedownloads.length; j++) {
        var link = links.pagedownloads[j];
        var url = link.replace(/\{id\}/g, bookToDownload).replace(/\{page\}/g, pagenum_padded);
        //download file
        download(url);
    }
}