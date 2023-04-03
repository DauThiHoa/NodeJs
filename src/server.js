import express from "express";
import bodyParser from "body-parser";
import connectDB from './config/connectDB';
// su dung => user?id =1 => bodyParser lay id = 7
// import cors from 'cors';

import viewEngine from "./config/viewEngine";
import initWebRoutes from "./route/web";
require('dotenv').config();

let app = express();
// app.use(cors({origin : true}));
// XU LY LOI CORS 
// Add headers before the routes are defined
app.use(function (req, res, next) {

    // DUONG LINK REACT => CHAY 
    res.setHeader('Access-Control-Allow-Origin', process.env.URL_REACT);

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

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