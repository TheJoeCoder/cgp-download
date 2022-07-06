# CGP Download
## Disclaimer
This software is provided for the sole purpose of personal use of offline copies of the CGP books. Follow the terms of service of CGP and do not distribute any copyrighted files downloaded by this program. All property downloaded remains the copyright of CGP or the respected author. The author of this software does not condone copyright infringement and will not take any responsibility for any actions of any user of this software.

## Introduction
This is a simple script to download all images from CGP books and then combine them into a PDF file for offline use. It downloads the files directly from the CGP website, so it requires a login cookie of a user which has purchased the requested book. Unfortunately, I do not own all of the books, so if you have any books to add to the books.json file, please create a pull request!

## Usage
* Install NodeJS (there are tutorials on how to do this; just search "how to install nodejs" on google)
* Open a new command prompt and clone the repo
```
git clone https://github.com/TheJoeCoder/cgp-download.git
cd cgp-download
```
* Add your cookies into a new file called cookies.txt (there is an example file `cookies.txt.example` to show you how to lay out the cookies. check below for a guide.)
* Install NPM dependencies
```
npm install
```
* Run the software, replacing CAR46DF with the id of the book you want to download (this can be found in the URL of the web book or in the `books.json` file)
```
node index.js CAR46DF
```
* Convert to a PDF file using the other script
```
node merge-pdf.js CAR46DF
```

## How to get cookies
### Step 1
Go to the CGP website and sign into your account, then go to [this link](https://www.cgpbooks.co.uk/bookspacedemo) or click the "My Online Products" link at the top of the page.

### Step 2
Go onto the book you want to download by (on older books) clicking on it or (on newer books) by clicking on it and pressing "Book".
