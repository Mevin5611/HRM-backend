import express from 'express'
import requireAuth from '../middleware/requireAuth.js'

import { loginUser, resetPassword, sendOtp, signUpEmployee, updateProfile, updateUserInfo } from '../controllers/userControllers.js'


const userRouter = express.Router()



userRouter.post('/login',loginUser)
userRouter.post('/signup-employee',signUpEmployee)

userRouter.put('/updateProfile',requireAuth,updateProfile)
userRouter.put('/updateUserInfo',requireAuth,updateUserInfo)
userRouter.post('/sendotp',requireAuth,sendOtp)
userRouter.post('/changePassword',requireAuth,resetPassword)


export default userRouter