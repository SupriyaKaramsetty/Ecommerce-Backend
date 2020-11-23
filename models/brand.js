const mongoose = require('mongoose');

const brandSchema = new  mongoose.Schema(
    {
    name:{
        type:String,
        trim:true,
        required:true,
        maxlength:32,
        unique:true,
        sparse:true,
        lowercase: true
    }
},
     {timestamps:true}
);


module.exports = mongoose.model("Brand",brandSchema);