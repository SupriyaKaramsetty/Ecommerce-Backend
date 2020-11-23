const mongoose = require('mongoose');

const categorySchema = new  mongoose.Schema(
    {
    name:{
        type:String,
        trim:true,
        
        maxlength:32,
        unique:true,
        sparse:true,
        lowercase: true
    },
    intensity: {
        type:String,
        trim:true,  
        lowercase: true
    }
},
     {timestamps:true}
);


module.exports = mongoose.model("Category",categorySchema);