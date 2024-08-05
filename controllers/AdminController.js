import User from '../models/userModel.js'

export const paySalary = async (req, res) => {
    const {id,workdays,date,basic,incentive} = req.body
    try {
        // Find the attendance record for the current user
        let userSalary = await User.findOne({ _id:id });
        console.log(userSalary);
  
        if (!userSalary) {
            return res.status(404).json({ error: "Salary record not found" });
        }
        const currentDate = new Date(date);
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        // Check if a payslip for the current month already exists
        const existingPayslip = userSalary.payslip.find(payslip => {
            const payslipDate = new Date(payslip.date);
            return payslipDate.getMonth() === currentMonth && payslipDate.getFullYear() === currentYear;
        });

        if (existingPayslip) {
            return res.status(400).json({ error: "Payslip for this month already exists" });
        }

        // Add new payslip
        userSalary.payslip.push({
            date: currentDate,
            workDays: workdays,
            basic: basic,
            incentive: incentive
        });

        // Save the changes
        await userSalary.save();
  
        
        return res.status(200).json({ message: "salary paid successful", userSalary  });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
  };

export default paySalary
