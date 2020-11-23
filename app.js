const express=  require('express');
const app =  express();
const morgan =  require('morgan'); //logging req
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const expressValidator = require('express-validator'); //server side validation
const dotenv = require('dotenv');
// import routes
const  authRoutes = require('./routes/auth');
const  userRoutes = require('./routes/user');
const  categoryRoutes = require('./routes/category');
const  brandRoutes = require('./routes/brand');
const  pcRoutes = require('./routes/pc');
const  hairRoutes = require('./routes/hair');

const  productRoutes = require('./routes/product');
const  braintreeRoutes = require('./routes/braintree');
const  orderRoutes = require('./routes/order');
const contactRoutes = require('./routes/contact');

// import mongoose
const mongoose = require('mongoose');
// load env variables

dotenv.config()
 
//db connection
mongoose.connect(
  process.env.MONGO_URI,
  {useNewUrlParser: true,
   useUnifiedTopology: true ,
   useCreateIndex: true
  })
.then(() => console.log('DB Connected now'))
 
mongoose.connection.on('error', err => {
  console.log(`DB connection error: ${err.message}`)
});

// middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());

//routes middleware
app.use("/api",authRoutes);
app.use("/api",userRoutes);
app.use("/api",categoryRoutes);
app.use("/api",brandRoutes);
app.use("/api",pcRoutes);
app.use("/api",hairRoutes);
//app.use("/api",skinRoutes);
app.use("/api",productRoutes);
app.use("/api",braintreeRoutes);
app.use("/api",orderRoutes);
app.use("/api",contactRoutes);


const port = process.env.PORT || 5000;

app.listen(port,() => {
    console.log(`Server is listening to port ${port}`);

});

