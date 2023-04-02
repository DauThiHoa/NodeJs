// lay tat ca cac model
import db from '../models/index';
import CRUDService from '../services/CRUDService';

let getHomePage = async (req, res) => {

    try {
        let data = await db.User.findAll();  
        return res.render ('homepage.ejs',{
            data: JSON.stringify(data)
        });

    } catch (error) {
        console.log(error)
    }
     
}

let getCRUD = async (req, res) => {

    // try {
    //     let data = await db.User.findAll();  
    //     return res.render ('homepage.ejs',{
    //         data: JSON.stringify(data)
    //     });

    // } catch (error) {
    //     console.log(error)
    // }
    return res.render ('crud.ejs');
     
}

// Object : {
//     key :'',
//     value: '',
// }
let getAboutPage = (req, res) => {
    return res.render ('test/about.ejs');
}

let postCRUD = async (req, res) => {
    await CRUDService.createNewUser(req.body) 
    return res.send ('post crud from server');
     
}

module.exports = {
    getHomePage: getHomePage,
    getAboutPage:getAboutPage,
    getCRUD: getCRUD,
    postCRUD: postCRUD,

}