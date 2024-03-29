const { User, Service, Review, UserProfile, School,LastLogin }  = require('../models/index');
const validateData = require('../helpers/validateData');

const getDashboard = async(req,res) => {
    try {
        const user = req.session.user;
        // console.log(user)
        // get current user jobs
        // get total positive reviews
        const positiveReviews = await getUserPositiveReviews(user._id);
        // get total negative reviews
        const negativeReviews = await getUserNegativeReviews(user._id);
        // get current user details
        const userDetails = await getUserDetails(user._id);

        const allReviews = await getAllUserReviews(user._id);
        // console.log(allReviews);
        const hasReviews = allReviews.length > 0? true: false;
        const schools = await getAllSchools();

        const userCount = await getNumberOfMembers();
        const serviceCount = await getNumberOfCategories();

        const userProfile = await getUserProfile(user._id);
        const allServices = await getAllServices();
        const jobs = positiveReviews.length + negativeReviews.length;

        let hasServices = userDetails.services.length > 0? true : false;
        res.render('dashboard',{
            title: "Campus Hustle -  Dashboard",
            user,
            positiveReviews,
            negativeReviews,
            allReviews,
            hasReviews,
            jobs,
            userDetails,
            userProfile,
            hasServices,
            services: userDetails.services,
            allServices,
            userCount,
            serviceCount,
            schools
        });
    } catch (error) {
        console.log('error', error);
    }
}


const search = async (req,res) => {
    // console.log(req.query);
    const user = req.session.user;
    const {SchName, CategoryName } = req.query;
    let users = [];
    if(validateData(SchName)){
         users = await User.find({school: SchName}).populate(['services','school']);
    }else{
         users = await User.find().populate(['services','school']);
    }
    let search = [];
    if(validateData(CategoryName)){
         search = users.filter((user) => {
            let check = false;
            if(user._id !== req.session.user._id){
                user.services.forEach((service) => {
                    if(service.name == CategoryName){
                        check = true;
                    }
                })
            }
            return check;
        });
    }else{
         search = users;
    }
    
    const schools = await getAllSchools();
    const allServices = await getAllServices();
    const positiveReviews = await getUserPositiveReviews(user._id);
    const allReviews = await getAllUserReviews(user._id);
        // get total negative reviews
    const negativeReviews = await getUserNegativeReviews(user._id);
    res.render('search',{title:"Search -Result",search, positiveReviews, negativeReviews,user,allReviews, schools, allServices});
}

const searchUser = async (req,res) => {
    const {username } = req.query;
    const user = req.session.user;
    let users = [];
    if(validateData(username)){
        users = await User.find({username:   {'$regex': `${username}`}}).populate(['services','school']);
   }else{
        users = await User.find().populate(['services','school']);
   }
   const search = users;
    const schools = await getAllSchools();
    const allServices = await getAllServices();
    const positiveReviews = await getUserPositiveReviews(user._id);
    const allReviews = await getAllUserReviews(user._id);
        // get total negative reviews
    const negativeReviews = await getUserNegativeReviews(user._id);
    res.render('search',{title:"Search -Result",search, positiveReviews, negativeReviews,user,allReviews, schools, allServices});
}

const addUserService = async(req,res) => {
    const { services,user_id } = req.body;
    try {
        // check if user exists
        const user = await User.findOne({_id: user_id});
        if(user){
            // mutate user services
            if(services.length > 0){
                // console.log(services);

                services.forEach(async function(service) {
                    // console.log(user.services.indexOf(service))
                    if(user.services.indexOf(service) == -1){
                        user.services.push(service);
                    }
                    // also add user id to the service document
                    const serviceDoc = await Service.findById(service);
                    if(serviceDoc.users.indexOf(user_id) == -1){
                        serviceDoc.users.push(user_id);
                    }
                    await serviceDoc.save();
                    // console.log(user.services)
                })
            }
            await user.save();
            res.json({status:1,message:user.services});
        }
    } catch (error) {
        res.json({status:0, message:error});
    }
}

const getUserProfilePage = async(req,res) => {
    const { id } = req.params;
    if(id) {
        const user = req.session.user;
        const positiveReviews = await getUserPositiveReviews(id);
        // get total negative reviews
        const negativeReviews = await getUserNegativeReviews(id);
        // get current user details
        const userDetails = await getUserDetails(id);

        const schools = await getAllSchools();

        const userCount = await getNumberOfMembers();
        const serviceCount = await getNumberOfCategories();

        const allReviews = await getAllUserReviews(id);
        // console.log(allReviews);
        const hasReviews = allReviews.length > 0? true: false;
        const userProfile = await getUserProfile(id);
        const allServices = await getAllServices();
        const jobs = positiveReviews.length + negativeReviews.length;

        let hasServices = userDetails.services.length > 0;
        res.render('view_user',{
            title: `User Profile -  ${userDetails.username}`,
            user,
            positiveReviews,
            negativeReviews,
            allReviews,
            jobs,
            userDetails,
            userProfile,
            hasReviews,
            hasServices,
            services: userDetails.services,
            allServices,
            userCount,
            serviceCount,
            schools
        });
    }

}

const getNumberOfMembers = () => {
    return new Promise(async(resolve, reject) => {
        try {
            const count = User.find().count();
            resolve(count);
        } catch (error) {
            reject(error);
        }
    })
};

const getNumberOfCategories = () => {
    return new Promise(async(resolve, reject) => {
        try {
            const count = Service.find().count();
            resolve(count);
        } catch (error) {
            reject(error);
        }
    })
}

const getAllSchools = () => {
    return new Promise (async(resolve, reject) =>{
        try {
            const schools = await School.find();
            resolve(schools);
        } catch (error) {
            reject(error)
        }
    })
}

const removeUserService = async(req,res) => {
    try {
        const { user_id, service_id } =  req.body;
        if(validateData(user_id, service_id)){
            const user = await User.findById(user_id);
            if(user){
                let services = user.services;
                let newServices = services.filter((service) => {
                    return service_id != service;
                });
                user.services = newServices;
                await user.save();
                const service = await Service.findById(service_id);
                let service_users = service.users;
                let newServiceUsers = service_users.filter((user) => {
                    return user != user_id;
                })
                await service.save();
                res.json({status:1, message: user.services});
            }else{
                res.json({status: 0, message: "User doesn't exist"});
            }
        }else{
            res.json({status:0, message: "one or more credentials missing"});
        }
    } catch (error) {
        res.json({status:0, message: error});
    }
}

const getAllServices = () => {
    return new Promise(async(resolve, reject) => {
        try {
            const services = await Service.find();
            resolve(services);
        } catch (error) {
            reject(error);
        }
    })
}

const getUserServices = (user_id) => {
    return new Promise(async(resolve,reject) => {
        try {
            // check if user exists
            const user = await User.findOne({_id: user_id}).populate('services');
            if(user){
                const services = user.services;
                resolve(services);
            }else{
                reject("User does not exist");
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

const reviewUser = async(req,res) => {
    try {
        const { _reviewee, comment, isPositive, _reviewer } = req.body;
        // has user reviewd before
        const rev = await Review.findOne({_reviewee,_reviewer});
        let review = {};
        if(rev){
            review = await Review.findOneAndUpdate({_reviewee,_reviewer}, {$set:{comment, isPositive}});
        }else{
            const newReview = new Review(req.body);
            review = await newReview.save();
        }
        
        res.json({status:1, message: review});
    } catch (error) {
        res.json({status:0, message:error.message});
    }
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

const getAllUserReviews = (user_id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const userReviews = await Review.find({_reviewee: user_id}).populate('_reviewer');
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

const getUserProfile = async (user) => {
    // console.log(user_id);
    return new Promise (async(resolve, reject) => {
        try {
            const userProfile = await UserProfile.findOne({user});
            resolve(userProfile);
        } catch (error) {
            reject(error);
        }
    })
}

const postProfile = async(req,res) => {
    // console.log(req.body)
    // update picture
    try {
        if(req.file){
            // console.log(req.file);
            let image_path = `${req.file.path}`.substring(7);
            let cover= `${req.file.destination}`.substring(7);
            let cover_pic = `${cover}/${req.file.filename}`;
            const { user } = req.body;
            await User.findByIdAndUpdate(user,{$set:{profile_pic:image_path, cover_pic}});
            req.session.user.profile_pic = image_path;
            req.session.user.cover_pic = cover_pic;
          }
        const profile = await createUserProfile(req.body);
        return res.json({status:1, message:"Profile Updated Successfully"});
    } catch (error) {
        return res.json({status:0,message:error});
    }
}

const updateLastLogin = async(user_id) => {
    return new Promise(async(resolve,reject) => {
        try {
            const userLogin = await LastLogin.findOne({user: user_id});
            if(userLogin){
                const newUserLogin = await LastLogin.findOneAndUpdate({user:user_id}, {$set:{lastlogin: Date.now()}});
                resolve(newUserLogin);
            }else{
                const newUserLogin = new LastLogin({
                    user:user_id
                });
                await newUserLogin.save();
                resolve(newUserLogin)
            }
        } catch (error) {
            reject(error);
        }

    })
}

const createUserProfile = async(body) => {
    console.log(body);
    return new Promise( async (resolve,reject) => {
        try {
            const { user, fullname, level, department, faculty, city, state, whatsapp, _about, address} = body;
            if(!validateData(user, fullname, level, department, faculty, city, state, whatsapp, _about, address)){
                reject("Please Fill all required Fields");
            }
            // check if record exists
            const _user = await UserProfile.findOne({user: user});
            // console.log(_user);
            if(_user){
                // update record
                const updatedUserProfile = await UserProfile.findOneAndUpdate({user:user},{$set:
                    {
                        fullname,
                        level,
                        department,
                        faculty,
                        city,
                        state,
                        whatsapp,
                        _about,
                        address
                    }});
                    resolve(updatedUserProfile);
            }else{
                // insert record
                const newuserProfile = new UserProfile(body);
                const userProfile = await newuserProfile.save();
                resolve(userProfile);
            }
        } catch (error) {
            console.log(error);
            reject(error)
        }
    })
};

const getUsersByCampus = async(campus_id) => {
    return new Promise(async(resolve, reject) => {
        try {
            const users = await User.find({school: campus_id});
            resolve(users);
        } catch (error) {
            reject(error);
        }
    })
}

const getUsersByService = async(service_id) => {
    return new Promise(async(resolve, reject) => {
        try {
            let searchUsers =[];
            const users = await User.find();
            if(users.length > 0){

            }
        } catch (error) {
            reject(error);
        }
    })
}




module.exports = {
    getDashboard,
    postProfile,
    addUserService,
    removeUserService,
    search,
    searchUser,
    getUserProfilePage,
    reviewUser
}