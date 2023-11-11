import nodemailer from 'nodemailer';

const sendEmail = async (email:string, subject:string, username:string, link:string, text:string) => {
  console.log(email);
  try {
    const transporter = nodemailer.createTransport({
      port: 587,
      service: 'gmail',
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
        clientId: process.env.OAUTH_CLIENTID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        //refreshToken:process.env.REFRESH_TOKEN,
      },
    });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      html: `Hi ${username},<br/>Please click <a href="${link}">this link</a> ${text}.`,
    });
    return { message: 'email sent successfully' };
  } catch (error) {
    return { message: 'email not sent' };
  }
};
export default sendEmail;
