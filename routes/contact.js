 const contact = require('../models/contact');
 const User = require('../models/user');
var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
const creds = require('../config');
const user = require('../models/user');

var transport = {
    host: 'smtp.gmail.com', // Don’t forget to replace with the SMTP host of your provider
    port: 465,
    auth: {
    user: creds.USER,
    pass: creds.PASS
  }
}

var transporter = nodemailer.createTransport(transport)

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take messages');
  }
});

router.post('/contact', (req, res) => {
  var name = req.body.name
  var email = req.body.email
  var message = req.body.message
  var content = `name: ${name} \n email: ${email} \n message: ${message} `

  var mail = {
    from: user.mail,
    to: 'rohitvallam29@gmail.com',  // Change to email address that you want to receive messages on
    subject: 'New Message from Contact Form',
    text: content
  }

  transporter.sendMail(mail, (err, data) => {
    if (err) {
      res.json({
        status: 'fail'
      })
    } else {
      res.json({
       status: 'success'
      })
    }
  })

  // transporter.sendMail({
  //   from:'chandanasupriya2000@gmail.com' ,
  //   to: user.email,
  //   subject: "Submission was successful",
  //   text: `Thank you for not contacting us!\n\nForm details\nName: ${contact.name}\n Email: ${contact.email}\n Message: ${contact.message}`
  // }, function(error, info){
  //   if(error) {
  //     console.log(error);
  //   } else{
  //     console.log('Message sent: ' + info.response);
  //   }
  // });
});



  module.exports = router;


