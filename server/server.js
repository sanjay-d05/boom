require('dotenv').config() ;
const mongoose = require('mongoose') ;
const cookieParser = require('cookie-parser') ;
const express = require('express') ;

const app = express() ;

// database connection
const mongo_uri = process.env.MONGO_URI ;

mongoose.connect(mongo_uri)
.then(() => {
    console.log('Database Connection is Successful !');
})
.catch((err) => {
    console.log('Database Connection Failed' , err);
})

// routes
app.use(express.json()) ;
app.use(cookieParser()) ;
app.use(express.urlencoded({extended:false})) ;

app.use('/' , require('./routes/authRoutes')) ;

// port connection
const port = process.env.PORT ;

app.listen(port , () => {
    console.log(`Server is running on port ${port}`);
})