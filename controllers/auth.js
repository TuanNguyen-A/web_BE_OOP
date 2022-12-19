const User = require("../models/User");
const { JWT_SECRET } = require('../configs')
const JWT = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { generateOTP, sendMailOTP, sendMailForgotPassword, sendMailNewPassword } = require('../utils/otp')
var password_generator = require('generate-password');

const password_regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$&+,:;=?@#%|{}<>.^*()%!-])[0-9a-zA-Z$&+,:;=?@#%|{}<>.^*()%!-]{8,}$/

const encodedToken = (userID) => {
    return JWT.sign({
        iss: 'Tuan Anh My Phuong',
        sub: userID,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 3)
    }, JWT_SECRET)
}

//[POST] /auth/signUp
const signUp = async (req, res, next) => {
    const { fullName, email, phoneNumber, password, address, role } = req.body

    // Check if there is a user with the same user
    const foundUser = await User.findOne({ email })

    if (foundUser) return res.status(403).json({ message: 'Email is already in use.' })


    validate_password = password_regex.test(password)
    if (!validate_password) {
        return res.status(400).json({ message: 'Password is invalid.' })
    }

    console.log("Validate success")

    const otp = generateOTP();

    try {
        await sendMailOTP({
            to: email,
            OTP: otp,
        });
    } catch (error) {
        return res.status(400).json({ message: "Unable to sign up, Please try again later" });
    }

    const newUser = new User({ fullName, email, phoneNumber, password, address, role, otp })
    await newUser.save()

    return res.status(200).json({ success: true })
}

const verifyEmail = async (req, res) => {
    const { email, otp } = req.body;
    const user = await User.findOne({
        email,
    });
    if (!user) {
        return res.status(404).json({ message: 'User is not found' });
    }
    if (user && user.otp !== otp) {
        return res.status(400).json({ message: 'OTP invalid' });
    }
    const updatedUser = await User.findByIdAndUpdate(user._id, {
        $set: { active: true, otp: "" },
    });
    return res.status(200).json({ success: true })
};

//[POST] /auth/signIn
const signIn = async (req, res, next) => {
    // Assign a token
    if (!req.user.active) {
        return res.status(400).json({ message: "Login failed" })
    }
    const token = encodedToken(req.user._id)

    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Authorization', token)
    return res.status(200).json({ success: true })
};

const secret = async (req, res, next) => {
    console.log(req.user)
    account = req.user
    return res.status(200).json({ resources: true, account })
};

const forgotPassword = async (req, res, next) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    const otp = generateOTP();

    if (!user) {
        return res.status(404).json({ message: 'User is not found' });
    }

    try {
        await sendMailForgotPassword({
            to: email,
            OTP: otp,
        });
    } catch (error) {
        return res.status(400).json({ message: "Unable to reset password, Please try again later" });
    }

    await User.findByIdAndUpdate(user._id, {
        $set: { otp },
    });

    return res.status(200).json({ success: true })
};

const verifyForgotPassword = async (req, res, next) => {
    const { email, otp } = req.body;
    const user = await User.findOne({
        email,
    });
    if (!user) {
        return res.status(404).json({ message: 'User is not found' });
    }
    if (user && user.otp !== otp) {
        return res.status(400).json({ message: 'OTP invalid' });
    }

    while(true){
        var newPwd = password_generator.generate({
            length: 10,
            numbers: true,
            symbols: true,
            lowercase: true,
            uppercase:  true
        });
    
        if(password_regex.test(newPwd)) break;
    }

    const salt = await bcrypt.genSalt(10)
    const passwordHashed = await bcrypt.hash(newPwd, salt)

    try {
        await sendMailNewPassword({
            to: email,
            password: newPwd,
        });
    } catch (error) {
        return res.status(400).json({ message: "Unable to reset password, Please try again later" });
    }

    const updatedUser = await User.findByIdAndUpdate(user._id, {
        $set: { otp: "", password: passwordHashed },
    });
    return res.status(200).json({ success: true })
};

module.exports = {
    signUp,
    signIn,
    secret,
    verifyEmail,
    forgotPassword,
    verifyForgotPassword
};