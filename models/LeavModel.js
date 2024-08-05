import mongoose from 'mongoose'

const Schema = mongoose.Schema


const leavSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    reason:{
         type:String,
         required:true
    },
    user_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User' 
    },
    leav_status:{
        type:String,
    }
}, { timestamps: true });

export default mongoose.model('leav',leavSchema)



