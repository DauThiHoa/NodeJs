// CHAY FILE DAU TIEN CUA DU AN 
import express from "express";
import homeController from "../controllers/homeController";
let router = express.Router();

let initWebRoutes = (app) => {
    // TAO UNG DUNG DAU TIEN 
    router.get('/', homeController.getHomePage);
     // vd => chuyen trang about
     router.get('/about', homeController.getAboutPage);

     // LAY DU LIEU TU DATABASE
     router.get('/crud', homeController.getCRUD);

    // LAY DU LIEU TU DATABASE
    router.post('/post-crud', homeController.postCRUD);

    // LAY DU LIEU TU DATABASE
    router.get('/get-crud', homeController.displayGetCRUD);

    // SUA DU LIEU CUA DOI TUONG
    router.get('/edit-crud', homeController.getEditCRUD);

    // SUA DU LIEU CUA DOI TUONG
    router.post('/put-crud', homeController.putCRUD);

    // SUA DU LIEU CUA DOI TUONG
    router.get('/delete-crud', homeController.deleteCRUD);

// rest api
router.get('/hoidanit', (req, res) => {
    return res.send('HELLO WORD hoidanit ');
})

    return app.use ("/", router);
}

module.exports = initWebRoutes;