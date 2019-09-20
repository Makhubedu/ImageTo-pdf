const express = require("express");
const app = express();
const fs = require("fs");
const multer = require('multer');
const { TesseractWorker } = require("tesseract.js");
const worker = new TesseractWorker();

/* above i was just initializing all the packges
 that will be required for the applicatio to run 
 */

//creating storage

const storag = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, ".uploads")
    },
    filename: (req, res, cb) => {
        cb(null, req.file)
    }
});

// creating upload

const upload = multer({ storage: storag }).single("derrick");

app.set("view engine", "ejs");