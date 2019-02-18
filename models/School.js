const mongoose =  require('mongoose');
const { Schema } = mongoose;

const SchoolSchema = new Schema({
    name: { type: String, required: [true, 'name is required'], unique: true},
    address: { type: String, required: [true, 'address is required']},
    isActive: { type: Boolean, default: false}
},
{timestamps:true}
);

const School = mongoose.model('School', SchoolSchema);

module.exports = School;