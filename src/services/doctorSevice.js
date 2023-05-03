
import db from "../models/index";
require('dotenv').config();
import _ from 'lodash';
const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

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
            if ( !inputData.doctorId        || !inputData.contentHTML       ||
                 !inputData.contentMarkdown || !inputData.action            ||
                 !inputData.selectedPrice   || !inputData.selectedPayment   ||
                 !inputData.selectProvince  || !inputData.nameClinic        ||
                 !inputData.addressClinic   || !inputData.note               ){
                resolve ({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })

            }else {

                // Upsert to markdown
                 if ( inputData.action === 'CREATE'){
                      // NGUOC LAI => SAVE=> DOCTOR 
                       await db.Markdown.create ({
                       contentHTML: inputData.contentHTML,
                       contentMarkdown: inputData.contentMarkdown,
                       description: inputData.description,
                       doctorId: inputData.doctorId
                  })
               
                }else if ( inputData.action === 'EDIT' ){

                    // KIEU OBJECT
                    let doctorMarkdown = await db.Markdown.findOne ({
                        where: {
                            doctorId: inputData.doctorId
                        }
                        , raw: false
                    })

                    if ( doctorMarkdown){
                        doctorMarkdown.contentHTML= inputData.contentHTML;
                        doctorMarkdown.contentMarkdown= inputData.contentMarkdown;
                        doctorMarkdown.description= inputData.description;
                        doctorMarkdown.updateAt = new Date ();

                        await doctorMarkdown.save()
                    }

                }
              
                // Upsert to Doctor_infor table
                let doctorInfor = await db.Doctor_Infor.findOne ({
                    where: {
                        doctorId: inputData.doctorId 
                    },
                    raw: false
                })

                if (doctorInfor) {
                    //Update 
                    doctorInfor.doctorId = inputData.doctorId;
                    doctorInfor.priceId= inputData.selectedPrice;
                    doctorInfor.provinceId= inputData.selectProvince;
                    doctorInfor.paymentId= inputData.selectedPayment; 

                    doctorInfor.nameClinic= inputData.nameClinic;
                    doctorInfor.addressClinic= inputData.addressClinic;
                    doctorInfor.note= inputData.note; 

                    await doctorInfor.save()

                }else {
                    // Create

                    await db.Doctor_Infor.create ({
                        doctorId: inputData.doctorId,
                        priceId: inputData.selectedPrice,
                        provinceId: inputData.selectProvince,
                        paymentId: inputData.selectedPayment,
    
                        nameClinic: inputData.nameClinic,
                        addressClinic: inputData.addressClinic,
                        note: inputData.note 
                   })

                }




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

let bulkCreateSchedule = (data) => {
 //  DUNG PROMISE => 100% SE TRA VE DU LIEU
 return new Promise (async (resolve, reject) => {
    try {
         
        if (!data.arrSchedule || !data.doctorId || !data.formatedDate){
            resolve ({
                errCode: 1,
                errMessage: 'Missing required param !'
            })
        }else {
            let schedule = data.arrSchedule;
            if ( schedule && schedule.length > 0){
                schedule = schedule.map (item => {
                    item.maxNumber = MAX_NUMBER_SCHEDULE ;
                    return item;
                })
            } 
           
            // HAN CHE TRUNG DU LIEU ( )
            // GET ALL EXISTING DATA
            let existing = await db.Schedule.findAll (
                {
                    where: {doctorId : data.doctorId, date : data.formatedDate},
                    attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
                    raw: true
                }
            );
            // CONVERT DATE

            // if ( existing && existing.length > 0){
            //     existing = existing.map (item => {
            //         item.date = new Date (item.date).getTime ();
            //         return item;
            //     })
            // }

            // COMPARE DIFFERENT
            let toCreate = _.differenceWith (schedule, existing, (a,b) => {
                return a.timeType === b.timeType && +a.date === +b.date;
            }); 
            // HAN CHE TRUNG DU LIEU ( )

             if ( toCreate && toCreate.length > 0){
                await db.Schedule.bulkCreate(toCreate);
             }
 
            // resolve == return
            resolve ({
                errCode: 0,
                errMessage: 'OK'
            })
        } 

    } catch (e) {
        reject(e)
    }
})
}

let getScheduleByDate = (doctorId, date) => {
 //  DUNG PROMISE => 100% SE TRA VE DU LIEU
 return new Promise (async (resolve, reject) => {
    try {
        
        if ( !doctorId || !date) {
            resolve ({
                errCode: 1,
                errMessage: 'Missing required param !'
            })
        }else {
            let dataSchedule = await db.Schedule.findAll ({
                where: {
                    doctorId: doctorId,
                    date: date
                } ,
                include: [ 
                // LAY THEM CHUC DANH CUA USER
                {model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVn']},
               
                ],
                //  raw: true,
                raw: false,
                nest: true
            })
 
            if (!dataSchedule) dataSchedule = [];

             // resolve == return
        resolve ({
            errCode: 0,
            data: dataSchedule 
        })
        }
        

    } catch (e) {
        reject(e)
    }
})
}

module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctors : getAllDoctors,
    saveDetailInforDoctor : saveDetailInforDoctor,
    getDetailDoctorById: getDetailDoctorById,
    bulkCreateSchedule: bulkCreateSchedule,
    getScheduleByDate: getScheduleByDate,
}