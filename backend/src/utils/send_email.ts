import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = (receiver: string, code: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: receiver,
    subject: "Email Verification Code",
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
    `,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("Error:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};
export const sendEmailRequestReceipt = (
  receiver: string,
  reference_number: string,
  tracking_code: string
) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: receiver,
    subject: "Request Receipt & Tracking Information",
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

        <table style="margin-top: 20px; border-collapse: collapse; width: 100%; max-width: 500px; border: 1px solid #ccc; border-radius: 6px; overflow: hidden; background: #f9f9f9;">
            <tr>
                <td style="padding: 12px; border-bottom: 1px solid #ccc; font-weight: bold;">Reference Number</td>
                <td style="padding: 14px; font-size: 18px; font-weight: bold; color: #04882a;">${reference_number}</td>
            </tr>
            <tr>
                <td style="padding: 12px; font-weight: bold;">Tracking Code</td>
                <td style="padding: 14px; font-size: 18px; font-weight: bold; color: #04882a;">${tracking_code}</td>
            </tr>
        </table>

        <p>Please keep these details safe, as you will need them to check the status of your request.</p>
        <p>If you did not make this request, you can safely ignore this message.</p>
        <p>Best regards,<br/>The SDRS Team</p>
    </div>
    `,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("Error:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

export const sendStatusUpdateEmail = (
  receiver: string,
  reference_number: string,
  status: string
) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: receiver,
    subject: `Update on your request: ${reference_number}`,
    text: `Hello,
    Your request with Reference Number ${reference_number} has been updated.  
      
    Current Status: ${status.toUpperCase()}
      
    You can log in or use your tracking code to view more details.  
      
    Best regards,  
    The SDRS Team`,

    html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <p>Hello,</p>
      <p>Your request with the following details has been updated:</p>

      <table style="margin-top: 20px; border-collapse: collapse; width: 100%; max-width: 500px; border: 1px solid #ccc; border-radius: 6px; overflow: hidden; background: #f9f9f9;">
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #ccc; font-weight: bold;">Reference Number</td>
          <td style="padding: 14px; font-size: 18px; font-weight: bold; color: #04882a;">${reference_number}</td>
        </tr>
        <tr>
          <td style="padding: 12px; font-weight: bold;">New Status</td>
          <td style="padding: 14px; font-size: 18px; font-weight: bold; color: #04882a;">${status}</td>
        </tr>
      </table>

      <p>Visit SDRS website and use your tracking code to view more details.</p>
      <p>Best regards,<br/>The SDRS Team</p>
    </div>
    `,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("Error sending status update email:", error);
    } else {
      console.log("Status update email sent:", info.response);
    }
  });
};
