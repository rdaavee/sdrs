import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    host: 'live.smtp.mailtrap.io',
    port: 587,
    secure: false,
    auth: {
        user: '1a2b3c4d5e6f7g',
        pass: '1a2b3c4d5e6f7g',
    }
});

export const sendEmail = (receiver: string, code: string) => {

    const mailOptions = {
        from: 'yourusername@email.com',
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