const mongoose = require('mongoose');
// console.log(process.env.NODE_ENV);
const url = `mongodb://localhost/seeker`;

mongoose.connect(url).then(()=>{
    console.log('Connected to database',{ useNewUrlParser: true });
}).catch((err)=>{
    console.log(err);
});