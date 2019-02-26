const mongoose = require('mongoose');

const { Schema } = mongoose;

const ServiceSchema = new Schema({
    name: { type: String, required: [true,'name is required']},
    description: { type: String, required: [true, 'description is required']},
    users: [{ type: Schema.Types.ObjectId, ref: 'User'}]
},
{ timestamps: true}
);

const Service = mongoose.model('Service', ServiceSchema);

module.exports = Service;