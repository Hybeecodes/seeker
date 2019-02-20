const mongoose =  require('mongoose');
const { Schema } = mongoose;

const SchoolSchema = new Schema({
    name: { type: String, required: [true, 'name is required'], unique: true},
    location: { type: String, required: [true, 'address is required']},
    state: { type: String, required:true},
    country: { type: String, required: true},
    isActive: { type: Boolean, default: true}
},
{timestamps:true}
);

const School = mongoose.model('School', SchoolSchema);

module.exports = School;