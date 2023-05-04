require ('dotenv').config(); 
import nodemailer from 'nodemailer';

let sendSimpleEmail = async ( dataSend ) => { 
 

      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_APP, // generated ethereal user
          pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
      });
    
      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: '"Fred Foo 👻" <19130075@st.hcmuaf.edu>', // sender address
        to: dataSend.reciverEmail , // list of receivers
        subject: "Thông tin đặt lịch khám bệnh", // Subject line
        text: "Hello world?", // plain text body
        html:  `
        <h3>Xin Chào ${dataSend.patientName}!</h3>
        <p>Bạn nhận được email này vì bạn đã đặt lịch khám bệnh online trên ScheduleMedicalExamination</p>
        <p>Thông tin đặt lịch khám bệnh: </p>
        <div>
            <b>Thời gian: ${dataSend.time}</b>
        </div>
        <div>
             <b>Bác sĩ: ${dataSend.doctorName}</b>
        </div>
  
        <p>
        Nếu các thông tin trên là đúng sự thật, vui lòng Click vào đường link 
        để xác nhận và hoàn tất thủ tục đặt lịch khám bệnh.
        </p>
        <div>
        <a href=${dataSend.redirectLink} target ="_blank" >Click here</a>
        </div>
        
        <div>Xin chân thành cảm ơn !</div>
        `
      });
      
}

//  Language
let getBodyHTMLEmail = ( dataSend ) => {
  let result = '';
  if ( dataSend.language === 'vi'){
      result = `
      <h3>Xin Chào ${dataSend.patientName}!</h3>
      <p>Bạn nhận được email này vì bạn đã đặt lịch khám bệnh online trên ScheduleMedicalExamination</p>
      <p>Thông tin đặt lịch khám bệnh: </p>
      <div>
          <b>Thời gian: ${dataSend.time}</b>
      </div>
      <div>
           <b>Bác sĩ: ${dataSend.doctorName}</b>
      </div>

      <p>
      Nếu các thông tin trên là đúng sự thật, vui lòng Click vào đường link 
      để xác nhận và hoàn tất thủ tục đặt lịch khám bệnh.
      </p>
      <div>
      <a href=${dataSend.redirectLink} target ="_blank" >Click here</a>
      </div>
      
      <div>Xin chân thành cảm ơn !</div>
      `;

  }
  if ( dataSend.language === 'en'){

      result = `
       <h3>Hello ${dataSend.patientName}!</h3>
       <p>You received this email because you booked an online appointment on ScheduleMedicalExamination</p>
       <p>Medical appointment booking information: </p>
       <div>
           <b>Time: ${dataSend.time}</b>
       </div>
       <div>
            <b>Doctor: ${dataSend.doctorName}</b>
       </div>

       <p>
       If the above information is true, please click on the link
       to confirm and complete the procedure to book an appointment.
       </p>
       <div>
       <a href=${dataSend.redirectLink} target ="_blank" >Click here</a>
       </div>
      
       <div>Thank you very much!</div>
       `;
  }
  return result;
}



module.exports = {
    sendSimpleEmail: sendSimpleEmail
}