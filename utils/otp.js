const otpGenerator = require('otp-generator');
const otpConfig = require('../configs/otp');
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport(otpConfig.MAIL_SETTINGS);

module.exports.generateOTP = () => {
    const OTP = otpGenerator.generate(otpConfig.OTP_LENGTH, otpConfig.OTP_CONFIG);
    return OTP;
};

module.exports.sendMailOTP = async (params) => {
    try {
        let info = await transporter.sendMail({
            from: otpConfig.MAIL_SETTINGS.auth.user,
            to: params.to,
            subject: 'Xác nhận thành viên mới',
            html: `
        <div
          class="container"
          style="max-width: 90%; margin: auto; padding-top: 20px"
        >
          <h2>Welcome to the club.</h2>
          <h4>You are officially In ✔</h4>
          <p style="margin-bottom: 30px;">Đây là mã OTP xác nhận tài khoản của bạn</p>
          <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${params.OTP}</h1>
     </div>
      `,
        });
        return info;
    } catch (error) {
        console.log(error);
        return false;
    }
};

module.exports.sendMailForgotPassword = async (params) => {
    try {
        let info = await transporter.sendMail({
            from: otpConfig.MAIL_SETTINGS.auth.user,
            to: params.to,
            subject: 'Xác nhận đổi mật khẩu',
            html: `
        <div
          class="container"
          style="max-width: 90%; margin: auto; padding-top: 20px"
        >
          <h2>Welcome to the club.</h2>
          <h4>You are officially In ✔</h4>
          <p style="margin-bottom: 30px;">Có phải bạn vừa yêu cầu đổi lại mật khẩu? Nếu không, hãy bỏ qua mail này</p>
          <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${params.OTP}</h1>
     </div>
      `,
        });
        return info;
    } catch (error) {
        console.log(error);
        return false;
    }
};

module.exports.sendMailNewPassword = async (params) => {
    try {
        let info = await transporter.sendMail({
            from: otpConfig.MAIL_SETTINGS.auth.user,
            to: params.to,
            subject: 'Mật khẩu mới',
            html: `
        <div
          class="container"
          style="max-width: 90%; margin: auto; padding-top: 20px"
        >
          <h2>Welcome to the club.</h2>
          <h4>You are officially In ✔</h4>
          <p style="margin-bottom: 30px;">Đây là mật khẩu mới của bạn.</p>
          <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${params.password}</h1>
     </div>
      `,
        });
        return info;
    } catch (error) {
        console.log(error);
        return false;
    }
};