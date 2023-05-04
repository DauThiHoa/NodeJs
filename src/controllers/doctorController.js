import doctorSevice from "../services/doctorSevice"; 

let getTopDoctorHome = async (req , res) => {
    let limit = req.query.limit;
    if (!limit ) limit = 10 ;
    try {
        let response = await doctorSevice.getTopDoctorHome (+limit); 
        return res.status(200).json(response);

    } catch (e) {
        console.log (e);
        return res.status (200).json ({
            errCode: -1,
            message: 'Error from server...'
        })
    }
}

let getAllDoctors = async (req , res) => {

    try {
        // TAO HAM LAY TAT CA CAC BAC SI TRONG DATABASE
        let doctors = await doctorSevice.getAllDoctors (); 
        return res.status(200).json (doctors) 

    } catch (e) {
        console.log (e)
        return res.status(200).json ({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}

let postInforDoctor = async (req , res) => {
    try {
        // TAO HAM THEM THONG TIN BAC SI
        let response = await doctorSevice.saveDetailInforDoctor (req.body);
        return res.status(200).json (response) 

    } catch (e) {
        console.log (e)
        return res.status(200).json ({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}

let getDetailDoctorById = async ( req, res) => {
    try { 
        let infor = await doctorSevice.getDetailDoctorById (req.query.id);
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

let bulkCreateSchedule = async ( req, res) => {
    try { 
        let infor = await doctorSevice.bulkCreateSchedule(req.body);
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

let getScheduleByDate =   async ( req, res) => {
    try { 
        let infor = await doctorSevice.getScheduleByDate(req.query.doctorId, req.query.date);
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

let getExtraInforDoctorById =   async ( req, res) => {
    try { 
        let infor = await doctorSevice.getExtraInforDoctorById(req.query.doctorId);
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

// getProfileDoctorById
let getProfileDoctorById =   async ( req, res) => {
    try { 
        let infor = await doctorSevice.getProfileDoctorById(req.query.doctorId);
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
module.exports = {
    getTopDoctorHome : getTopDoctorHome,
    getAllDoctors: getAllDoctors,
    postInforDoctor : postInforDoctor,
    getDetailDoctorById: getDetailDoctorById,
    bulkCreateSchedule: bulkCreateSchedule,
    getScheduleByDate: getScheduleByDate,
    getExtraInforDoctorById: getExtraInforDoctorById,
    getProfileDoctorById: getProfileDoctorById,
}