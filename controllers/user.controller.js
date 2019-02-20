const { User, Service, Review, UserProfile }  = require('../models/index');
const validateData = require('../helpers/validateData');

const getDashboard = async(req,res) => {
    try {
        const user = req.session.user;
        // get current user jobs
        // get total positive reviews
        const positiveReviews = await getUserPositiveReviews(user._id);
        // get total negative reviews
        const negativeReviews = await getUserNegativeReviews(user._id);
        // get current user details
        const userDetails = await getUserDetails(user._id);

        const userProfile = await getUserProfile(user._id);

        let hasServices = userDetails.services.length > 0;
        // console.log(userDetails)
        res.render('dashboard',{
            title: "Campus Hustle -  Dashboard",
            user,
            positiveReviews,
            negativeReviews,
            userDetails,
            userProfile,
            hasServices
        });
    } catch (error) {
        console.log('error', error);
    }
}

const addUserService = async(req,res) => {
    const { user_id } = req.params;
    const { services } = req.body;
    try {
        // check if user exists
        const user = await User.findOne({_id: user_id});
        if(user){
            // mutate user services
            if(services.length > 0){
                services.forEach(function(service) {
                    user.services.push();
                })
            }
            await user.save();
            res.status({status:1,message:user.services});
        }
    } catch (error) {
        res.json({status:0, message:error});
    }
}

const getUserServices = (user_id) => {
    return new Promise(async(resolve,reject) => {
        try {
            // check if user exists
            const user = await User.findOne({_id: user_id}).populate('services');
            if(user){
                const services = user.services;
            }
        } catch (error) {
            reject(error);
        }
    })
}

const getUserDetails = (user_id) => {
    return new Promise (async(resolve,reject) => {
        try {
            const userDetails = await User.findById(user_id).populate(['services', 'school']);
            resolve(userDetails);
        } catch (error) {
            reject(error);
        }
    });
}

const getUserPositiveReviews = (user_id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const userReviews = await Review.find({_reviewee: user_id, isPositive: true});
            resolve(userReviews);
        } catch (error) {
            reject(error);
        }
    })
}

const getTotalNumberOfUserPositiveReviews = async(user_id) => {
    try {
        const positiveReviews = await Review.find({_reviewee:user_id, isPositive:true}).count();
        resolve(positiveReviews);
    } catch (error) {
        reject(error);
    }
}

const getUserNegativeReviews = (user_id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const userReviews = await Review.find({_reviewee: user_id, isPositive: false});
            resolve(userReviews);
        } catch (error) {
            reject(error);
        }
    })
}

const getTotalNumberOfUserNegativeReviews = async(user_id) => {
    try {
        const positiveReviews = await Review.find({_reviewee:user_id, isPositive:false}).count();
        resolve(positiveReviews);
    } catch (error) {
        reject(error);
    }
}

const getUserProfile = async (user_id) => {
    return new Promise (async(resolve, reject) => {
        try {
            const userProfile = await UserProfile.findOne({user_id});
            resolve(userProfile);
        } catch (error) {
            reject(error);
        }
    })
}

const createUserProfile = async(body) => {
    return new Promise( async (resolve,reject) => {
        try {
            const { user_id, fullname, level, department, faculty, city, state, whatsapp, about, address} = body;
            if(!validateData(user_id, fullname, level, department, faculty, city, state, whatsapp, about, address)){
                reject("One Or more Credentials missing");
            }
            // check if record exists
            const user = await UserProfile.findOne({user: user_id});
            if(user){
                // update record
                const updatedUserProfile = await UserProfile.findByIdAndUpdate(user_id,
                    {
                        fullname,
                        level,
                        department,
                        faculty,
                        city,
                        state,
                        whatsapp,
                        _about: about,
                        address
                    });
                    resolve(updateUserProfile);
            }else{
                // insert record
                const newuserProfile = new UserProfile(body);
                const userProfile = await newuserProfile.save();
                resolve(userProfile);
            }
        } catch (error) {
            reject(error)
        }
    })
   
}




module.exports = {
    getDashboard
}