const mongoose = require('mongoose');
const { Schema } = mongoose;

const AdminSchema = new Schema({
    firstname: { type: String, required: true},
    lastname: { type: String, required: true},
    email: { type: String, required: true},
    password: { type: String, required: true}
}, { timestamps: true});

const Admin = mongoose.model('Admin',AdminSchema);

module.exports = Admin;