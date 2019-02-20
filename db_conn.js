const mongoose = require('mongoose');
// console.log(process.env.NODE_ENV);
const url = `mongodb://localhost/seeker`;

const remote_url = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ds141815.mlab.com:41815/seeker`;

mongoose.connect(remote_url).then(()=>{
    console.log('Connected to database',{ useNewUrlParser: true });
}).catch((err)=>{
    console.log(err);
});