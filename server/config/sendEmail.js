import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
        user: 'gowthamvetriii@gmail.com',
        pass: "koiutcczkhhnteaz",
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
    console.log("Email sent successfully");
    return;
}

export default sendEmail;