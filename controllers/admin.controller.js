const { Admin, User } = require('../models/index');
const validateData = require('../helpers/validateData');
const bcrypt = require('bcrypt-nodejs');

const authenticate = async(req,res) => {
    const { email, password } = req.body;
    if(!validateData(email, password)){
        res.json({status:0, message: "Please Fill All Required Fields"});
    }else{
        const admin = await Admin.findOne({email});
        if(admin){
            if(!bcrypt.compareSync(password,admin.password)){
                res.json({status:0,message:"Invalid email or password"});
            }else{
                req.session.admin = admin;
                res.json({status:1,message:admin});
            }
        }else{
            res.json({status:0,message:"Invalid email or password"});
        }
    }
}

const create = (req,res) => {
    try {
        const { firstname, lastname, email, password} = req.body;
        if(!validateData(firstname, lastname, email,password)){
            res.json({status:0, message: "Please Fill All Required Fields"});
        }else{
            const admin = await Admin.findOne({email});
            if(admin){
                res.json({status:0, message: "Admin user exists Already"});
            }else{
                const newAdmin = new Admin({
                    firstname,
                    lastname,
                    email,
                    password: bcrypt.hashSync(password)
                });
                await newAdmin.save();
                res.json({status:1, message:newAdmin});
            }
        }
    } catch (error) {
        
    }
}

// manage user
const suspendUser = (req,res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndUpdate(id,{$set:{isSuspended: true}});
        res.json({status:1, message: user});
    } catch (error) {
        res.json({status:0, message:error});
    }
}

const getUsers = (req,res) => {
    try {
        const users = await User.find().populate(['school','services']);
        res.render('admin/users',{users, title:'Users'});
    } catch (error) {
        
    }
}
//manage jobs
// manageschools


module.exports = {

};