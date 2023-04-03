import userService from "../services/userService";
 
// HAM XU LY DANG NHAP
let handleLogin = async (req, res) => {
    // LAY GIA TRIJ USERNAME VA PASSWORD
    let email = req.body.email;
    let password = req.body.password;

    if (!email || !password){
        return res.status(500).json({
            errCode:1,
            message: 'Missing inputs parameter!'
        })
    }
    let userData = await userService.handleUserLogin (email, password);
// check email exist
// compare password
// return userInfor
// access token: JWT JSON WEB TOKEN
    return res.status(200).json ({
        errCode: userData.errCode,
        message: userData.errMessage,
        user: userData.user ? userData.user : {}
    })
}

module.exports = {
    handleLogin: handleLogin
}