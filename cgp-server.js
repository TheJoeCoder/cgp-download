// A makeshift version of the CGP books server
const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');

var books = require("./books.json");

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.url}`);
    next();
});

app.use(express.static("downloads/library.cgpbooks.co.uk"));

// A function to replicate FlippingBook's page url functionality.
// This saves us from downloading unneeded/identical pages
function redirPages(req, res) {
    res.redirect("/digitalcontent/" + req.params.bookid + "/index.html#" + req.params.pageid);
}
app.get("/digitalcontent/:bookid/:pageid/index.html", redirPages);
app.get("/digitalcontent/:bookid/:pageid/", redirPages);

app.get("/digitalcontent", (req, res) => {
    var html = "<h1>Books</h1>";
    var bookcontents = fs.readdirSync("downloads/library.cgpbooks.co.uk/digitalcontent/");
    for(var i = 0; i < bookcontents.length; i++) {
        html += "<p>";
        html += "<a href=\"" + bookcontents[i] + "\">";
        html += books[bookcontents[i]].name;
        html += " (" + bookcontents[i] + ")";
        html += "</a>";
        html += "</p>";
    }
    return res.send(html);
});

app.listen(port, () => console.log(`App listening on port ${port}!`));