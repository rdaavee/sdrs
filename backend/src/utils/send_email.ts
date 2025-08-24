import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendEmail = (receiver: string, code: string) => {

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: receiver,
        subject: '#TODO: create subject and text',
        text: `#TODO: create subject and text ${code}`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log('Error:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}