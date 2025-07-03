import bcrypt from "bcryptjs";
import transporter from "../configs/nodemailer.js";
import userModel from "../models/User.js";
import jwt from 'jsonwebtoken';
import { upsertStreamUser } from "../configs/stream.js";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  //check if all details are entered
  if (!fullName || !email || !password) return res.status(400).json({ success: false, message: 'Missing Details' });

  //check if user exists already
  const ExistingUser = await userModel.findOne({ email });
  if (ExistingUser) return res.status(400).json({ success: false, message: 'User Already exists, please login!' });

  try {

    //const generate a random avatar as a initial profile pic.
    const idx = Math.floor(1 + Math.random() * 100);
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    //create a new document in database
    const user = new userModel({ fullName, email, password, profilePic: randomAvatar });

    //create a OTP for email verification
    const otp = (Math.floor(100000 + Math.random() * 900000)).toString();
    user.verifyOTP = otp;
    user.verifyOTPExpireAt = Date.now() + 10 * 60 * 1000;
    user.save();

    //send mail to a created user for entering seeing the OTP
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email.toLowerCase(),
      subject: 'Verify Your Email',
      html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>Account Verification</title>
      <style>
        body { font-family: 'Segoe UI', sans-serif; background: #f9f9f9; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 10px; padding: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        h2 { color: #2d3436; text-align: center; }
        p { font-size: 16px; color: #555; text-align: center; }
        .otp-box { margin: 20px auto; font-size: 32px; font-weight: bold; letter-spacing: 12px; color: #0984e3; background: #eaf4ff; padding: 15px 30px; border-radius: 8px; width: fit-content; }
        .footer { font-size: 13px; color: #999; text-align: center; margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Verify Your Account</h2>
        <p>Use the OTP below to complete your email verification:</p>
        <div class="otp-box">${otp}</div>
        <p>This OTP is valid for 10 minutes.</p>
        <div class="footer">
          If you did not request this, please ignore this email.<br/>
          &copy; 2025 Your App Name
        </div>
      </div>
    </body>
    </html>
  `
    };

    await transporter.sendMail(mailOptions);

    try {
      await upsertStreamUser({
        id: user._id,
        name: user.fullName,
        image: user.profilePic || ''
      })
      console.log("Stream user created: ", user.fullName)
    } catch (error) {
      console.log("Error creating the Stream user: ", error)
    }


    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({ success: true, message: "OTP send to you Email address" });

  } catch (error) {
    console.log("Error during registration: ", error)
    return res.status(500).json({ success: false, message: error.message });
  }

}

//controller function to check the OTP and register
export const verifyAccount = async (req, res) => {
  const userID = req.user._id;
  const { otp } = req.body;

  if (!userID || !otp) return res.status(400).json({ success: false, message: " Missing details" })

  try {
    const user = await userModel.findById(userID)

    if (!user) return res.status(400).json({ success: false, message: "Unauthorized, Register again" });

    if (user.verifyOTP === '' || user.verifyOTP !== otp) return res.status(400).json({ success: false, message: "Invalid OTP" })

    if (user.verifyOTPExpireAt < Date.now()) return res.status(400).json({ success: false, message: "OTP Expired" })

    user.isAccountVerified = true;
    user.verifyOTP = '';
    user.verifyOTPExpireAt = 0;
    user.save();

    return res.status(200).json({ success: true, user, message: "Account registration successfull" })

  } catch (error) {
    console.log("Error verifiying OTP: ", error)
    return res.status(500).json({ success: false, message: error.message })
  }

}


export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ success: false, message: "Missing details" });

  try {

    // ❗ Security Note:
    // Using a generic error message for both email and password validation 
    // prevents exposing whether a specific email exists in the system. Gives clues 
    // to hackers about which emails exist in your system. Can lead to account discovery attacks
    // This avoids user enumeration attacks and aligns with OWASP best practices.
    const user = await userModel.findOne({ email });
    if (!user) return res.status(401).json({ success: false, message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Invalid email or password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({ success: true, user, message: "Login Successfull" });


  } catch (error) {
    console.log("Error verifiying OTP: ", error)
    return res.status(500).json({ success: false, message: error.message })
  }

}

export const logout = (req, res) => {
  try {

    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
    });

    return res.status(200).json({ success: true, message: "Logged out" });

  } catch (error) {
    console.log("Error during registration: ", error)
    return res.status(500).json({ success: false, message: error.message });
  }
}

export const onboarding = async(req, res) => {
  const userID = req.user._id;
  const {fullName, bio, nativeLanguage, learningLanguage, location} = req.body;

  if(!fullName || !bio || !nativeLanguage || !learningLanguage || !location) return res.status(400).json({ 
    success: false, message: "Missing details", 
    missingDetails: [
      !fullName && 'Full name',
      !bio && 'Bio',
      !nativeLanguage && 'Native language'  ,
      !learningLanguage && 'Learning langauge' ,
      !location && 'Locations'
    ].filter(Boolean)
  });

  try {

    // const user = await userModel.findByIdAndUpdate(userID, {fullName, bio, nativeLanguage, learningLanguage, location});
    
    //In Mongoose, by default, findByIdAndUpdate returns the old (pre-update) document, not the updated one. so using new will returns updated data
    const user = await userModel.findByIdAndUpdate(userID, {...req.body, isOnboarded: true}, {new: true});

    if(!user) return res.status(401).json({ success: false, message: "User not found Please signup" });

     try {
      await upsertStreamUser({
        id: user._id,
        name: user.fullName,
        image: user.profilePic || ''
      })
      console.log("Stream user updated after onboarding: ", user.fullName)
    } catch (error) {
      console.log("Error updating the Stream user: ", error)
    }
    
    return res.status(200).json({ success: true, message: "onboarding sucessfull" });
    
  } catch (error) {
    console.log("Error setting up onbaording data: ", error)
    return res.status(500).json({ success: false, message: error.message })
  }

}