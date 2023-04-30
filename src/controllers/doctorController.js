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

module.exports = {
    getTopDoctorHome : getTopDoctorHome
}