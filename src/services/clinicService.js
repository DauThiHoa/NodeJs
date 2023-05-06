const db = require("../models")

let createClinic = (data) => {
 //  DUNG PROMISE => 100% SE TRA VE DU LIEU
 return new Promise (async (resolve, reject) => {
    try { 

        console.log ()
        if ( !data.name || !data.imageBase64 || !data.address ||
            !data.descriptionHTML || !data.descriptionMarkdown ) {
            resolve ({
                errCode: 1,
                errMessage: 'Missing required parameter !'
            })
        }else {
        
            await db.Clinic.create ({
                name: data.name,
                address: data.address,
                image: data.imageBase64 ,
                descriptionHTML: data.descriptionHTML,
                descriptionMarkdown: data.descriptionMarkdown
            })
                // resolve == return
        resolve ({
            errCode: 0,
            errMessage: 'OK!' 
        })
         
         } 
        

    } catch (e) {
        reject(e)
    }
})
}

//  getAllClinic
let getAllClinic = () => {
    //  DUNG PROMISE => 100% SE TRA VE DU LIEU
    return new Promise (async (resolve, reject) => {
        try {
            //  LAY TAT CA CAC BAC SI TRONG DATABASE
            let data = await db.Clinic.findAll ({
                // attributes: {
                //     exclude: ['image']
                // }
            });
            if ( data && data.lenght > 0){
                data.map ( item => {
                    item.image = new Buffer( item.image , 'base64').toString('binary');
                    return item;
                })
            }
            // resolve == return
            resolve ({
                errCode: 0,
                errMessage: 'OK',
                data: data
            })

        } catch (e) {
            reject(e)
        }
    })
}



//  getDetailClinicById

let getDetailClinicById = (inputId) => {
    //  DUNG PROMISE => 100% SE TRA VE DU LIEU
    return new Promise (async (resolve, reject) => {
        try {
             
            if ( !inputId ) {

                resolve ({
                    errCode: 1,
                    errMessage: 'Missing required parameter !'
                })
            }
            else {
                let data = await db.Clinic.findOne ({
                    where: {
                        id: inputId
                    }, 
                    attributes: ['name', 'address','descriptionHTML' , 'descriptionMarkdown'],

                })  
                if ( data ){
                    let doctorClinic = [];
                    doctorClinic = await db.Doctor_Infor.findAll ({
                        where : {
                            clinicId : inputId
                        },
                        attributes : [ 'doctorId', 'provinceId']
                    })

                    data.doctorClinic = doctorClinic;
                }else {
                    data = {}
                }
                                        // resolve == return
                                        
                                resolve ({
                                    errCode: 0,
                                    errMessage: 'OK!' ,
                                    data: data
                                })
                                    
             } 
            
        } catch (e) {
            reject(e)
        }
    })
}


module.exports = {
    createClinic: createClinic,
    getAllClinic: getAllClinic,
    getDetailClinicById: getDetailClinicById,

}