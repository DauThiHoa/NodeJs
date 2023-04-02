import bcrypt from 'bcryptjs';
const salt = bcrypt.genSaltSync(10);

let createNewUser = async (data) => {
    let hashPasswordFromBcrypt = await hashUserPassword(data.password);

    console.log('------------------')
    console.log(data)
    console.log(hashPasswordFromBcrypt)
    console.log('------------------')
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
module.exports= {
    createNewUser: createNewUser,
    hashUserPassword:hashUserPassword,

}