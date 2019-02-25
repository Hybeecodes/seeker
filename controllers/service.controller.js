const { Service }  = require('../models/index');
const validateData = require('../helpers/validateData');

const ServiceController = {};

const addService = async(req,res) => {
    const { name, description } = req.body;
    console.log(req.body)
    if(!validateData(name, description)){
        res.json({status:0,message: "Please Fill All Required Fields"});
    }else{
        try {
            const service = await Service.findOne({name});
            if(service){
                res.json({status:0,message:"Service Exists Already"});
            }else{
                const newService = new Service(req.body);
                const service = await newService.save();
                res.json({status:1,message:service});
            }
        } catch (error) {
            res.json({status:0,message:error});
        }
                
    }
}

const getAllServices = async (req,res) => {
    
    return new Promise(async(resolve,reject) => {
        try {
            const services = await Service.find();
            resolve(services);
        } catch (error) {
            reject(error)
        }
    })
}



module.exports = {
    addService,
    getAllServices
};