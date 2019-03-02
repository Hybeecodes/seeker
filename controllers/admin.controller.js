const { Admin, User, Service, School } = require('../models/index');
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
        const services = await Service.find();
        const users = await User.find().populate('school');
        const schools = await School.find();
        // console.log(users)
        const admin = req.session.admin;
        res.render('admin/index',{title: "Campus Hustle", admin, users,services, schools});
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
        const hasServices = (services.length > 0)? true: false;
        res.render('admin/services',{ title: "Campus Hustle - Users", services, admin, hasServices});
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

const updateService = async(req,res) => {
    try {
        const { service, name, description } = req.body;

        if(!validateData(name,description, service)){
            res.json({status:0, message: "Missing Input"});
        }else{
            const newService = await Service.findByIdAndUpdate(service,{$set:{name, description}});
            res.json({status:1,message:newService});
        }
       
    } catch (error) {
        res.json({status:0, message: error.message});
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
const getSchools = async(req,res) => {
    try {
        const admin = req.session.admin;
        const schools = await School.find();
        const hasSchools = (schools.length > 0)? true: false;
        res.render('admin/schools',{ title: "Campus Hustle - Schools", schools, admin, hasSchools});
    } catch (error) {
        
    }
}
const addSchool = async(req,res) => {
    const { name, location, state, country} = req.body;
    if(!validateData(name, location, state, country)){
        res.json({status:0,message:"Please Fill all required fields"});
    }else{
        const school = await School.findOne({name});
        if(school){
            res.json({status:0,message:"Sorry, School already exists"});
        }else{
            const newSchool = await School.create(req.body);
            res.json({status:1, message:newSchool});
        }
    }
}

const removeSchool = async (req,res) => {
    try {
        const { school_id } = req.params;
        await School.findByIdAndRemove(school_id);
        res.json({status:1, message:"School removed Successfully"});
    } catch (error) {
        res.json({status:0, message:error.message});
    }
}

const updateSchool = async(req,res) => {
    try {
        const { school, name, location, state, country } = req.body;

        if(!validateData(school, name, location, state, country)){
            res.json({status:0, message: "Missing Input"});
        }else{
            const newSchool = await School.findByIdAndUpdate(school,{$set:{name, location, state, country}});
            res.json({status:1,message:newSchool});
        }
       
    } catch (error) {
        res.json({status:0, message: error.message});
    }
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
    unSuspendUser,
    removeService,
    updateService,
    getSchools,
    addSchool,
    removeSchool,
    updateSchool
};