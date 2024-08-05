import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import validator from 'validator'

const Schema = mongoose.Schema;

const payslipSchema = new Schema({
    date: {
        type: Date,
        required: true
    },
    workDays: {
        type: Number,
        required: true
    },
    basic: {
        type: Number,
        required: true
    },
    incentive: {
        type: Number,
        required: true
    }
});

const performanceSchema = new Schema({
    percentage: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
});

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "Employee"
    },
    name: {
        type: String
    },
    mob: {
        type: String
    },
    address: {
        type: String
    },
    jobrole: {
        type: String
    },
    profileImage:{
      public_id: String,
      url: String,
    },
    payslip: [payslipSchema],
    performance: [performanceSchema],
    
},{timestamps:true});

// static signup method
userSchema.statics.signup = async function(email, password, name, mob, jobrole, address) {
    const exists = await this.findOne({ email });

    if (!email || !password) {
        throw Error('All fields must be filled');
    }
    if (!validator.isEmail(email)) {
        throw Error('Email is not valid');
    }
    if (!validator.isStrongPassword(password)) {
        throw Error('Password is not strong enough');
    }

    if (exists) {
        throw Error('Email already in use');
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await this.create({ email, password: hash, role: "Employee", name, mob, jobrole, address });

    return user;
};

// static login method
userSchema.statics.login = async function(email, password) {
    if (!email || !password) {
        throw Error('All fields must be filled');
    }
    const user = await this.findOne({ email });
    if (!user) {
        throw Error('Incorrect email');
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        throw Error('Incorrect password');
    }
    return user;
};

export default mongoose.model('User', userSchema);
