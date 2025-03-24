const express = require("express");
const cookieParser = require("cookie-parser");

const connectDb = require("./config/db");

require("dotenv").config();

const authRoute = require("./routes/authRoute");

const app = express();
app.use(express.json());
app.use(cookieParser());

connectDb();

//api route
app.use("/auth", authRoute);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`server listening on ${PORT}`));
