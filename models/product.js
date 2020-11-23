const mongoose = require('mongoose');
const{ObjectId} =mongoose.Schema;

const productSchema = new  mongoose.Schema(
    {
    name:{
        type:String,
        trim:true,
        required:true,
        maxlength:200
    },
    description: {
        type: String,
        required: true,
        maxlength:2000
    },
    price:{
        type: Number,
        trim:true,
        required:true,
        maxlength:32
    },
    category:{
        type:ObjectId,
        ref: "Category",
        
    },
    brand:{
        type:ObjectId,
        ref: "Brand",
        required: true
    },
    pc:{
        type:ObjectId,
        ref: "PersonalCare",
        
    },
    hair:{
        type:ObjectId,
        ref: "Hair",
        
    },
    quantity:{
        type:Number
    },
    intensity:{
        required:false,
        type: String,
    },
    percentage:{
        required:false,
        type: String,
    },
    sold:{
        type: Number,
        default:0
    },
    photo:{
        data: Buffer,
        contentType: String
    },
    shipping: {
        required:false,
        type: Boolean
    },
    comments: [{
        comment: String,
        createdAt: 
        {type: Date, 
        default: Date.now
    },
        
    commenter: 
    {type: ObjectId, 
    ref: 'User'}
    }]
},
     {timestamps:true}
);



module.exports = mongoose.model("Product",productSchema);