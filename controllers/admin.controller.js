const { Admin, User, Service } = require('../models/index');
const validateData = require('../helpers/validateData');
const bcrypt = require('bcrypt-nodejs');

const getLogin = async(req,res) => {
    res.render('admin/login', {title: "Campus Hustle - Admin Login"});
}

const getSignup = async(req,res) => {
    res.render('admin/signup',{title: "Campus Hustle - Admin Signup"});
}

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
                req.session.admin = toJSON(admin);
                res.json({status:1,message:"Login Successful, we are redirecting..."});
            }
        }else{
            res.json({status:0,message:"Invalid email or password"});
        }
    }
}

const create = async(req,res) => {
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

const getIndex = async(req,res) => {
    try {
        const admin = req.session.admin;
        res.render('admin/index',{title: "Campus Hustle", admin});
    } catch (error) {
        
    }
}

// manage user
const suspendUser = async(req,res) => {
    try {
        const { id } = req.params;
        const admin = req.session.admin;
        const user = await User.findByIdAndUpdate(id,{$set:{isSuspended: true}});
        res.json({status:1, message: user});
    } catch (error) {
        res.json({status:0, message:error});
    }
}

const unSuspendUser = async(req,res) => {
    try {
        const { id } = req.params;
        const admin = req.session.admin;
        const user = await User.findByIdAndUpdate(id,{$set:{isSuspended: false}});
        res.json({status:1, message: user});
    } catch (error) {
        res.json({status:0, message:error});
    }
}

const getUsers = async(req,res) => {
    try {
        const admin = req.session.admin;
        const users = await User.find().populate(['school','services']);
        res.render('admin/users',{users, title:'Users',admin});
    } catch (error) {
        
    }
}

const getServices = async(req,res) => {
    try {
        const admin = req.session.admin;
        const services = await Service.find();
        res.render('admin/service',{ title: "Campus Hustle", services, admin});
    } catch (error) {
        
    }
}
//manage jobs/ services
const addService = async(req,res) => {
    try {
        const {name, description } = req.body;
        if(!validateData(name, description)){
            res.json({status:0, message:"Please Supply all inputs"});
        }else{
            const newService = new Service(req.body);
            await newService.save();
            res.json({status:1, message:newService});
        }
    } catch (error) {
        res.json({status:0, message:error.message});
    }
}

const removeService = async (req,res) => {
    try {
        const { service_id } = req.params;
        await Service.findByIdAndRemove(service_id);
        res.json({status:1, message:"Service removed Successfully"});
    } catch (error) {
        res.json({status:0, message:error.message});
    }
}

const removeUser = async (req,res) => {
    try {
        const { user_id } = req.params;
        await User.findByIdAndRemove(user_id);
        res.json({status:1, message:"User removed Successfully"});
    } catch (error) {
        res.json({status:0, message:error.message});
    }
}
const toJSON = (user) => {
    return {
        _id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
    };
}
// manageschools
const addSchool = async (req,res) => {
    
}

module.exports = {
    getLogin,
    authenticate,
    create,
    getUsers,
    getIndex,
    getServices,
    suspendUser,
    removeUser,
    unSuspendUser
};