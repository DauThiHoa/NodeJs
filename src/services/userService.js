
import db from "../models/index";
import bcrypt from 'bcryptjs';


const salt = bcrypt.genSaltSync(10);


let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword); // resolve == return
        } catch (e) {
            reject(e);
        }
        // Store hash in your password DB.
    })
}
//  KIEM TRA DANG NHAP
let handleUserLogin = (email, password) => {

    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            // KIEM TRA XEM NGƯƠI DUNG CO  TREN HE THONG HAY KHONG
            let isExist = await checkUserEmail(email);
            if (isExist) {
                // user already exist 
                let user = await db.User.findOne({
                    // LAY 3 TRUONG => CHU KHONG PHAI LAY HET THUOC TINH CUA DOI TUONG
                    attributes: ['email', 'roleId', 'password'],
                    where: { email: email },
                    raw: true,
                })
                if (user) {
                    // compare password
                    let check = await bcrypt.compareSync(password, user.password);
                    // let check = true;
                    // bcrypt.compareSync("not_bacon" , hash);// false
                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = `ok`;

                        delete user.password;
                        userData.user = user;
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = `Wrong password`;
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = `User's not found`
                }
            } else {
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
let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail }
            })
            if (user) {
                // NEU EMAIL CO TRONG CSDL => TRA VE TRUE
                resolve(true)
            } else {
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
    return new Promise(async (resolve, reject) => {
        try {
            let users = '';
            if (userId === 'ALL') {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            if (userId && userId !== 'ALL') {
                users = await db.User.findOne({
                    where: { id: userId },
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            resolve(users)
        } catch (e) {
            reject(e);
        }
    })
}
let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // check email is exit ???
            let check = await checkUserEmail(data.email);
            if (check === true) {
                resolve({
                    errCode: 1,
                    message: 'Your email is already is used, Please try another email!'
                })
            }
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
            resolve({
                errCode: 0,
                message: 'OK'
            })
        } catch (e) {
            reject(e);
        }
    })
}
let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        let foundUser = await db.User.findOne({
            where: { id: userId }
        })
        if(!foundUser){
            resolve({
                errCode:2,
                errMessage:`The user isn't exist`
            })
        }
        
        await db.User.destroy({
            where: { id: userId }
        })

        resolve({
            errCode:0,
                message:`The user is delete`
        })

    })
}
 let updateUserData = (data) =>{
    return new Promise (async (resolve, reject) => {
        try{
            if(!data.id){
                resolve({
                    errCode: 2,
                    errMessage: 'Missing required parameters'
                })
            }
            let user = await db.User.findOne ({
                where:{ id: data.id },
                raw: false
             })
             if (user){
                user.firstName = data.firstName;
                user.lastName= data.lastName;
                user.address= data.address;

                await user.save();
                
                 
                 resolve({
                    errCode: 0,
                    message: 'Update the user succeeds!'
                 })
             }else {
                 resolve({
                    errCode: 1,
                    message: `User's not found `
                 
                 });

             } 
        }catch(e){
            reject(e);
        }
    })
 }
module.exports = {
    handleUserLogin: handleUserLogin,
    checkUserEmail: checkUserEmail,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    deleteUser: deleteUser
}