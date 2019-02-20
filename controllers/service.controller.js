const { Service }  = require('../models/index');
const validateData = require('../helpers/validateData');

const ServiceController = {};

ServiceController.addService = async(req,res) => {
    const { name } = req.body;
    if(!validateData(name)){
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

ServiceController.getAllServices = async (req,res) => {
    
    return new Promise((resolve,reject) => {
        try {
            const services = await Service.find();
            resolve(services);
        } catch (error) {
            reject(error)
        }
    })
}



module.exports = ServiceController;