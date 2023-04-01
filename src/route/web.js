// CHAY FILE DAU TIEN CUA DU AN 
import express from "express";
import homeController from "../controllers/homeController";
let router = express.Router();

let initWebRoutes = (app) => {
    // TAO UNG DUNG DAU TIEN 
    router.get('/', homeController.getHomePage);
     // vd => chuyen trang about
     router.get('/about', homeController.getAboutPage);

// rest api
router.get('/hoidanit', (req, res) => {
    return res.send('HELLO WORD hoidanit ');
})

    return app.use ("/", router);
}

module.exports = initWebRoutes;