const { Order, CartItem } = require('../models/order');
const { errorHandler } = require('../helpers/dbErrorHandler');
var nodeMailer = require('nodemailer');
const creds = require('../config');
const User = require('../models/user');
const fast2sms = require('fast-two-sms');


exports.orderById = (req, res, next, id) => {
    Order.findById(id)
        .populate('products.product', 'name price')
        .exec((err, order) => {
            if (err || !order) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            req.order = order;
            next();
        });
};

exports.create = (req, res) => {
   // console.log('CREATE ORDER: ', req.body);
    req.body.order.user = req.profile;
    const order = new Order(req.body.order);

    order.save((error, data) => {
        if (error) {
            return res.status(400).json({
                error: errorHandler(error)
            });
        }
        let mob=order.phone;
        fast2sms.sendMessage({ 
            authorization: 'dQjPJvZ3HnY8xsBlVaCRDqXptEo250SNTheWK7zAcMLwbkfu6Uy4u2mQRafdzYAjIBiFkgepVvUHZGD6' , 
            message: `Hey ${order.user.name}, Your payment for order ${order._id} has been completed.We will confirm the order and send out the order details soon.
            Thanks for choosing us..!
            Have a nice day!`, 
            numbers: [mob]});

        const transporter = nodeMailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
              user: 'mailid',
              pass: 'UserPass'
            }
          });

        const emailData1 = {
            to: 'cadminmail', // admin
            from: 'anothermail',
            subject: `A new order is received`,
            html: `
            <h1>Hey Admin, Somebody just made a purchase in your ecommerce store</h1>
            <h2>Customer name: ${order.user.name}</h2>
            <h2>Customer address: ${order.address}</h2>
            <h2>User's purchase history: ${order.user.history.length} purchase</h2>
            <h2>User's email: ${order.user.email}</h2>
            <h2>Total products: ${order.products.length}</h2>
            <h2>Transaction ID: ${order.transaction_id}</h2>
            <h2>Order status: ${order.status}</h2>
            <h2>Product details:</h2>
            <hr />
            ${order.products
                .map(p => {
                    return `<div>
                        <h3>Product Name: ${p.name}</h3>
                        <h3>Product Price: ${p.price}</h3>
                        <h3>Product Quantity: ${p.count}</h3>
                </div>`;
                })
                .join('--------------------')}
            <h2>Total order cost: ${order.amount}<h2>
            <p>Login to your dashboard</a> to see the order in detail.</p>
        `
        };


        transporter
             .sendMail(emailData1)
            .then(sent => console.log('SENT >>>', sent))
            .catch(err => console.log('ERR >>>', err));
    
        const emailData2 = {
            to: 'customermail',
            from: 'adminmail',
            subject: `Your order is in process`,
            html: `
            <h1>Hey ${req.profile.name}, Thank you for shopping with us.</h1>
            <h2>Total products: ${order.products.length}</h2>
            <h2>Transaction ID: ${order.transaction_id}</h2>
            <h2>Order status: ${order.status}</h2>
            <h2>Product details:</h2>
            <hr />
            ${order.products
                .map(p => {
                    return `<div>
                        <h3>Product Name: ${p.name}</h3>
                        <h3>Product Price: ${p.price}</h3>
                        <h3>Product Quantity: ${p.count}</h3>
                </div>`;
                })
                .join('--------------------')}
            <h2>Total order cost: ${order.amount}<h2>
            <p>Thank your for shopping with us.</p>`
        };



          transporter
             .sendMail(emailData2)
             .then(info => console.log(`Message sent: ${info.response}`))
             .catch(err => console.log(`Problem sending email: ${err}`));
         
        res.json(data);
    });
};

exports.listOrders = (req, res) => {
    Order.find()
        .populate('user', '_id name phone address pin')
        .sort('-created')
        .exec((err, orders) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(error)
                });
            }
            res.json(orders);
        });
};

exports.getStatusValues = (req, res) => {
    res.json(Order.schema.path('status').enumValues);
};

exports.updateOrderStatus = (req, res) => {
    Order.update({ _id: req.body.orderId }, { $set: { status: req.body.status } }, (err, order) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(order);
    });
};

