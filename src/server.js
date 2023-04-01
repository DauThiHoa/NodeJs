import express from "express";
import bodyParser from "body-parser";
import connectDB from './config/connectDB';
// su dung => user?id =1 => bodyParser lay id = 7

import viewEngine from "./config/viewEngine";
import initWebRoutes from "./route/web";
require('dotenv').config();

let app = express();
// config app
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true}))

viewEngine(app);
initWebRoutes(app);

connectDB();

let port = process.env.PORT || 6969;
// PORT == UNDEFINED => PORT = 6969

app.listen(port, () => {
    // CALLBACK
    console.log("BACKEND NODEJS IS RUNING ON THE PORT: " + port);
})