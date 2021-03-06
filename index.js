const fs = require("fs");
const path = require("path");
const request = require('request');
const ProgressBar = require('progress');

var bookInfo = require("./books.json");
var cookies = fs.readFileSync("./cookies.txt").toString().trim();
var links = fs.readFileSync("./links.txt").toString().split("\n");

if(!fs.existsSync(path.join(__dirname, "downloads/"))) fs.mkdirSync(path.join(__dirname, "downloads/"));

var bookToDownload = process.argv.slice(2).join("");
var dirpath = path.join(__dirname, "downloads/", bookToDownload);
if(!fs.existsSync(dirpath)) fs.mkdirSync(dirpath);

var numPages = bookInfo[bookToDownload].pages;

var bar = new ProgressBar('Downloading [:bar] :percent :current/:total :etas', {
    total: numPages * links.length
});

//for each page
for(var i = 0; i < numPages; i++) {
    var pagenum = i + 1;
    var pagenum_padded = pagenum.toLocaleString('en-GB', {minimumIntegerDigits:4,useGrouping:false});
    //for all links
    for(var j = 0; j < links.length; j++) {
        //download file  
        new Promise((resolve, reject) => {
            var link = links[j];
            var url = link.replace("{id}", bookToDownload).replace("{page}", pagenum_padded);
            var filepath = path.join(__dirname, "/downloads/", bookToDownload, "/", path.basename(url));
            var file = fs.createWriteStream(filepath);
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
                gzip: true
            })
            .pipe(file)
            .on('finish', () => {
                bar.tick(1);
                if(fs.readFileSync(filepath).length == 0) fs.unlinkSync(filepath);
                if(fs.readFileSync(filepath).toString().includes("<Code>NoSuchKey</Code>")) fs.unlinkSync(filepath);
                //console.log("?????? " + url);
                resolve();
            })
            .on('error', (error) => {
                bar.tick(1);
                reject(error);
            });
        }).catch((error) => {
            console.log("Error while downloading: " + error);
        });
    }
}