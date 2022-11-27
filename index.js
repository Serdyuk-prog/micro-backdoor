const express = require("express");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const fs = require("fs");
const catchAsync = require("./utils/catchAsync");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.set("layout", "layout.ejs");
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(expressLayouts);

const sharedFolder = "./files/";

const getList = async (folder) => {
    return await fs.promises.readdir(folder, (err, files) => {
        const list = [];
        files.forEach((file) => {
            list.push(file);
        });
    });
};

app.get("/", (req, res) => {
    res.redirect("/show/");
});

app.get(
    "/show/*",
    catchAsync(async (req, res) => {
        let filePath;
        if (req.url.slice(6) == "") {
            filePath = `${sharedFolder}${req.url.slice(6)}`;
        } else {
            filePath = `${sharedFolder}${req.url.slice(6)}/`;
        }
        const fileNames = await getList(filePath);
        const list = [];
        for (let name of fileNames) {
            let type = "dir";
            if (name.indexOf(".") > -1) {
                type = "file";
            }
            list.push({
                name: name,
                type: type,
            });
        }
        res.render("home", { list, filePath });
    })
);

app.get("/download/*", (req, res) => {
    let filePath = path.join(__dirname, `${req.url.slice(10)}`);
    res.download(filePath);
});

app.post("/new-folder", (req, res) => {
    const dir = sharedFolder + req.body.dir.slice(6);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    res.sendStatus(200);
});

app.post("/delete", (req, res) => {
    let filePath = path.join(__dirname, req.body.path);
    if (fs.existsSync(filePath)) {
        fs.rmSync(filePath, { recursive: true, force: true });
    }
    res.sendStatus(200);
});

app.post("/new-file/*", upload.single("uploadFile"), (req, res) => {
    let filePath = path.join(__dirname, `${req.url.slice(10)}`);
    const file = req.file;
    fs.writeFile(
        `${filePath}${file.originalname}`,
        file.buffer,
        function (err) {
            if (err) return console.log(err);
            console.log("file uploaded");
        }
    );
    res.redirect(`/show/`);
});

app.use((err, req, res, next) => {
    if (!err.message) err.message = "Something went wrong!";
    if (!err.status) err.status = 500;
    const { status } = err;
    res.status(status).render("error", { err });
});

app.listen(3000, () => {
    console.log("Listening оn port 3000");
});
