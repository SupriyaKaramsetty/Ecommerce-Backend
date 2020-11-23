const mongoose = require('mongoose');

const reviewSchema = new  mongoose.Schema(
    {
    
    username:{
            type:String,
            trim:true,
            required:true
    },
    comment:{
        type:String,
        trim:true,
        maxlength:1000
        
    }
},
     {timestamps:true}
);


module.exports = mongoose.model("Review",reviewSchema);