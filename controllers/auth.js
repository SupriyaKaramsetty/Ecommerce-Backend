const User = require('../models/user');
const jwt = require('jsonwebtoken') //to generate signed token
const expressJwt = require('express-jwt'); //for authorization check
const {errorHandler} = require('../helpers/dbErrorHandler');
const crypto = require('crypto');
const {sendEmail} = require('../mailer/index');
 const { OAuth2Client } = require('google-auth-library');

//signup
exports.signup = (req,res) => {
  // res.send({message: "please work"});
   //console.log('req.body',req.body);   
   const user = new User(req.body);
   //console.log(req.body);
   user.save((err,user) => {
       if(err){
          return res.status(400).json({
              error: errorHandler(err)
          });
       }

     user.salt = undefined;
     user.hashed_password = undefined;
     res.json({
          user
      });
  });
};

//signin
exports.signin = (req,res) => {
 //find user based on email
  const {email,password} = req.body;
  User.findOne({email},(err,user) => {
    if(err ||!user) {
      return res.status(400).json({
        error: "User with that email does not exist. Please Sign up"
      });
    }

    //if user is found make sure email and password match
    // create authenticate method in user model
    if(!user.authenticate(password)) {
      return res.status(401).json({
       error: "Email and Password do not match"
      });
   }

   //generate a signed token with user id and secret
    const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);
   //persist the token as 't' in cookie with expiry date
    res.cookie('t',token,{expire: new Date()+9999}); 
    //return response with user and token to frontend client
    const {_id,name,email,role} = user;
    return res.json({
      token,user:
       {_id,
        email,
        name,
        role
      }
    });
 });
};



//signout
exports.signout = (req,res) => {
  res.clearCookie('t');
  res.json({
    message: "Signout succesful"
  });
};

//requireSignin
exports.requireSignin =  expressJwt ({
  secret: "something great secrt",
  requestProperty: "auth",
  algorithms:["HS256"]

});

//auth middleware
exports.isAuth = (req,res,next) => {
  console.log(req.auth._id);
  let user =  req.profile._id && req.auth._id && req.profile._id == req.auth._id 
  console.log(user);
   if(!user){
     return res.status(403).json({
       error: "Access denied"
    });
  
  }
 // res.json({ user });
  next();
};

//admin middleware
exports.isAdmin= (req,res,next) => {
   if(req.profile.role === 0){
     return res.status(403).json({
       error: "Not an Admin! Access denied"
    });
   }
  next();
};


exports.forgotPassword = (req, res) => {
  if (!req.body && !req.body.email) return res.status(400).json({message: 'No email provided.'});
  const {email} = req.body;
  // find the user based on email
  User.findOne({email})
    .exec((err, user) => {
      if (user) {
        // generate a token
        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);
        // email data
        const emailData = {
          from: 'chandanasupriya2000@gmail.com',
          to: email,
          subject: 'Password Reset',
          html: `<h3>You requeseted password reset</h3> <p>${process.env.CLIENT_URL}/reset-password/${token}</p>`
        };
        user.updateOne({resetPasswordLink: token}, (err, success) => {
          if (err) return res.json({error: err});
          else return sendEmail(emailData);
        });
      }
      return res.status(200).json({message: `Password reset instruction has been sent to "${email}" if it exists in our system.`});
    });
};

exports.resetPassword = (req, res) => {
  const {resetPasswordLink, newPassword} = req.body;
  User.findOne({resetPasswordLink}, (err, user) => {
    // if err or no user
    if (err || !user) return res.status('401').json({error: 'Invalid Link!'});
    const updatedFields = {
      password: newPassword,
      resetPasswordLink: ''
    };
    user = Object.assign(user, updatedFields);
    user.save((err, result) => {
      if (err) return res.status(400).json({error: err});
      res.json({message: `Please login with your new password.`});
    });
  });
};

exports.socialLogin = (req, res) => {
  // try signup by finding user with req.email
  let user = User.findOne({email: req.body.email}, (err, user) => {
    if (err || !user) {
      // create a new user and login
      user = new User(req.body);
      // req.profile = user;
      user.save()
        // generate a token with user id and secret
        .then(usr => {  
          const token = jwt.sign({_id: usr._id}, process.env.JWT_SECRET);
          res.cookie('t', token, {expires: new Date(Date.now() + 18000000), httpOnly: true}); // 5 hours 
          // return response with user and token to frontend client
          const {_id, name, email} = usr;
          return res.json({user: {token, _id, name, email}});
        })
        .catch(err => res.status(500).json({error: err}));
    } else {
      // update existing user with new social info and login
      user = Object.assign(user, req.body);
      user.save()
        .then(usr => {
          const token = jwt.sign({_id: usr._id,}, process.env.JWT_SECRET);
          res.cookie('t', token, {expires: new Date(Date.now() + 18000000), httpOnly: true}); // 5 hours
          // return response with user and token to frontend client
          const {_id, name, email} = usr;
          return res.json({user: {token, _id, name, email}});
        })
        .catch(err => res.status(500).json({error: err}));
    }
  });
};
