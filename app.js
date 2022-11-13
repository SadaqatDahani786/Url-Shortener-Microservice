/*
 ** **
 ** ** ** IMPORTS
 ** **
 */
const fs = require("fs");
const dns = require("dns");

const express = require("express");
const cors = require("cors");

/*
 ** **
 ** ** ** INITS
 ** **
 */
const app = express();
const PORT = 3000;

/*
 ** **
 ** ** ** MIDDLEWARES
 ** **
 */
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

/*
 ** **
 ** ** ** ROUTES
 ** **
 */
/**
 ** ======================================
 ** Route Index
 ** ======================================
 */
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

/**
 ** ======================================
 ** Route Shorturl
 ** ======================================
 */
app.get("/api/shorturl/:url", (req, res) => {
  //1) Url
  const url = req.params.url;

  //2) Read database for url
  fs.readFile(__dirname + "/host_lists.json", "utf-8", (err, file) => {
    //If err, return, else find the original url
    if (err) res.json({ error: "Internal server errror!" });
    else {
      //1) Find original url
      const lists = JSON.parse(file);
      const foundItem = lists.find((l) => +l.short_url === +url);

      //2) If not exist, return, else redirect to original url
      if (!foundItem)
        res.json({ error: "There's no such url exist on our database." });
      else res.redirect(303, "https://" + foundItem.original_url + "/");
    }
  });
});

/*
 ** ======================================
 ** Route Create Shorturl
 ** ======================================
 */
app.post("/api/shorturl", (req, res) => {
  //1) Regex to remove unnecessary parts from url
  const regex =
    /^(?:(?:https?)|(?:ftp)):\/{2}(?:w{3}\.)?([^\.\s\W]+\.[^\/\s\W]+)\/?$/g;

  //2) Url
  const origUrl = req.body.url;
  const url = req.body.url.replace(regex, "$1");

  //3) Check if it's a valid url address of a website
  dns.lookup(url, (err, address, family) => {
    //If err, send response error, else proceed further
    if (err) res.json({ error: "Invalid Url" });
    else {
      //Read file where all short urls located
      fs.readFile(__dirname + "/host_lists.json", "utf-8", (err, file) => {
        //1) New entry to append into file of all short lists
        const lineToAppend = {
          original_url: url,
          short_url: 1,
        };

        //2) If file not exist already, create new one and add new entry into it
        if (err)
          fs.appendFile(
            "host_lists.json",
            JSON.stringify([lineToAppend]),
            (err) => {
              //If file creation failed, send response error, else new entry
              if (err) res.json({ error: "Internal server error." });
              else res.json({ ...lineToAppend, original_url: origUrl });
            }
          );
        else {
          //1) Find item in file of all short urls
          const lists = JSON.parse(file);
          const foundItem = lists.find((l) => l.original_url === url);

          //2) If exist, send response with item found, else add new entry into file
          if (foundItem) res.json({ ...foundItem, original_url: origUrl });
          else {
            //1) Plus counter for short url
            lineToAppend.short_url = lists[lists.length - 1].short_url + 1;

            //2) Append to existing
            lists.push(lineToAppend);

            //3) Remove old file, then create a new one with new entry added
            fs.unlink("host_lists.json", (err) => {
              //If err, send response error, else proceed further
              if (err) res.json({ error: "Internal server error." });
              else {
                fs.appendFile(
                  "host_lists.json",
                  JSON.stringify(lists),
                  //If err, send response error, else proceed further
                  (err) => {
                    if (err) res.json({ error: "Internal server error." });
                    else res.json({ ...lineToAppend, original_url: origUrl });
                  }
                );
              }
            });
          }
        }
      });
    }
  });
});

/*
 ** **
 ** ** ** HTTP SERVER
 ** **
 */
app.listen(PORT, () => {
  console.log(`Servers is running on port:\t[${PORT}]`);
});
