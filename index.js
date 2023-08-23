const express = require("express");
const dbConnect = require("./config/dbConnect");
const app = express()
const dotenv = require("dotenv").config()
const PORT = process.env.PORT || 8000;
const authRouter = require("./routes/authRoute");
const serviceRouter = require("./routes/serviceRoute");
const projectRouter = require("./routes/projectRoute");
const employeeRouter = require("./routes/employeeRoute");
const blogRouter = require("./routes/blogRoute");
const settingsRouter = require("./routes/settingsRoute");

const cors = require('cors'); // Import the cors package

const multer = require("multer")
const path = require("path")

const bodyParser = require("body-parser");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const cookieParser = require("cookie-parser");
dbConnect()
app.use(express.json())
app.use(cors());
app.use(express.static("images"))

// Content-Type: application/x-www-form-url-encoded
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

// fileFilter: تحديد ما سيتم استقباله
const fileFilter = (req, file, callback) => {
    const allowedMimeTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/svg+xml" // Add SVG MIME type here
    ];

    const acceptFile = allowedMimeTypes.includes(file.mimetype);
    callback(null, acceptFile);
};

// fileStorage: مكان التخزين للملف والاسم المخزن فيه الملف
const fileStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        console.log("destination")
        callback(null, "./../images")
    },
    // destination: "images",
    filename: (req, file, callback) => {
        console.log("file")
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)

        callback(null, uniqueSuffix + "-" + file.originalname)
    }
})
app.use(express.static(path.join(__dirname, "images")))

// app.use: multer
// Content-Type: multipart/form-data (multipart)

app.use("images", (req, res, next) => {
    console.log(path.dirname(require.main.filename), "path")
    console.log(next, "next")
    console.log(require, "require")
    path.dirname(require.main.filename)
})
app.use(
    multer({
        dest: "images",
        storage: fileStorage,
        fileFilter: fileFilter
    }).single("image"))


    app.get("/images", function (req, res, next) {
        // Assuming you want to send a response, for example, render an HTML page
        res.render("images"); // You should have a corresponding view named "images.ejs" or similar
    
        // If you want to send a JSON response, you could do something like this:
        // res.json({ message: "Images endpoint reached" });
    });
    
app.use("/api/user", authRouter)
app.use("/api/project", projectRouter)
app.use("/api/service", serviceRouter)
app.use("/api/employee", employeeRouter)
app.use("/api/blog", blogRouter)
app.use("/api/settings", settingsRouter)

app.use(notFound)
app.use(errorHandler)
app.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}`)
})