import express from "express"

import requireAuth from '../middleware/requireAuth.js'
import { markAttendance, getAttendance, checkout, getAttendances, getAllAttendance } from "../controllers/AttendenceController.js"
import { getEmploye, addPerformance } from "../controllers/ManagerController.js"
import { applyLeav, getLeaveRequest, LeaveStatus } from "../controllers/EmployeeController.js"
import {  paySalary }from "../controllers/AdminController.js"
import { updateUserRole } from "../controllers/userControllers.js"
import authorizedRole from "../middleware/authorizedRole.js"

const hrsRouter = express.Router()

// require auth for all routes

hrsRouter.use(requireAuth)

// GET 

hrsRouter.get('/getEmploye',getEmploye)
hrsRouter.get('/getLeaveRequest',getLeaveRequest)
hrsRouter.get('/getAttendance',getAttendance)
hrsRouter.get('/getAttendances',getAttendances)
hrsRouter.get('/getAllAttendance',getAllAttendance)

// POST
hrsRouter.post('/',markAttendance)
hrsRouter.post('/checkout',checkout)
hrsRouter.post('/paySalary',paySalary)
hrsRouter.post('/addPerfomance',addPerformance)
hrsRouter.post('/applyLeav',applyLeav)
hrsRouter.post('/LeaveStatus',LeaveStatus)
// PUT 
hrsRouter.put('/updateUserRole/:id',authorizedRole('Admin'),updateUserRole)


export default hrsRouter