import Attendance from "../models/AttendenceModel.js"
import mongoose from "mongoose"


export const markAttendance = async (req, res) => {
  const { email,status,name } = req.body;
  const userid = req.user._id;
  console.log(email,status,name);

  try {
    if (!email || !status || !name) {
      return res
        .status(400)
        .json({
          error: "Please fill in all fields",
          
        });
    }

    // Ensure that only authenticated users can mark attendance
    if (!userid) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Check email already exists
    let existingAttendance = await Attendance.findOne({
      email,
      user_id: userid,
    });

    if (existingAttendance) {
      // If an attendance record already exists, update it by pushing new entry to the attendance array
      existingAttendance.attendance.push({ status, checkindate: new Date() });
      await existingAttendance.save();
      return res.status(200).json({ attendance: existingAttendance });
    } else {
      // If no attendance record exists, create a new one
      const newAttendance = await Attendance.create({
        email,
        name,
        user_id: userid,
        attendance: [{ status, checkindate: new Date() }],
      });
      return res.status(200).json({ attendance: newAttendance });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// checkout 

export const checkout = async (req, res) => {
  const userid = req.user._id;

  try {
      // Find the attendance record for the current user
      let userAttendance = await Attendance.findOne({ user_id: userid });
      console.log(userAttendance);

      if (!userAttendance) {
          return res.status(404).json({ error: "Attendance record not found" });
      }

      // Find the attendance entry for today
      const todayAttendance = userAttendance.attendance.find(entry => {
          // Check if the checkindate is today
          const today = new Date();
          const entryDate = new Date(entry.checkindate);
          console.log(today,entryDate);
          return entryDate.toDateString() === today.toDateString();
      });

      console.log(todayAttendance);

      if (!todayAttendance) {
          return res.status(404).json({ error: "Today's attendance not found" });
      }

      // Update the checkout date
      todayAttendance.checkoutdate = new Date();

      // Save the changes
      await userAttendance.save();

      return res.status(200).json({ message: "Checkout successful", attendance: userAttendance });
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
};

//get 
export const getAttendance = async (req, res) => {
    const userId = req.user._id;
    console.log(userId);
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(404).json({ error: 'Invalid user ID' });
    }

    try {
        const attendance = await Attendance.find({ user_id: userId });

        if (!attendance || attendance.length === 0) {
            return res.status(404).json({ error: 'Attendance not found for this user' });
        }

        res.status(200).json( attendance );
    } catch (error) {
        console.log('Error retrieving attendance:', error);
        res.status(500).json({ error: 'Internal server error',error });
    }
};
export const getAllAttendance = async (req, res) => {
    const userId = res.body

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(404).json({ error: 'Invalid user ID' });
    }

    try {
        const attendance = await Attendance.find({ user_id: userId });

        if (!attendance || attendance.length === 0) {
            return res.status(404).json({ error: 'Attendance not found for this user' });
        }

        res.status(200).json( attendance );
    } catch (error) {
        console.error('Error retrieving attendance:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
//get attendance for manager
export const getAttendances = async (req, res) => {
    
    try {
        const attendances = await Attendance.find()

        if (!attendances || attendances.length === 0) {
            return res.status(404).json({ error: 'Attendance not found ' });
        }

        res.status(200).json( attendances );
    } catch (error) {
        console.error('Error retrieving attendance:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};




export default {
  markAttendance,
  getAttendance,
  checkout,
  getAttendances,
  getAllAttendance

};
