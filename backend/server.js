require('dotenv').config()  
const express = require('express');
const cors = require('cors');
const connectDB = require('./db'); // <-- Import DB connection
var bodyparser = require('body-parser');

const app = express();
//app.use(bodyparser.json());
//app.use(express.json());
//app.use(express.urlencoded({ extended: true }));

app.use(bodyparser.json({ limit: '10mb' }));
app.use(bodyparser.urlencoded({ limit: '10mb', extended: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors());

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const googleAuthRoutes = require('./routes/authRoutes');


app.use('/api', authRoutes); 
app.use('/api', productRoutes);
app.use('/api', orderRoutes);
app.use('/api', adminRoutes);
app.use('/uploads', express.static('uploads')); 
app.use("/", googleAuthRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
  connectDB(); 
});