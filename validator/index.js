exports.userSignupValidator = (req,res,next) => {
    req.check('name','Name is required').notEmpty();
    req.check('email',"Email must be between 3 and 32 characters")
        .matches (/.+\@.+\..+/)
        .withMessage("Email must contain @")
        .isLength({
            min: 4,
            max: 32
        });

    req.check('password','Password is required').notEmpty();
    req.check('password')
        .isLength({min: 8})
        // .withMessage("Password must contain at least 8 characters") 
        // .matches(/\d/)
        // .withMessage("Password must contain a number")
        // .matches(/\!/)
        // .withMessage("Password must conatin a special character ");
        
    const errors = req.validationErrors();
    if(errors){
            const firstError = errors.map(error => error.msg)[0];
            return res.status(400).json({error: firstError});

     }
        next();
};

exports.pincodeValidator = ( req,res,next) => {
   req.check('pin')
        .matches (/(533103)/)
        .withMessage("Enter a Valid Pincode")
        .isLength({
            min: 6,
            max: 6
        });
   const errors = req.validationErrors();
   if(errors){
           const firstError = errors.map(error => error.msg)[0];
           return res.status(400).json({error: firstError});
    
    }
       next();
};

exports.passwordResetValidator = (req, res, next) => {
    req.check('newPassword')
      .notEmpty().withMessage('Password is required')
      .isLength({min:6, max:20}).withMessage('Password must be 6-20 characters')
      .matches(/\d/).withMessage('Password must contain at least one number');
    const errors = req.validationErrors();
    if (errors) {
      const errorMsgs = errors.map(err => err.msg);   // show list of error messages
      return res.status(400).json({error: errorMsgs});
    }
    next();
  };
  