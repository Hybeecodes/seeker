const { User } = require('../models/index');
const validateData = require('../helpers/validateData');

const bcrypt = require('bcrypt-nodejs');

const getLogin =  (req,res) => {
    res.render('login',{title: 'Campus Hustle Login'});
};

const authenticate = async(req,res) => {
    const {email, password} = req.body;
    if(!validateData(email,password)){
        res.json({status:0, message: "Please fill all required fields"});
    }else{
        try {
            const user = await User.findOne({email, password});
            if(user){
                req.session.user = toJSON(user);
                res.json({status:1,message:"Login Successful, We are redirecting you..."});
            }else{
                res.json({status:0,message:"Sorry, Invalid email or password"});
            }
        } catch (error) {
            res.json({status:0,message:error});
        }
    }
}

const getSignUp = (req,res) => {
    res.render('signup',{title: 'Campus Hustle - Signup'});
}

const signup = async (req,res) => {
    const { firstname, lastname, gender, phone, email, age, password, school} = req.body;
    if(!validateData(firstname, lastname, gender, phone, email, age, password, school)){
        res.json({status:0,message:"Please fill all fields!"});
    }else{
        try {
            const user = await User.findOne({email});
            if(user){
                res.json({status:0,message:"Sorry, User Exists Already!"});
            }else{
                const newUser = new User(req.body);
                 await newUser.save();
                res.json({status:1,message:"Great, Registration Successful"});
            }
        } catch (error) {
            console.log(error)
            res.json({status:0,message:error.message});
        }
    }
}

const toJSON = (user) => {
    return {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        phone: user.phone
    };
}

module.exports = {
    getLogin,
    getSignUp,
    authenticate,
    signup
}