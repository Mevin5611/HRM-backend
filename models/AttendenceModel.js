import mongoose from 'mongoose'

const Schema = mongoose.Schema


const attendanceSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    user_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User' // Reference to the User model
    },
    attendance: [
        {
            status: {
                type: String,
                required:true,
                default:"Present"
            },
            checkindate: {
                type: Date,
                default: Date.now
            },
            checkoutdate: {
                type: Date,
                
            }
        }
    ]
}, { timestamps: true });

export default mongoose.model('attendance',attendanceSchema)



