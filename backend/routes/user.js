const express = require('express');
const User =  require('../models/user');
const router = express.Router();
const bcrypt = require('bcrypt');
const user = require('../models/user');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');

router.post('/signup', (req, res, next)=>{
  bcrypt.hash(req.body.password, 10).then(hash=>{
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      address: req.body.address,
      mobileNo: req.body.mobileNo,
      email: req.body.email,
      password: hash
    });
    user.save().then(result =>{
      let user = result;
      delete user.password;
      res.status(201).json({
        message:'user created',
        result: user
      });
    }).catch(err=>{
      res.status(500).json({
        message:'user not created',
        error:err
      })
    })
  })
})

router.post('/login',(req, res, next)=>{
  let fetchedUser;
  User.findOne({email: req.body.email}).then(user=>{
    console.log(user);
    if(!user) {
      return res.status(401).json({
        message: "email doesn't exist"
      });
    }
    fetchedUser = user;
    return bcrypt.compare(req.body.password, user.password);
  }).then(result=>{
    if(!result) {
      return res.status(401).json({
        message: "Authentication Failed"
      });
    }
    const token = jwt.sign({email:fetchedUser.email, userId: fetchedUser._id}, 'gxfcvhbjmlkjhfchgmvb,jkgjkftxjcgh,jgghfdjrxckvj,kgfkcjkg.iyygkfvjgbuhkluihjghjgkgtyxrsyirkdflbgu;fdsrytcuviuhy[8t786dotcgjhvjbkhiuiyodtyfhcg',
    {expiresIn: '1h'}
    );
    res.status(200).json({
      token: token
    })
  }).catch(err =>{
    return res.status(401).json({
      message: "Authentication Failed"
    });
  });
});
router.get('',(req, res, next) =>{
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const userQuery = User.find({},'-password -__v');
  let fetchedUser;
  if(pageSize && currentPage){
    userQuery.skip(pageSize* (currentPage - 1)).limit(pageSize);
  }
  userQuery.then(allUsers => {
    fetchedUser = allUsers;
    return User.count();
    }).then(count => {
      res.status(200).json({
        message:'users fetched succefully',
        fetchedUser: fetchedUser,
        maxUsers: count
      });
    });
});

router.get('/:id', checkAuth, (req, res, next) =>{
  User.findById({_id: req.params.id},'-password -__v').then(result =>{
    if(result){
      res.status(200).json(result);
    }
    else{
      res.status(404).json({message:'user not found'});
    }
  })
});

router.put('/:id', checkAuth, (req, res, next) =>{
  User.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: false}).then(result =>{
    res.status(200).json({
      message:'user updated successfully.'
    });
  })
});
module.exports = router;
