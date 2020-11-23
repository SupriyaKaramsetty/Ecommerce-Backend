const Skin = require('../models/skin');
const { errorHandler } = require('../helpers/dbErrorHandler');


exports.skinById = (req,res,next,id) => {
    Skin.findById(id).exec((err,skin) => {
        if (err || !skin){
            return res.status(400).json({
                 error: "Skin Category does not exist"
             });
         }
         req.skin = skin;
         next();
     });
 };
 
 

exports.create = (req,res) => {
    const skin = new Skin(req.body);
    skin.save((err,data) => {
        if(err){
            return res.status(400).json({
                error: errorHandler(err)
            });
         }
       res.json({data});

    });
};

exports.read = (req,res) => {
    return res.json( req.skin);   
};

exports.update = (req,res) => {
    const skin = req.skin;
    skin.name = req.body.name;
    skin.save((err,data) => {
        if(err){
            return res.status(400).json({
                error: errorHandler(err)
            });
         }
       res.json({data});

    });
};

exports.remove = (req,res) => {
    const skin = req.skin;
    skin.remove((err,data) => {
        if(err){
            return res.status(400).json({
                error: errorHandler(err)
            });
         }
       res.json({message: "Skin Category deleted successfully"});

    });
};


exports.list = (req,res) => {
    Skin.find().exec((err,data) => {
        if (err || !data){
            return res.status(400).json({
                error: errorHandler(err)
             });
         }
         res.json(data);
     });
 };
 
