const formidable = require('formidable');
const _ = require("lodash");
const fs = require('fs');
const Product = require('../models/product');
const { errorHandler } = require('../helpers/dbErrorHandler');



exports.productById = (req,res,next,id) => {
    Product.findById(id)
    .populate('category')
    .populate('brand')
    .populate('pc')
    .populate('hair')
    .populate('comments.commenter', '_id name')
    .exec((err,product) => {
        if (err || !product){
            return res.status(400).json({
                 error: "Product not found"
             });
         }
         req.product = product;
         next();
     });
 };
 
 
 
 exports.read = (req,res) => {
     req.product.photo = undefined;
     return res.json(req.product);   
 };



exports.create = (req,res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields, files) => {
        console.log(req.body);
        console.log(fields);
        console.log(files);
        if(err) {
            console.log(errorHandler(err));
            return res.status(400).json({
                err: 'Image could not be uploaded'
            });
        }
       
        // check for all fields
        const { name, description, price, category, brand, pc ,hair, quantity, shipping } = fields;
//     const requiredFields = {name,description,price,brand,hair ,quantity,photo,shipping};

  //   form.on('field', function(name, value) {
  //          if (requiredFields.indexOf(name) > -1 && !value) {
  //              // field is required and its value is empty
  //              form._error('Required field is empty!');
  //              return;
  //          }
  //      });
  //      // Send error message back to client.
  //   form.on('error', function (message) {
  //      res.end(message);
  //  });

    if(!name || !description || !price  || !brand  || !quantity || !shipping) {
        return res.status(400).json({
        error: 'All fields are required'
        });
    }  
    let product = new Product(fields);

          //1kb=1000
        //1mb=1000000

    if(files.photo){
    //        var sizeLimitBytes = 2000;
    //form.on('progress', function(bytesReceived, bytesExpected) {
    //        if(bytesReceived > sizeLimitBytes ){
    //              return false; //exit the program
    //         }
    //    });

        if(files.photo.size> 1000000){
            return res.status(400).json({
                error: 'Image should be less than 1mb of size'
            });
        }
        product.photo.data = fs.readFileSync(files.photo.path);
        product.photo.contentType = files.photo.type;

    }

        product.save((err,result) => {
            if(err){
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json({result});
        });
    });
};


exports.remove = (req,res) => {
    let product=req.product;
    product.remove((err, deletedProduct) => {
        if(err){
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: "Product is deleted Successfully"
        });
    });
};
 

exports.update = (req,res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields, files) => {
        if(err) {
            return res.status(400).json({
                error: 'Image could not be uploaded'
            });
        }
        // check for all fields
        // const {name ,description ,price , category, brand, pc ,hair  ,quantity, sold ,photo ,shipping } = fields;

        let product = req.product;
        product = _.extend(product, fields);

          //1kb=1000
        //1mb=1000000

        if(files.photo){

            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error: 'Image should be less than 1mb in size'
                });
            }
   
            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type;

        }

        product.save((err,result) => {
            if(err){
                return res.status(400).json({
                    error: errorHandler(err)
                });
             }
            res.json({result});
         });
     });
 };

 /*most sold/ new arrivals
 *by sell = /products?sortBy=sold&order=desc&limit=4
 *by arrival = /products?sortBy=createdAt&order=desc&limit=4
 *if no params are sent,then all products are returned
 */



exports.list = (req,res) => {
    let order = req.query.order ? req.query.order : "asc";
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;

    Product.find()
     .select("-photo")
     .populate("category")
     .populate("brand")
     .populate("pc")
     .populate("hair")
     .sort([[sortBy,order]])
     .limit(limit)
     .exec((err,products) => {
        if(err){
             return res.status(400).json({
                error: "products not found"
            });
        }
        return res.json(products);
    });
};


 /**
  * it will find the products based on the request product category
  * other products that hare from same category are returned
  */
exports.listRelated = (req,res) => {

    let limit = req.query.limit ? parseInt(req.query.limit) : 6;

    Product.find({_id: {$ne: req.product}, category: req.product.category,  brand: req.product.brand ,  pc: req.product.pc , hair: req.product.hair})
        .limit(limit)
        .populate('pc','_id name')
        .populate('category','_id name') 
        .populate('brand','_id name')
        
        .populate('hair','_id name') 
        .exec((err,products) => {
            if(err){
                return res.status(400).json({
                    error: "products not found"
                });
            }
            return res.json(products);
        });
};


 exports.listCategories = (req,res) => {
    product.distinct("category",{}, (err,categories) => {
        if(err){
            return res.status(400).json({
               error: "Categories not found"
            });
        }
        return res.json(categories);
    });
};

 exports.listBrands = (req,res) => {
     product.distinct("brand",{}, (err,brands) => {
         if(err){
             return res.status(400).json({
                error: "brands not found"
             });
         }
         res.json(brandlist);
     });
 };

 exports.listPcs = (req,res) => {
    product.distinct("pc",{}, (err,pcs) => {
        if(err){
            return res.status(400).json({
               error: "pcs not found"
            });
        }
        res.json(pcs);
    });
};

 exports.listHairs= (req,res) => {
    product.distinct("hair",{}, (err,hairs) => {
        if(err){
            return res.status(400).json({
               error: "hairs not found"
            });
        }
        res.json(hairs);
    });
};


/**
 * list products by search
 * we will implement product search in react frontend
 * we will show categories in checkbox and price range in radio buttons
 * as the user clicks on those checkbox and radio buttons
 * we will make api request and show the products to users based on what he wants
 */

exports.listBySearch = (req, res) => {
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};
 
    // console.log(order, sortBy, limit, skip, req.body.filters);
    // console.log("findArgs", findArgs);
 
    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === "price") {
                // gte -  greater than price [0-10]
                // lte - less than
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }
 
    Product.find(findArgs)
        .select("-photo")
        .populate("category")
        .populate("brand")
        .populate("pc")
        .populate("hair")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: "Products not found"
                });
            }
            res.json({
                size: data.length,
                data
            });
        });
};

exports.photo = (req, res, next) => {
    if (req.product.photo.data) {
        res.set("Content-Type", req.product.photo.contentType);
        return res.send(req.product.photo.data);
    } 
    next();
};


exports.listSearch = (req, res) => {
    // create query object to hold search value and category value
    const query = {};
    // assign search value to query.name
    if (req.query.search) {
        query.name = { $regex: req.query.search, $options: 'i' };
        // assigne category value to query.category
        if (req.query.category && req.query.category != 'All') {
            query.category = req.query.category;
        }
        if (req.query.brand && req.query.brand != 'All') {
            query.brand = req.query.brand;
        }
        if (req.query.pc && req.query.pc != 'All') {
            query.pc = req.query.pc;
        }
        if (req.query.hair && req.query.hair != 'All') {
            query.hair = req.query.hair;
        }
        // find the product based on query object with 2 properties
        // search and category
        Product.find(query, (err, products) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(products);
        }).select('-photo');
    }
};


exports.decreaseQuantity = (req, res, next) => {
    let bulkOps = req.body.order.products.map(item => {
        return {
            updateOne: {
                filter: { _id: item._id },
                update: { $inc: { quantity: -item.count, sold: +item.count } }
            }
        };
    });

    Product.bulkWrite(bulkOps, {}, (error, products) => {
        if (error) {
            return res.status(400).json({
                error: 'Could not update product'
            });
        }
        next();
    });
};

exports.comment = (req, res) => {
    const newComment = {comment: req.body.comment, commenter: req.user._id};
    Post.findByIdAndUpdate(
        req.body.productId,
        {$push: {comments: {$each: [newComment], $sort: {createdAt: -1}}}},
        {new: true}
      )
      .populate('user', '_id name')
      .populate('comments.commenter', '_id name')
      .then(doc => { 
        return res.status(200).json(doc);
        })
      .catch(err => { return res.status(400).json(err)});
  };
  
  exports.uncomment = (req, res) => {
    Post.findByIdAndUpdate(req.body.productId, {$pull: {comments: req.body.comment}}, {new: true})
      .populate('user', '_id name')
      .populate('comments.commenter')
      .then(doc => res.status(200).json(doc))
      .catch(err => res.status(400).json(err));
  };
  



   


