import clinicService from '../services/clinicService';

let createClinic =async (req, res) => {
    try { 
        let infor = await clinicService.createClinic(req.body);
        return res.status (200).json (
            infor
        )

    } catch (e) {
        console.log (e)
        return res.status(200).json ({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}

//  Lay toan bo ban ghi chuyen khoa
let getAllClinic = async (req , res) => {

    try {
        // TAO HAM LAY TAT CA CAC BAC SI TRONG DATABASE
        let infor = await clinicService.getAllClinic (); 
        return res.status(200).json (infor) 

    } catch (e) {
        console.log (e)
        return res.status(200).json ({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}

//  Lay toan bo ban ghi chuyen khoa
let getDetailClinicById = async (req , res) => {

    try {
        // TAO HAM LAY TAT CA CAC BAC SI TRONG DATABASE
        let infor = await clinicService.getDetailClinicById (req.query.id); 
        return res.status(200).json (infor) 

    } catch (e) {
        console.log (e)
        return res.status(200).json ({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}

module.exports = {
    createClinic: createClinic,
    getAllClinic: getAllClinic,
    getDetailClinicById:getDetailClinicById,

}