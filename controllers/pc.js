

const PersonalCare = require('../models/pc');
const { errorHandler } = require('../helpers/dbErrorHandler');


exports.pcById = (req,res,next,id) => {
    PersonalCare .findById(id).exec((err,pc) => {
        if (err || !pc){
            return res.status(400).json({
                 error: "PersonalCare Category does not exist"
             });
         }
         req.pc = pc;
         next();
     });
 };
 
 

exports.create = (req,res) => {
    const pc = new PersonalCare (req.body);
    pc.save((err,data) => {
        if(err){
            return res.status(400).json({
                error: errorHandler(err)
            });
         }
       res.json({data});

    });
};

exports.read = (req,res) => {
    return res.json( req.pc);   
};

exports.update = (req,res) => {
    const pc = req.pc;
    pc.name = req.body.name;
    pc.save((err,data) => {
        if(err){
            return res.status(400).json({
                error: errorHandler(err)
            });
         }
       res.json({data});

    });
};

exports.remove = (req,res) => {
    const pc = req.pc;
    pc.remove((err,data) => {
        if(err){
            return res.status(400).json({
                error: errorHandler(err)
            });
         }
       res.json({message: "PersonalCare Category deleted successfully"});

    });
};


exports.list = (req,res) => {
    PersonalCare.find().exec((err,data) => {
        if (err || !data){
            return res.status(400).json({
                error: errorHandler(err)
             });
         }
         res.json(data);
     });
 };
 
