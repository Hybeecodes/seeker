const mongoose = require('mongoose');
const { Schema } = mongoose;

const LastLoginSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique:true},
    lastlogin: { type: Date, required:true, default: Date.now()}
}, {timestamps: true});

const LastLogin = mongoose.model('LastLogin',LastLoginSchema);

module.exports = LastLogin;
