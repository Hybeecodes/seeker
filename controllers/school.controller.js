const { School } = require('../models/index');
const validateData = require('../helpers/validateData');


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

const getSchools = async (req,res) => {
    const schools = await School.find();
    res.json({schools});
}

const getAllSchools = async() => {
    return new Promise(async (resolve, reject) => {
        try {
            const schools = await School.find();
            resolve(schools); 
        } catch (error) {
            reject(error);
        }
    })
}

module.exports = {
    addSchool,
    getSchools,
    getAllSchools
}