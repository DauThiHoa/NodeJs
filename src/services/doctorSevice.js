
import db from "../models/index";

let getTopDoctorHome = ( limitInput ) => {

    return new Promise ( async (resolve , reject) => {
        try {
            // Lay tat ca nguoi dung trong database
            let users = await db.User.findAll ({
                // Neu khong co limitInput => Mac dinh = 10
                limit: limitInput,
                // 
                where: { roleId : 'R2'},
                // Sap xep theo ngay tao giam dan
                order: [['createdAt' , 'DESC']],
                // Loai bo truong Password
                attributes: {
                    exclude: ['password']
                },
                include: [
                    {model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVn']},
                    {model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVn']}
                ],
                raw: true,
                nest: true
            })
            // Bien tra ve 
            resolve ({
                errCode: 0,
                data: users
            })
        } catch (e) {
            reject(e);
        }
    })
}
module.exports = {
    getTopDoctorHome: getTopDoctorHome
}