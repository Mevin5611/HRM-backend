import User from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import cloudinary from 'cloudinary'
import { redis } from '../utils/redis.js'
import sendMail from '../utils/sendMail.js'
import bcrypt from 'bcrypt'



export const createToken = (_id)=>{
    return jwt.sign({_id}, process.env.SECRET,{expiresIn :'3d'})
}

//login user
export const loginUser =async(req,res) =>{
    const {email,password}=req.body
    console.log(req.body);
    try {
        const user = await User.login(email,password)

        //create token 
        const token = createToken(user._id)

        res.status(200).json({email,token,user})
    } catch (error) {
        res.status(400).json({error:error.message})
    }

    
}

//sigmup user
export const signUpUser =async(req,res) =>{
    const {email,password}=req.body
    try {
        const user = await User.signup(email,password)

        //create token 
        const token = createToken(user._id)

        res.status(200).json({email,token,user})
    } catch (error) {
        res.status(400).json({error:error.message})
    }
    
}
export const signUpEmployee =async(req,res) =>{
    const {email,password,name,mob,jobrole,address}=req.body
   
    try {
        const user = await User.signup(email,password,name,mob,jobrole,address)

        //create token 
        const token = createToken(user._id)

        res.status(200).json({email,token,user})
    } catch (error) {
        res.status(400).json({error:error.message})
    }
    
}

export const updateUserRole =async(req,res) =>{
    const {role}=req.body
    const {id:_id} = req.params
    try {
        const user = await User.findById({_id})
        if(!user){
            res.status(400).json({error:"User not found"})
        }
        if(user){
            user.role = role
            await user.save()
        }

        res.status(200).json(user)
    } catch (error) {
        res.status(400).json({error:error.message})
    }
    
}

export const updateProfile = async(req,res)=>{
    
    const {profileImage} = req.body
    const userId = req.user._id

    if(!userId){
        res.status(400).json({error:"invalid user id"})
    }

    const user = await User.findById(userId)

    if(!user){
        res.status(400).json({error:"User not found"})
    }

    if(profileImage){
        if(user.profileImage.public_id){
            await cloudinary.v2.uploader.destroy(user.profileImage.public_id);
        }

        const uploadedResponse = await cloudinary.v2.uploader.upload(profileImage, {
            folder: "profileImage",
            width: 150,
        })
        user.profileImage = {
            public_id: uploadedResponse.public_id,
            url: uploadedResponse.secure_url,
          };
    }
    await user.save();

    res.status(200).json(user)

}
export const updateUserInfo = async(req,res)=>{
    
    const {jobrole,mob} = req.body
    const userId = req.user._id

    if(!userId){
        res.status(400).json({error:"invalid user id"})
    }

    const user = await User.findById(userId)

    if(!user){
        res.status(400).json({error:"User not found"})
    }

    if(jobrole ){
        user.jobrole = jobrole
    }
    if(mob ){
        user.mob = mob
    }
    await user.save();
    

    res.status(200).json(user)

}


export const sendOtp = 
    async (req, res, next) => {
        const userId = req.user._id
        const user = await User.findById(userId)

      if (!user) {
        return res.status(400).json({ message: "There is no account registered with this email!" });
      }
  
      // Delete any previous OTP associated with this user's ID
      const previousOtp = await redis.get(`user:${user._id}:otp`);
      if (previousOtp) {
        await redis.del(`otp:${previousOtp}`);
      }
  
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const data = { otp, name: user.name };
  
      // Store OTP and user ID in Redis with 5-minute expiration
      await redis.set(`otp:${otp}`, user._id.toString(), 'EX', 300); // 300 seconds = 5 minutes
      await redis.set(`user:${user._id}:otp`, otp, 'EX', 300); // 300 seconds = 5 minutes
  
      try {
        await sendMail({
          email: user.email,
          subject: "Password Recovery Mail",
          template: "forgott-psw-mail.ejs",
          data,
        });
  
        res.status(200).json({
          success: true,
          message: `Please check your email ${user.email} to retrieve your OTP!`,
        });
      } catch (error) {
        console.log(error);
      }
    }
  ;
  
  export const resetPassword = 
    async (req, res, next) => {
      const { otp, newPassword, confirmPassword } = req.body;
  
      // Retrieve the user ID stored against the OTP
      const userId = await redis.get(`otp:${otp}`);
  
      if (!userId) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }
  
      // Ensure the OTP is the latest one sent to the user
      const latestOtp = await redis.get(`user:${userId}:otp`);
      if (otp !== latestOtp) {
        return res.status(400).json({ message: "This OTP is no longer valid" });
      }
  
      if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
      }
  
      const user = await User.findById(userId);
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
  
      try {
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(newPassword, salt);
  
        user.password = hash;
        await user.save();
  
        // Clear the OTP after successful password reset
        await redis.del(`otp:${otp}`);
        await redis.del(`user:${userId}:otp`);
  
        res.status(200).json({ message: "Password successfully updated" });
      } catch (error) {
        console.log(error)
      }
    }
  







export default {loginUser,signUpUser,signUpEmployee,updateUserRole,updateProfile,updateUserInfo,sendOtp,resetPassword}