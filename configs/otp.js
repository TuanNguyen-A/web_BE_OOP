module.exports = {
  OTP_LENGTH: 10,
  OTP_CONFIG: {
    upperCaseAlphabets: true,
    specialChars: false,
  },
  MAIL_SETTINGS: {
    service: 'gmail',
    auth: {
      user: process.env.MAIL_EMAIL,
      pass: process.env.MAIL_PASSWORD,
    },
  }
}