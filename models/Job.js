const mongoose = require('mongoose');

const { Schema } = mongoose;

const JobSchema = new Schema({
    name: { type: String, required: [true,'name is required']},
},
{ timestamps: true}
);

const Job = mongoose.model('Job', JobSchema);

module.exports = Job;