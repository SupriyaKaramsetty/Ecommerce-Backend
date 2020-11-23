const nodeMailer = require('nodemailer');
 
exports.sendEmail = emailData => {
  const transporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: 'chandanasupriya2000@gmail.com',
      pass: 'UserPass'
    }
  });

  return transporter
    .sendMail(emailData)
    .then(info => console.log(`Message sent: ${info.response}`))
    .catch(err => console.log(`Problem sending email: ${err}`));
};
