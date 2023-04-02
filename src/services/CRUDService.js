import bcrypt from 'bcryptjs';
const salt = bcrypt.genSaltSync(10);
import db from '../models/index';

let createNewUser = async (data) => {

    return new Promise(async (resolve, reject) => {
        try { 
            let hashPasswordFromBcrypt = await hashUserPassword(data.password);
            await db.User.create({
                email: data.email,
                password: hashPasswordFromBcrypt,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                phonenumber: data.phonenumber, 
                gender: data.gender === '1' ? true : false, 
                roleId: data.roleId,   
            })
            resolve('OK ! CREATE A NEW USER SUCCESSD')
        } catch (error) {
            reject(error);
        } 
// Store hash in your password DB.
    })
 
}
// MA HOA MAT KHAU 
let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try { 
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword); // resolve == return
        } catch (error) {
            reject(error);
        } 
// Store hash in your password DB.
    })
}

// LAY TOAN BO USER
let getAllUser = (password) => {
    return new Promise(async (resolve, reject) => {
        try { 
            //  GOI TOI TUONG USER
            let users = db.User.findAll ({
                raw: true,
            });
            resolve(users);

        } catch (error) {
            reject(error);
        } 
// Store hash in your password DB.
    })
}
// LAY 1 DOI TUONG VOI THAM SO TRUYEN VO LA MA USER
let getUserInfoById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try { 
            //  GOI TOI TUONG USER
            let user = await db.User.findOne ({
               where:{ 
                id: userId
                } ,
                raw: true,
            });
            if(user){
                resolve(user);
            } else {
                resolve({});
            }

        } catch (error) {
            reject(error);
        } 
// Store hash in your password DB.
    })
}
// THAY DOI GIA TRI TRONG DOI TUONG
let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try { 
            //  GOI TOI TUONG USER
            let user = await db.User.findOne ({
               where:{  id: data.id }  
            });
            if (user){
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;

                await user.save();

                let allUsers = await db.User.findAll();
                resolve(allUsers);
            }else {
                resolve();
            } 

        } catch (error) {
            reject(error);
        } 
// Store hash in your password DB.
    })
}
// XOA 1 DOI TUONG VOI THAM SO TRUYEN VO LA MA USER
let deleteUserById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try { 
            //  GOI TOI TUONG USER
            let user = await db.User.findOne ({
               where:{ 
                id: userId
                }  
            });
            if(user){
                await user.destroy();
            }  
            resolve(); // == return

        } catch (error) {
            reject(error);
        } 
// Store hash in your password DB.
    })
}
module.exports= {
    createNewUser: createNewUser,
    hashUserPassword:hashUserPassword, // HASH PASSWORD
    getAllUser: getAllUser,// LAY TAT CA CAC DOI TUONG TRONG USER
    getUserInfoById: getUserInfoById,// LAY DOI TUONG TU ID
    updateUserData: updateUserData,
    deleteUserById: deleteUserById,

}