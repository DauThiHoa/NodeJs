// CHAY FILE DAU TIEN CUA DU AN 
import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";

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

    // SUA DU LIEU CUA DOI TUONG
    router.post('/api/login', userController.handleLogin);

    //Tao API LAY TAT CA DU LIEU
    router.get('/api/get-all-users',userController.handleGetAllUsers);

    router.post('/api/create-new-user', userController.handleCreateNewUser);
    router.put('/api/edit-user', userController.handleEditUser);
    router.delete('/api/delete-user', userController.handleDeleteUser);//restAPI

    router.get('/allcode',userController.getAllCode);
// rest api

router.get('/hoidanit', (req, res) => {
    return res.send('HELLO WORD hoidanit ');
})

    return app.use ("/", router);
}

module.exports = initWebRoutes;