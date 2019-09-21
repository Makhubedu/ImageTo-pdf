const express = require("express");
const app = express();
const fs = require("fs");
const multer = require("multer");
const { TesseractWorker } = require("tesseract.js");
const worker = new TesseractWorker();

/* above i was just initializing all the packges
 that will be required for the applicatio to run 
 */

//creating storage

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads");
    },
    filename: (req, file, cb) => {
        cb(null, `${file.originalname}`);
    }
});

// creating upload

const upload = multer({ storage: storage }).single("derrick");

app.set("view engine", "ejs");
app.use(express.static("public"));

// Creating routs

app.get("/", (req, res) => {
    res.render("index")

});

app.post("/upload", (req, res) => {
    upload(req, res, err => {
        fs.readFile(`./uploads/${req.file.originalname}`, (err, data) => {
            if (err) return (console.log("This is the error"), err)

            worker
                .recognize(data, "eng", { tessjs_create_pdf: '1' })
                .progress(progress => {
                    console.log(progress);
                })
                .then(result => {
                    res.redirect("/download")
                })
                .finally(() => worker.terminate());

            app.get("/download", (req, res) => {
                const file = `${__dirname}/tesseract.js-ocr-result.pdf`;
                res.download(file);
            })
        })
    });
});

// Start Up our server
const PORT = 5000 || process.env.PORT
app.listen(PORT, () => console.log(`The Server is running on port ${PORT}`))