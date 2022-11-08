# CGP Download
## Disclaimer
This software is provided for the sole purpose of personal use of offline copies of the CGP books. Follow the terms of service of CGP and do not distribute any copyrighted files downloaded by this program. All property downloaded remains the copyright of CGP or the respected author. The author of this software does not condone copyright infringement and will not take any responsibility for any actions of any user of this software.

## Introduction
This is a simple script to download all images from CGP books and then combine them into a PDF file for offline use. It downloads the files directly from the CGP website, so it requires a login cookie of a user which has purchased the requested book. Unfortunately, I do not own all of the books, so if you have any books to add to the books.json file, please create a pull request!

## Todo
This software is in beta, so some features don't exist yet. This includes:
* Text in PDF files (the files are pretty usesless without it)
* PDF metadata
* More validation statements and f**k-up protection (it's incredibly shoddy code at the moment)

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
* Run the software, replacing CAR46DF with the id of the book you want to download (this can be found in the URL of the web book or in the `books.json` file). If the book doesn't exist in the `books.json` file, then add it following the section below (titled "Adding a book").
```
node download.js CAR46DF
```
* Check the files downloaded properly. This can be done by opening one of the xml files. If they have any error code such as "403 access denied", then the download failed. Open the file in a text editor to see the error message.
* Convert to a PDF file using the other script (currently broken)
```
node merge-pdf.js CAR46DF
```

## How to get cookies
### Step 1
Go to the CGP website and sign into your account, then go to [this link](https://www.cgpbooks.co.uk/bookspacedemo) or click the "My Online Products" link at the top of the page.

### Step 2
Go onto the book you want to download by (on older books) clicking on it or (on newer books) by clicking on it and clicking "Book".
![Step 2](https://raw.githubusercontent.com/TheJoeCoder/cgp-download/master/docs-images/step2.png)

### Step 3
Press F12 or Right Click -> Inspect. What you see will vary on different browsers but it should be something like below. Then, click on the "Network" tab.
![Step 3](https://raw.githubusercontent.com/TheJoeCoder/cgp-download/master/docs-images/step3.png)

### Step 4
Check the "Preserve log" and "Disable cache" box then reload the page. You should see request entries populate below.
![Step 4](https://raw.githubusercontent.com/TheJoeCoder/cgp-download/master/docs-images/step4.png)

### Step 5
Click on any request beginning in "page", then click "Headers" on the box that pops up. Find the "cookie" header, then right click on the value and press "Copy Value".
![Step 5](https://raw.githubusercontent.com/TheJoeCoder/cgp-download/master/docs-images/step5.png)
![Step 5](https://raw.githubusercontent.com/TheJoeCoder/cgp-download/master/docs-images/step5-copyvalue.png)

### Step 6
Paste the text into a new file called cookies.txt in the `cgp-download` directory.
![Step 6](https://raw.githubusercontent.com/TheJoeCoder/cgp-download/master/docs-images/step6.png)

## Adding a book
If your book doesn't already exist in the `books.json` file, you can add it following these instructions.
### Step 1
Go to the book you want to add via the method above, and find the ID in the url.
For example, for the URL `https://library.cgpbooks.co.uk/digitalaccess/BAR46DF/Online/`, the ID is `BAR46DF`.

### Step 2
Find the number of pages. This can be done by going to the book and opening Inspect Element on the network tab (as above), then typing in "BC" to the `you are here` box, and pressing enter (or, instead of typing "BC", you can flip to the back cover page). Then, look in the network tab for the page png files.

Example:
```
...
page0005_2.png?uni=abc123
page0152_2.png?uni=abc123
page0151_2.png?uni=abc123
page0149_2.png?uni=abc123
...
```
Find the largest number in the list of files; for this book 152 is the largest and is therefore the number of pages.

### Step 3
Find the page size. The easiest way to do this is to measure the physical book and compare it to the nearest page size for precise measurements. For us, the pixels are converted as 72ppi, so multiply your measurement (in inches) by 72.
I also strongly recommend using a dimension already present in the file. For example, most CGP Revision guides are A4 size (595.2758px x 841.8898px), and most of the textbooks are 544.252px x 722.835px.

### Step 4
Now, insert this all into the file.
Insert this into the bottom of the file before the ending `}`, filling in the information you got earlier and being sure to add a comma on the previous line as well.
```json
    "BOOKID": {
        "name": "BOOK NAME",
        "pages": PAGES,
        "pageWidth": WIDTH,
        "pageHeight": HEIGHT
    }
```

The end of file should now look similar to this (but with your book's data in):
```
...
    },
    "BOOKID": {
        "name": "Book name",
        "pages": pages,
        "pageWidth": width,
        "pageHeight": height
    }
}
```

Now, submit a pull request to add your book record to the collection! Please note this will not share the book itself with anyone else, just the metadata of it (so that other people don't have to spend time doing all the measurements themselves).