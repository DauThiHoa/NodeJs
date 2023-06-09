import specialtyService from '../services/specialtyService';

let createSpecialty =async (req, res) => {
    try { 
        let infor = await specialtyService.createSpecialty(req.body);
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
let getAllSpecialty = async (req , res) => {

    try {
        // TAO HAM LAY TAT CA CAC BAC SI TRONG DATABASE
        let infor = await specialtyService.getAllSpecialty (); 
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
let getDetailSpecialtyById = async (req , res) => {

    try {
        // TAO HAM LAY TAT CA CAC BAC SI TRONG DATABASE
        let infor = await specialtyService.getDetailSpecialtyById (req.query.id,req.query.location); 
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
    createSpecialty: createSpecialty,
    getAllSpecialty: getAllSpecialty,
    getDetailSpecialtyById:getDetailSpecialtyById,

}