require("dotenv").config()
const PORT = process.env.PORT
const express = require("express")
const userRoute = require("./Route/userRoutes")
const cors = require("cors")
const cookieParser = require("cookie-parser")

const app = express()

app.use(express.json());
app.use(express.urlencoded({"extended": true}))
app.use(cookieParser())
app.use(cors())

app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
  });

app.use('/', userRoute)

app.listen(PORT, () => {
    console.log(`Port is running at ${PORT}`);
})