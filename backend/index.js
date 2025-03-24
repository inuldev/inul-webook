const express = require("express");
const cookieParser = require("cookie-parser");
const connectDb = require("./config/db");

require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cookieParser());

connectDb();

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`server listening on ${PORT}`));
