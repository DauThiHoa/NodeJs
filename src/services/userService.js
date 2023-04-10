 
import db from "../models/index";
import bcrypt from 'bcryptjs';

//  KIEM TRA DANG NHAP
let handleUserLogin = ( email, password) => {

    return new Promise(async (resolve, reject) => {
        try { 
            let userData = {};
// KIEM TRA XEM NGƯƠI DUNG CO  TREN HE THONG HAY KHONG
             let isExist = await checkUserEmail (email);
             if (isExist){
                // user already exist 
                let user = await db.User.findOne ({
                    // LAY 3 TRUONG => CHU KHONG PHAI LAY HET THUOC TINH CUA DOI TUONG
                    attributes :  ['email', 'roleId','password'], 
                    where: {email: email},
                    raw: true,
                })
                if ( user ){
                    // compare password
                    let check = await bcrypt.compareSync( password, user.password);
                    // let check = true;
                    // bcrypt.compareSync("not_bacon" , hash);// false
                    if(check){
                          userData.errCode = 0;
                          userData.errMessage = `ok`; 
                         
                          delete user.password; 
                          userData.user = user;
                    }else {
                          userData.errCode = 3;
                          userData.errMessage = `Wrong password`;
                    }
                }else{
                    userData.errCode = 2;
                    userData.errMessage = `User's not found`
                } 
             }else {
                //  return error
                userData.errCode = 1;
                userData.errMessage = `'Your's Email isn't exits in your in your system.Plz try other email!`
               
             }
             resolve(userData)

        } catch (error) {
            reject(error);
        } 
// Store hash in your password DB.
    })

}
// KIEM TRA EMAIL CO TON TAI TRONG CSDL HAY KHONG
let checkUserEmail = ( userEmail) => {
    return new Promise(async (resolve, reject) => {
        try { 
            let user = await db.User.findOne({
                where: {email : userEmail}
            })
            if ( user){
                // NEU EMAIL CO TRONG CSDL => TRA VE TRUE
                resolve(true)
            }else {
                 // NEU EMAIL KO CO TRONG CSDL => TRA VE FALSE
                resolve(false)
            }
        } catch (error) {
            reject(error);
        } 
// Store hash in your password DB.
    })
}

// KIEM TRA PASSWORD CO GIONG TRONG CSDL HAY KHONG
let compareUserPassword = () => {
    return new Promise(async (resolve, reject) => {
        try { 
            
        } catch (error) {
            reject(error);
        } 
// Store hash in your password DB.
    })
}
let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) =>{
        try{
            let users = '';
            if (userId === 'ALL') {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            if (userId && userId !== 'ALL'){
                users = await db.User.findOne({
                    where: { id: userId},
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            resolve(users)
        }catch(e){
            reject(e);
        }
    })
}
module.exports = {
    handleUserLogin: handleUserLogin,
    checkUserEmail: checkUserEmail,
    getAllUsers: getAllUsers
}