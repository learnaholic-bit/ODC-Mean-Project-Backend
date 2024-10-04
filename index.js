//check controller for validations
// add pagination in getall in controller
// handle image upload in item controller


const express = require("express");
const app = express();
const cors = require("cors");
// const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();

app.use(cors({
    origin: process.env.ServerUrl,
    // methods: ["GET", "POST", "PUT", "DELETE"],
    // just for testing purposes for now
    // origin: "*", //for all origins
    credentials: true,
    sameSite: "none",
}));
app.use('/uploads',express.static(path.join(__dirname, "uploads"))); 
app.use(cookieParser())
// app.use(bodyParser.json());
app.use(express.json());



// app.use(express.urlencoded({ extended: true }));



//connect to mongoDB
mongoose.connect(process.env.MongoUrl)

app.use("/items", require("./Routes/itemRoutes"));
app.use("/users", require("./Routes/userRoutes"));
app.use(require("./Middlewares/simpleErrorHandlerMiddleware"));




app.listen(process.env.PORT, () => {
    console.log(`server is running on port ${process.env.PORT}`);
})