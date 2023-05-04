const db = require("../models")

let createSpecialty = (data) => {
 //  DUNG PROMISE => 100% SE TRA VE DU LIEU
 return new Promise (async (resolve, reject) => {
    try { 

        console.log ()
        if ( !data.name || !data.imageBase64 ||
            !data.descriptionHTML || !data.descriptionMarkdown ) {
            resolve ({
                errCode: 1,
                errMessage: 'Missing required parameter !'
            })
        }else {
        
            await db.Specialty.create ({
                name: data.name,
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

//  getAllSpecialty
let getAllSpecialty = () => {
    //  DUNG PROMISE => 100% SE TRA VE DU LIEU
    return new Promise (async (resolve, reject) => {
        try {
            //  LAY TAT CA CAC BAC SI TRONG DATABASE
            let data = await db.Specialty.findAll ({
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

module.exports = {
    createSpecialty: createSpecialty,
    getAllSpecialty: getAllSpecialty,

}