const express = require('express');
const router = express.Router();
const {getLogin, getSignUp, authenticate, signup, getForgotPassword} = require('../controllers/guest.controller');
const { addSchool, getSchools, getAllSchools } = require('../controllers/school.controller');
const { addService, getAllServices} = require('../controllers/service.controller');
const { User }= require('../models/index')
const uniString = require('unique-string');
const bcrypt = require('bcrypt-nodejs')
const mail = require('../helpers/nodeMailerWithTemp');
const validate = require('../helpers/validateData');
router.get('/', async(req,res) => {
    if(req.session.user){
        return res.redirect('/user/dashboard');
    }
    const services = await getAllServices();
    const hasServices = services.length;
    const schools = await getAllSchools();
    res.render('index', {title: "Campus Hot Jobs", services, schools, hasServices});
})

Date.prototype.addHours= function(h){
    this.setHours(this.getHours()+h);
    return this;
  }

router.get('/contact',(req,res) => {
    is_logged_in = (req.session.user)? true: false;
    res.render('contact',{title: "Campus Hustle - Contact", is_logged_in});
});

router.get('/login', getLogin);

router.get('/signup',getSignUp);

router.post('/login',authenticate);

router.get('/forgot_password', getForgotPassword);

router.post('/send_message',(req,res) => {
  const {fullname, email, subject, message} = req.body;
  if(!validate(fullname, email, subject, message)){
    res.json({status:0,message:"Please Fill All Required Inputs"});
  }else{
   
   const send= mail.send_message(email,fullname,subject,message);
   if(send){
     res.json({status:1, message: "Message Sent Successfully"});
   }else{
    res.json({status:0, message: "Sorry, Unable to send message"})
   }
  }
})

router.post('/forgot-password',(req,res,next)=> {
    const { email } = req.body;
    User.findOne({email},(err,user)=>{
      if(user){
        let string = uniString();
        let token = `${email}_${string}`;
        // console.log(token);
        let link = `${process.env.BASE_URL}/reset-password?token=${token}`; // replace the localhost:3000 with your domain
        // console.log(link);
        const exp = new Date().addHours(2);
        // console.log(now);
        User.findOneAndUpdate({email},{resetPassToken:string,resetPassExp:exp}).then((user)=> {
          mail.send_link(email,link);
          return res.json({status:1, message:"A reset link has been sent to your email"});
        })
      }else{
        return res.json({status:0, message:"Invalid Email"}); 
      }
    });
  });

  router.get('/reset-password',(req,res,next) => {
    let { token } = req.query;
    token = token.split('_');
    console.log(token);
    const [ email, string] = token;
    User.findOne({email,resetPassToken:token}).then((user)=> {
      console.log(user.resetPassExp)
      // console.log('time',new Date().toISOString())
      if(user.resetPassExp > Date.now()){
        res.render('reset-password',{user_id: user._id});
      }else{
        res.send("Sorry, link has expired")
      }
    })
    // console.log(email)
  })
  
  router.post('/reset-password',(req,res,next)=>{
    const { user_id, new_pass, con_pass } = req.body;
    if(new_pass === con_pass){
      let password = bcrypt.hashSync(new_pass);
      User.findByIdAndUpdate(user_id,{password},(err,user)=>{
        if(err){
          res.json({status:0, message:err.message})
        }else{
            return res.json({status:1, message:"Password Reset Succesfully"});
        }
      })
    }
    
  })

router.post('/signup',signup);

router.post('/school',addSchool);

router.get('/schools',getSchools);

router.post('/service',addService);


module.exports = router;