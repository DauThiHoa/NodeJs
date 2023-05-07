// CHAY FILE DAU TIEN CUA DU AN 
import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import doctorController from "../controllers/doctorController";
import patientController from "../controllers/patientController";
import spcialtyController from "../controllers/spcialtyController";
import clinicController from "../controllers/clinicController";

let router = express.Router();

let initWebRoutes = (app) => {
    // TAO UNG DUNG DAU TIEN 
    router.get('/', homeController.getHomePage);
     // vd => chuyen trang about
     router.get('/about', homeController.getAboutPage); 
     // LAY DU LIEU TU DATABASE
     router.get('/crud', homeController.getCRUD); 
    // LAY DU LIEU TU DATABASE
    router.post('/post-crud', homeController.postCRUD); 
    // LAY DU LIEU TU DATABASE
    router.get('/get-crud', homeController.displayGetCRUD); 
    // SUA DU LIEU CUA DOI TUONG
    router.get('/edit-crud', homeController.getEditCRUD); 
    // SUA DU LIEU CUA DOI TUONG
    router.post('/put-crud', homeController.putCRUD); 
    // SUA DU LIEU CUA DOI TUONG
    router.get('/delete-crud', homeController.deleteCRUD);


    // SUA DU LIEU CUA DOI TUONG
    router.post('/api/login', userController.handleLogin); 
    //Tao API LAY TAT CA DU LIEU
    router.get('/api/get-all-users',userController.handleGetAllUsers); 
    router.post('/api/create-new-user', userController.handleCreateNewUser);
    router.put('/api/edit-user', userController.handleEditUser);
    router.delete('/api/delete-user', userController.handleDeleteUser);//restAPI 
    router.get('/api/allcode',userController.getAllCode);


    // LINK LAY RA CAC BAC SI HANG DAU ( TRANG CHU )
    router.get('/api/top-doctor-home',doctorController.getTopDoctorHome);  
    router.get('/api/get-all-doctors',doctorController.getAllDoctors);
    // LUU THONG TIN BAC SI TU FROM SELECT 
    router.post('/api/save-infor-doctors',doctorController.postInforDoctor);
    // LAY THONG TIN BAC SI THEO MA ID 
    router.get('/api/get-detail-doctor-by-id',doctorController.getDetailDoctorById);
     // Luu thong tin dat lich kham
    router.post('/api/bulk-create-schedule',doctorController.bulkCreateSchedule);
    // LAY THONG TIN BAC SI THEO MA ID 
    router.get('/api/get-schedule-doctor-by-date',doctorController.getScheduleByDate);
    // LAY THEM THONG TIN BAC SI THEO MA ID 
    router.get('/api/get-extra-infor-doctor-by-id',doctorController.getExtraInforDoctorById);
    // LAY THEM THONG TIN BAC SI THEO MA ID 
    router.get('/api/get-profile-doctor-by-id',doctorController.getProfileDoctorById);

    router.get('/api/get-list-patient-for-doctor',doctorController.getListPatientForDoctor);

    // Gui hoa don
    router.post('/api/send-remedy',doctorController.sendRemedy);


      // patientController
      // Luu thong tin benh nhan dat lich kham
      router.post('/api/patient-book-appointment',patientController.postBookAppointment);
      // Xac nhan khi dat lich kham thanh cong
      router.post('/api/verify-book-appointment',patientController.postVerifyBookAppointment);
   
      
      // Luu thong tin Chuyen khoa
       router.post('/api/create-new-specialty',spcialtyController.createSpecialty);
      router.get('/api/get-all-specialty',spcialtyController.getAllSpecialty);
     //  Lay thong tin chi tiet chuyen khoa
      router.get('/api/get-detail-specialty-by-id',spcialtyController.getDetailSpecialtyById);


    // Luu thong tin Chuyen khoa
    router.post('/api/create-new-clinic',clinicController.createClinic);
    router.get('/api/get-all-clinic', clinicController.getAllClinic);
    //    //  Lay thong tin chi tiet chuyen khoa
    router.get('/api/get-detail-clinic-by-id', clinicController.getDetailClinicById);

      router.get('/hello', (req, res) => {
       return res.send('HELLO WORD  ');
})

    return app.use ("/", router);
}

module.exports = initWebRoutes;