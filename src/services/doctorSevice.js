
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

let getAllDoctors = () => {
    //  DUNG PROMISE => 100% SE TRA VE DU LIEU
    return new Promise (async (resolve, reject) => {
        try {
            //  LAY TAT CA CAC BAC SI TRONG DATABASE
            let doctors = await db.User.findAll ({
                // Dieu kien laf chuc danh => R2 ( Bac Si )
                where : {roleId: 'R2'},
                attributes: {
                    exclude: ['password', 'image']
                },
            })
            // resolve == return
            resolve ({
                errCode: 0,
                data: doctors
            })

        } catch (e) {
            reject(e)
        }
    })
}

let saveDetailInforDoctor = (inputData) => {
    return new Promise (async (resolve, reject) => {
        try {
            // 3 TRUONG CAN THIET CHO LUU TRU DATABASE => NEN KO THE THIEU
            if (!inputData.doctorId || !inputData.contentHTML || !inputData.contentMarkdown){
                resolve ({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            }else {
                     // NGUOC LAI => SAVE=> DOCTOR 
              await db.Markdown.create ({
                    contentHTML: inputData.contentHTML,
                    contentMarkdown: inputData.contentMarkdown,
                    description: inputData.description,
                    doctorId: inputData.doctorId
                })
            // => Neu luu thanh cong se gui ve thong bao
                resolve ({
                    errCode: 0,
                    errMessage: 'Save infor doctor succeed!'
                })
            }
           
            
        } catch (e) {
            reject(e);
        }

    })
}

// LAY THONG TIN BAC SI THEO MA ID
let getDetailDoctorById = (inputId) => {
    return new Promise (async (resolve, reject) => {
        try {
            // 3 TRUONG CAN THIET CHO LUU TRU DATABASE => NEN KO THE THIEU
            if (!inputId){
                resolve ({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            }else {
                // LAY 1 User ( fillOne) ( Voi ma ID)
                let data = await db.User.findOne ({
                    // Dieu kien id dien vao bang id trong database
                    where : {
                        id : inputId
                    },
                    // Bo 1 truong password 
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        {model: db.Markdown ,
                        // LAY CAC COT CAN THIET TRONG BANG Markdown
                        attributes: ['description', 'contentHTML', 'contentMarkdown']
                    } ,
                    // LAY THEM CHUC DANH CUA USER
                    {model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVn']},
                   
                    ],
                    //  raw: true,
                    raw: false,
                    nest: true
                })

                // TAO ANH HIEN THI ( DO O DATABASE => LA HINH ANH BLOG )
                if ( data && data.image) {
                    data.image = new Buffer ( data.image, 'base64').toString('binary'); 
                }

                // => CO BI SAI CUNG TRA VE GIA TRI BI NULL => khong hien loi do => Van hien form
                if ( !data ) data = {};
            // => Neu luu thanh cong se gui ve thong bao
                resolve ({
                    errCode: 0,
                    data: data
                })
            }
           
            
        } catch (e) {
            reject(e);
        }

    })
}

module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctors : getAllDoctors,
    saveDetailInforDoctor : saveDetailInforDoctor,
    getDetailDoctorById: getDetailDoctorById,
}