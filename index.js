const express = require("express");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const fs = require("fs");
const catchAsync = require("./utils/catchAsync");

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const testFolder = "./files/";

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
        const list = await getList(`./files/${req.url.slice(5)}`);
        res.render("home", { list });
    })
);

app.get("/download/*", (req, res) => {
    let filePath = path.join(__dirname, "/files/cat.jpg");
    res.download(filePath);
});

app.post("/new-folder", (req, res) => {
    res.send(req.body);
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
