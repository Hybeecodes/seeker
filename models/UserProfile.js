const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserProfileSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref:'User', required: true},
    fullname: { type: String},
    level: { type: String},
    depatment: { type: String},
    faculty: { type: String},
    city: { type: String},
    state: { type: String},
    whatsapp: { type: String, maxlength: [11,'Whatsapp Number Should Not Be More Than 11 didits']},
    _about: { type: String},
    address: { type: String}
}, {timestamps: true});

const UserProfile = mongoose.model('UserProfile', UserProfileSchema);

module.exports = UserProfile;