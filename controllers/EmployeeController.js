import Leav from "../models/LeavModel.js"


export const applyLeav = async (req, res) => {
  const { email, name, reason } = req.body;
  const userid = req.user._id;
  console.log(email, name, reason);

  try {
    if (!email || !name || !reason) {
      return res.status(400).json({
        error: "Please fill in all fields",
      });
    }

    if (!userid) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const leav = await Leav.create({
      email,
      name,
      reason,
      status: "none",
      user_id: userid,
    });
    return res.status(200).json({ leav });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
export const ManageLeav = async (req, res) => {
  const { status } = req.body;
  const {id} = rep.pararms
  console.log(status);

  try {
    if (!status ) {
      return res.status(400).json({
        error: "Please fill in all fields",
      });
    }

    const employee = await Leav.findByIdAndUpdate({id},{...req.body})

    
    return res.status(200).json({ employee });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getLeaveRequest = async(req,res)=>{
    const leaves = await Leav.find()

    res.status(200).json(leaves)

}
export const LeaveStatus = async (req, res) => {
    const {id,status} = req.body
  
    try {
        // Find the attendance record for the current user
        let EmployeeLeave = await Leav.findOne({_id:id });
        
  
        if (!EmployeeLeave) {
            return res.status(404).json({ error: "Leave record not found" });
        }
        // Update the status
        EmployeeLeave.leav_status=status
        // Save the changes
        await EmployeeLeave.save();
  
        return res.status(200).json({ message: "status updated successful", employee: EmployeeLeave });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
  };

  

  export default {
  applyLeav,
  getLeaveRequest,
  LeaveStatus,
  
};
