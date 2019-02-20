const mongoose = require('mongoose');
const { Schema } = mongoose;

const ReviewSchema = new Schema({
    _reviewer: { type: Schema.Types.ObjectId,ref:'User', required:true},
    _reviwee: { type:  Schema.Types.ObjectId, ref: 'User', required:true},
    comment: { type: String, required:true},
    isPositive: { type: Boolean, required: true}
},
{ timestamps: true}
);

const Review = mongoose.model('Review', ReviewSchema);

module.exports = Review;