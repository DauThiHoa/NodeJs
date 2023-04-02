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
   let message =  await CRUDService.createNewUser(req.body) 
    return res.send ('post crud from server');
     
}
let displayGetCRUD = async (req, res) => { 
    let data = await CRUDService.getAllUser(); 

     return res.render ('displayCRUD.ejs', {
        dataTable: data,
     });
      
 }
 // lay 1 doi tuong trong user voi tham so duoc truyen vo la id
 let getEditCRUD = async (req, res) => { 
     let userId = req.query.id;
     if (userId){ 
        let userData = await CRUDService.getUserInfoById (userId);  
// x <-y
        return res.render ('editCRUD.ejs',{
            user: userData
        });

    } else { 
        return res.send ('Users not found!');
     }
 
 }
 // THAY DOI GIA TRI CUA 1 DOI TUONG TRONG CSDL
 let putCRUD = async (req, res) => { 

        let data = req.body; 
        let allUsers = await CRUDService.updateUserData (data);  
        // x <-y
        return res.render ('displayCRUD.ejs', {
            dataTable: allUsers,
         });

}
// XOA 1 DOI TUONG RA KHOI DATABASE
let deleteCRUD = async (req, res) => { 
    let id = req.query.id; 
    if (id){
        await CRUDService.deleteUserById (id);
        // x <-y
      return res.send('DELETE THE USER SUCCESS!')
         // return res.render ('displayCRUD.ejs', {
      //     dataTable: allUsers,
          //  });
    }else {
        return res.send('USER THE NO FOUND')
    }
     

}
module.exports = {
    getHomePage: getHomePage,
    getAboutPage:getAboutPage,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    displayGetCRUD: displayGetCRUD,
    getEditCRUD: getEditCRUD,
    putCRUD: putCRUD,
    deleteCRUD: deleteCRUD,

}