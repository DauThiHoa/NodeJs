import db from "../models/index";
require('dotenv').config();
import _ from 'lodash';
import emailService from './emailServices';
import { v4 as uuidv4 } from 'uuid'; 

// Chuoi gui xac nhan Email
let buildUrlEmail = ( doctorId, token) => { 
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`;
return result;
}
let postBookAppointment = ( data ) => {
     //  DUNG PROMISE => 100% SE TRA VE DU LIEU
     return new Promise (async (resolve, reject) => {
        try {
            
            if ( !data.email || !data.doctorId || !data.timeType || !data.date || 
                 !data.fullName ) {
                resolve ({
                    errCode: 1,
                    errMessage: 'Missing required param !'
                })
            }else {

                // await emailService.sendSimpleEmail ('19130075@hcmuaf.edu.vn');
                // console.log ( data.email);
                let token = uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'

             await emailService.sendSimpleEmail ({
                reciverEmail : data.email,
                patientName: data.fullName,
                time: data.timeString,
                doctorName: data.doctorName,
                language : data.language,
                redirectLink: buildUrlEmail ( data.doctorId, token)
             });

                //  upsert patient
              let user = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                        email: data.email,
                        roleId: 'R3'
                    },
                  }); 

                //   create a booking record ( Tao ban ghi )
                  if (user && user[0]){
                    await db.Booking.findOrCreate ({
                        where: {  patientId: user[0].id },
                        defaults: {
                            statusId: 'S1',
                            doctorId: data.doctorId,
                            patientId: user[0].id,
                            date: data.date,
                            timeType: data.timeType ,
                            token: token
                        },
                        
                    })
                  }
                // if ( !data ) data = {};
                 // resolve == return
            resolve ({
                errCode: 0,
                errMessage: 'Save infor patinet succeed!' 
            })
            }
            
    
        } catch (e) {
            reject(e)
        }
    })
}



let postVerifyBookAppointment = ( data ) => {
    //  DUNG PROMISE => 100% SE TRA VE DU LIEU
    return new Promise (async (resolve, reject) => {
       try {
           
           if ( !data.token || !data.doctorId ) {
               resolve ({
                   errCode: 1,
                   errMessage: 'Missing required param !'
               })
           }else {
            // True => appointment | false => Utifi
            let appointment = await db.Booking.findOne ({
                where:{
                    doctorId: data.doctorId,
                    token: data.token,
                    statusId: 'S1'
                },

                raw : false
            })
             
            if ( appointment ){
                appointment.statusId= 'S2';
                await appointment.save ();

                   // resolve == return
           resolve ({
            errCode: 0,
            errMessage: 'Save infor patinet succeed!' 
        })
            }else {
                   // resolve == return
           resolve ({
            errCode: 2,
            errMessage: 'Appointment has been activated or does not exist' 
        })
            }

            
           }
           
   
       } catch (e) {
           reject(e)
       }
   })
}

module.exports = {
    postBookAppointment : postBookAppointment,
    buildUrlEmail:buildUrlEmail,
    postVerifyBookAppointment:postVerifyBookAppointment,
}