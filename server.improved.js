const { json } = require("stream/consumers")

const http = require( "http" ),
      fs   = require( "fs" ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library if you"re testing this on your local machine.
      // However, Glitch will install it automatically by looking in your package.json
      // file.
      dir  = "public/",
      port = 3000;

const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "client/dist")));



let appdata = [
  { "model": "toyota", "year": 1999, "mpg": 23 , "derivedPrice": 23023},
  { "model": "honda", "year": 2004, "mpg": 30, "derivedPrice": 29880},
  { "model": "ford", "year": 1987, "mpg": 14, "derivedPrice": 14182} 
]





app.get("/data", (req, res) => {
  res.json(appdata);
});

app.post("/submit", (req, res) => {
  const newData = req.body;
  newData.derivedPrice = calculateDerivedPrice(newData.year, newData.mpg);
  appdata.push(newData);
  res.json(appdata);
});

app.post("/modify", (req, res) => {
  const {index, updatedEntry} = req.body;

  if (index >= 0 && index < appdata.length){
    updatedEntry.derivedPrice = calculateDerivedPrice(updatedEntry.year, updatedEntry.mpg);

    appdata[index] = updatedEntry;
    res.json(appdata);
  } else{
    res.status(400).send("not good index");
  }
});

app.post("/delete", (req, res) => {
  try{
    const {index} = req.body;

    if (index >= 0 && index < appdata.length){
      appdata.splice(index, 1);
      res.json(appdata);
    } else{
      res.status(400).send("not good index");
    }
  } catch (err) {
    res.status(500).send("delete fail" + err);
  }
});

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/dist/index.html"));
});

const calculateDerivedPrice = function(year, mpg) {
  return (3000 - year) * mpg;
}

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});