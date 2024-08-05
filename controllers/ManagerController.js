import User from '../models/userModel.js'




export const getEmploye = async(req,res)=>{
    
    
    const employees = await User.find({role:"Employee"}).sort({createdAt:-1})

    res.status(200).json(employees)

}
export const addPerformance = async (req, res) => {
    const { id, percentage, date } = req.body;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.performance.push({
            date: new Date(date),
            percentage: percentage
        });
        await user.save();

        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



export default {
    getEmploye,
    addPerformance

};
