const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt-nodejs');

const UserSchema = new Schema({
    firstname:{ type: String, required:true},
    lastname: { type: String, required: true},
    gender: { type: String, enum:['male','female'], required: true},
    phone: { type: String, required:[true,'Phone Number is required']},
    email: { type: String, required: [true, 'Email is required'], unique:true},
    username: { type: String, required: true, unique:true},
    services: [{ type: Schema.Types.ObjectId, ref: 'Service', required: false}],
    age: { type: Number, required: [true, 'Age is required']},
    password: { type: String, required:[true, "Password is required"]},
    school: { type: Schema.Types.ObjectId, ref:"School",required:true},
    isSuspended: { type: Boolean, default: false},
    profile_pic: { type: String},
    lastlogin: { type: Date, required: true, default: Date.now()}
},
{timestamps: true}
);

const hashpassword = async(next) => {
    
}

// UserSchema.pre('save',async function(next){
//     this.password = await bcrypt.hash(this.password);
//     next();
// });

const User = mongoose.model('User',UserSchema);

module.exports = User;