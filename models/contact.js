const mongoose = require('mongoose');


const contactSchema = new  mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true,
        maxlength:32
    },
    email:{
        type:String,
        trim:true,
        required:true
        
        
    },
    message:{
        type:String,
        trim:true
    },
 
}, {timestamps:true}
);




module.exports = mongoose.model("contact",contactSchema);