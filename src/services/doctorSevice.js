
import db from "../models/index";
require('dotenv').config();
import _ from 'lodash';
import emailServices from '../services/emailServices';

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
// CHECK INPUT 
let checkRequiredFields = (inputData) =>{
    let arrFields = ['doctorId','contentHTML','contentMarkdown','action','selectedPrice',
        'selectedPayment','selectedProvince','nameClinic','addressClinic','note',
        'specialtyId']

        let isValid = true;
        let element = '';
        for (let i = 0 ; i < arrFields.length; i++){
            if (!inputData[arrFields[i]]){
                isValid = false;
                element = arrFields[i];
                break;
            }
        }
        return{
            isValid: isValid,
            element: element
        }
}

let saveDetailInforDoctor = (inputData) => {
    return new Promise (async (resolve, reject) => {
        try { 

            let checkObj = checkRequiredFields(inputData);

            // 3 TRUONG CAN THIET CHO LUU TRU DATABASE => NEN KO THE THIEU
            if ( checkObj.isValid === false){
                resolve ({
                    errCode: 1,
                    errMessage: `Missing parameter: ${checkObj.element}`
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
                    doctorInfor.provinceId= inputData.selectedProvince;
                    doctorInfor.paymentId= inputData.selectedPayment; 

                    doctorInfor.nameClinic= inputData.nameClinic;
                    doctorInfor.addressClinic= inputData.addressClinic;
                    doctorInfor.note= inputData.note; 
                    doctorInfor.specialtyId = inputData.specialtyId;
                    doctorInfor.clinicId = inputData.clinicId;

                    await doctorInfor.save()

                }else {
                    // Create

                    await db.Doctor_Infor.create ({
                        doctorId: inputData.doctorId,
                        priceId: inputData.selectedPrice,
                        provinceId: inputData.selectedProvince,
                        paymentId: inputData.selectedPayment,
    
                        nameClinic: inputData.nameClinic,
                        addressClinic: inputData.addressClinic,
                        note: inputData.note ,
                        
                        specialtyId : inputData.specialtyId,
                        clinicId : inputData.clinicId,
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
                         {model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVn']
                        } ,
                    {model: 
                        db.Doctor_Infor ,
                        // LAY CAC COT CAN THIET TRONG BANG Markdown
                        attributes: {
                            exclude: ['id', 'doctorId']
                        },
                         
                        include : [
                            {model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVn']},
                            {model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVn']},
                            {model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVn']}
                        ]
                    }
 
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
                if ( !data ) 
                    data = {};

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
                {model: db.User, as: 'doctorData', attributes: ['firstName', 'lastName']},
               
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


//  getExtraInforDoctorById 
let getExtraInforDoctorById = (idInput) => {
    //  DUNG PROMISE => 100% SE TRA VE DU LIEU
    return new Promise (async (resolve, reject) => {
       try {
           
           if ( !idInput ) {
               resolve ({
                   errCode: 1,
                   errMessage: 'Missing required param !'
               })
           }else {
               let data = await db.Doctor_Infor.findOne ({
                   where: {
                       doctorId: idInput 
                   } ,
                   attributes: {
                         exclude: ['id', 'doctorId']
                     },
                 
                include : [
                    {model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVn']},
                    {model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVn']},
                    {model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVn']}
                ],
                raw: false,
                nest: true

               })
      
               if ( !data ) data = {};
                // resolve == return
           resolve ({
               errCode: 0,
               data: data
           })
           }
           
   
       } catch (e) {
           reject(e)
       }
   })
   }

//    getProfileDoctorById
let getProfileDoctorById = (doctorId) => {
    //  DUNG PROMISE => 100% SE TRA VE DU LIEU
    return new Promise (async (resolve, reject) => {
       try {
           
           if ( !doctorId ) {
               resolve ({
                   errCode: 1,
                   errMessage: 'Missing required param !'
               })
           }else {
                 // LAY 1 User ( fillOne) ( Voi ma ID)
                 let data = await db.User.findOne ({
                    // Dieu kien id dien vao bang id trong database
                    where : {
                        id : doctorId
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
                         {model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVn']
                        } ,
                    {model: 
                        db.Doctor_Infor ,
                        // LAY CAC COT CAN THIET TRONG BANG Markdown
                        attributes: {
                            exclude: ['id', 'doctorId']
                        },
                         
                        include : [
                            {model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVn']},
                            {model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVn']},
                            {model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVn']}
                        ]
                    }
 
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
                if ( !data ) 
                    data = {};

                // resolve == return
           resolve ({
               errCode: 0,
               data: data
           })
           }
           
   
       } catch (e) {
           reject(e)
       }
   })
   }

   
//    getListPatientForDoctor
let getListPatientForDoctor = (doctorId, date) => {
    //  DUNG PROMISE => 100% SE TRA VE DU LIEU
    return new Promise (async (resolve, reject) => {
       try {
           
           if ( !doctorId  || !date) {
               resolve ({
                   errCode: 1,
                   errMessage: 'Missing required param !'
               })
           }else {
                 let data = await db.Booking.findAll ({
                    where :{
                        statusId: 'S2',
                        doctorId: doctorId,
                        date: date
                    },
                    include: [ 
                        {model: db.User , as: 'patientData',
                            // LAY CAC COT CAN THIET TRONG BANG Markdown
                            attributes: ['email', 'firstName', 'address', 'gender'],
                            include: [
                                {model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVn']} 
                            ],
                        } ,

                        {
                            model: db.Allcode, as: 'timeTypeDataPatient', attributes: ['valueEn', 'valueVn']
                            
                        }
                    ],
                    //  raw: true,
                    raw: false,
                    nest: true

                 })

                // resolve == return
           resolve ({
               errCode: 0,
               data: data
           })
           }
           
   
       } catch (e) {
           reject(e)
       }
   })
   }

   
// Delete Booking
   let postDeletePatientForDoctor = (doctorId,patientId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date || !patientId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required param!'
                });
            } else {
                // Get the appointment to be deleted
                let appointmentToDelete = await db.Booking.findOne({
                    where: {
                        doctorId: doctorId,
                        patientId:patientId,
                        date: date
                    },
                    raw: false
                });

                if (appointmentToDelete) {
                    await appointmentToDelete.destroy(); // Delete the appointment

                    resolve({
                        errCode: 0,
                        errMessage: 'Delete appointment succeed!'
                    });
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'No appointment found for the given doctor and date'
                    });
                }
            }
        } catch (e) {
            reject(e);
        }
    });
};


   
//    sendRemedy
let sendRemedy = (data) => {
    //  DUNG PROMISE => 100% SE TRA VE DU LIEU
    return new Promise (async (resolve, reject) => {
       try {
           
           if ( !data.email  || !data.doctorId 
            || !data.patientId || !data.timeType) {
               resolve ({
                   errCode: 1,
                   errMessage: 'Missing required param !'
               })
           }else {
                // Update patient status
                let appointment = await db.Booking.findOne ({
                    where : {
                        doctorId : data.doctorId,
                        patientId: data.patientId,
                        timeType: data.timeType,
                        statusId: 'S2'
                    },
                    raw: false
                })
                if ( appointment) {
                    appointment.statusId = 'S3';
                    await appointment.save ()
                }
                //  Send Remedy
            await emailServices.sendAttachment ( data );

                // resolve == return
           resolve ({
               errCode: 0,
               errMessage: 'OK',
               data: data
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
    getExtraInforDoctorById: getExtraInforDoctorById,
    getProfileDoctorById : getProfileDoctorById,
    getListPatientForDoctor: getListPatientForDoctor,
    postDeletePatientForDoctor:postDeletePatientForDoctor,
    sendRemedy: sendRemedy
}