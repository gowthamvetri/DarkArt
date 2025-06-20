import nodeMailer from 'nodemailer';



const transporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: 'gowthamvetriii@gmail.com', // generated ethereal user
        pass: 'clgvunjakhvwshbc', // generated ethereal password
    },
});

const sendEmail = ({sendTo,subject,html})=>{
    try {
        transporter.sendMail({
            from: 'Casual Clothing <gowthamvetriii@gmail.com>',
            to: sendTo,
            subject: subject,
            html: html,
        });
    } catch (error) {
        console.error("Error sending email:", error);
        return;
        
    }
  
}

export default sendEmail;