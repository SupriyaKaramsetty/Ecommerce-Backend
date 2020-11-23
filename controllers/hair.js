

const Hair = require('../models/hair');
const { errorHandler } = require('../helpers/dbErrorHandler');


exports.hairById = (req,res,next,id) => {
    Hair.findById(id).exec((err,hair) => {
        if (err || !hair){
            return res.status(400).json({
                 error: "Hair Category does not exist"
             });
         }
         req.hair = hair;
         next();
     });
 };
 
 

exports.create = (req,res) => {
    const hair = new Hair (req.body);
    hair.save((err,data) => {
        if(err){
            return res.status(400).json({
                error: errorHandler(err)
            });
         }
       res.json({data});

    });
};

exports.read = (req,res) => {
    return res.json( req.hair);   
};

exports.update = (req,res) => {
    const hair = req.hair;
    hair.name = req.body.name;
    hair.save((err,data) => {
        if(err){
            return res.status(400).json({
                error: errorHandler(err)
            });
         }
       res.json({data});

    });
};

exports.remove = (req,res) => {
    const hair = req.hair;
    hair.remove((err,data) => {
        if(err){
            return res.status(400).json({
                error: errorHandler(err)
            });
         }
       res.json({message: "Hair Category deleted successfully"});

    });
};


exports.list = (req,res) => {
    Hair.find().exec((err,data) => {
        if (err || !data){
            return res.status(400).json({
                error: errorHandler(err)
             });
         }
         res.json(data);
     });
 };
 
