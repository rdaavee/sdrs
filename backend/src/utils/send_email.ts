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
        subject: 'Email Verification Code',
        text: `Hello,

        We received a request to verify this email address for your request submission.  

        Your 6-digit verification code is: ${code}

        Please enter this code in the application to confirm your email. Once verified, your reference number and tracking code will be sent to this email address.

        If you did not request this, you can safely ignore this message.

        Best regards,  
        The SDRS Team`,
        html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <p>Hello,</p>
            <p>We received a request to verify this email address for your request submission.</p>
            <p style="font-size: 18px; font-weight: bold; color: #04882a;">
                Your 6-digit verification code is: <span>${code}</span>
            </p>
            <p>Please enter this code in the application to confirm your email. Once verified, your reference number and tracking code will be sent to this address.</p>
            <p>If you did not request this, you can safely ignore this message.</p>
            <p>Best regards,<br/>The SDRS Team</p>
        </div>
    `
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log('Error:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}
export const sendEmailRequestReceipt = (receiver: string, reference_number: string, tracking_code: string) => {

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: receiver,
        subject: 'Request Receipt & Tracking Information',
        text: `Hello,

        We received your request submission. Below are your identifiers for tracking:

        Reference Number: ${reference_number}
        Tracking Code: ${tracking_code}

        Please keep these details safe, as you will need them to check the status of your request.

        If you did not make this request, you can safely ignore this message.

        Best regards,  
        The SDRS Team`,

        html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <p>Hello,</p>
            <p>We received your request submission. Below are your identifiers for tracking:</p>
            <div style="margin-top: 20px; padding: 12px; border: 1px solid #ccc; border-radius: 6px; background: #f9f9f9;">
                <p><strong>Reference Number:</strong> ${reference_number}</p>
                <p><strong>Tracking Code:</strong> ${tracking_code}</p>
            </div>
            <p>Please keep these details safe, as you will need them to check the status of your request.</p>
            <p>If you did not make this request, you can safely ignore this message.</p>
            <p>Best regards,<br/>The SDRS Team</p>
        </div>
    `
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log('Error:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}