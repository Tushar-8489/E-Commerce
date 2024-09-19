const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
//const mongoose = require('mongoose');
const connectDB = require('./config/db');
const authRoutes = require('./Routes/authRoutes');
const cors = require('cors');
const categoryRoutes = require('./Routes/CategoryRoute');
const productRoutes = require('./Routes/productRoutes');
const photoRoutes = require('./Routes/photoRoutes');

dotenv.config();

//database config
connectDB();

const app = express();

//middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));


//rest api
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/product', productRoutes);
app.use('/api/v1/photo', photoRoutes);





app.get('/', (req,res) => {
    res.send('<h1>Homepage</h1>');
})


const Port = process.env.PORT;

app.listen(Port, () => {
    console.log(`Server running on Port ${Port}`);
})