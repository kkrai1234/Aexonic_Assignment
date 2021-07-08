const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');
const app = express();
mongoose.connect('mongodb+srv://admin:Pnrv0eEr2o1sKLnD@cluster0.dg4ao.mongodb.net/myFirstDatabase?retryWrites=true&w=majority').then(()=> {
  console.log('connected to database');
})
.catch(() => {
  console.log('connection failed');
});
app.use(bodyParser.json());
app.use("/images", express.static(path.join("backend/images")));
app.use((req, res, next)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Headers', "Origin, X-Requested-With,Content-Type, Accept, Authorization");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PATCH, PUT, OPTIONS');
  next();
});
app.use('/posts', postRoutes);
app.use('/user', userRoutes);
module.exports = app;
