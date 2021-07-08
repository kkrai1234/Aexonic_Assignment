const express = require('express');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const router = express.Router();
const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};
const storage = multer.diskStorage({
  destination: (req, file, cb)=> {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('invalid Mime Type');
    if(isValid){
      error = null
    }
    cb(null, "backend/images");
  },
  filename:(req, file, cb)=>{
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name+'-'+Date.now()+'.'+ext);
  }
});
const Post = require('../models/post');
router.post('', checkAuth,
 multer({storage: storage}).single("image"), (req, res, next) => {
  const url = req.protocol + '://'+req.get("host");
  const post = new Post({
    title: req.body.title,
    description: req.body.description,
    imagePath: url+'/images/'+ req.file.filename
  });
  post.save().then(createdPost =>{
    res.status(201).json({
      message:'Post Added successfully',
      post: {
        id: createdPost._id,
        title: createdPost.title,
        description: createdPost.description,
        imagePath: createdPost.imagePath
      }
    });
  });
})
router.get('',(req, res, next) =>{
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if(pageSize && currentPage){
    postQuery.skip(pageSize* (currentPage - 1)).limit(pageSize);
  }
  postQuery.then(allPosts => {
    fetchedPosts = allPosts;
    return Post.count();
    }).then(count => {
      res.status(200).json({
        message:'posts fetched succefully',
        posts: fetchedPosts,
        maxPosts: count
      });
    });
});

router.put('/:id', checkAuth, multer({storage: storage}).single("image"), (req, res, next) =>{
  let imagePath = req.body.imagePath;
  if(req.file){
    const url = req.protocol + '://'+req.get("host");
    imagePath = url+'/images/'+ req.file.filename
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    description: req.body.description,
    imagePath: imagePath
  })
  Post.updateOne({_id: req.params.id}, post).then(result =>{
    res.status(200).json({
      message:'post updated successfully.'
    });
  })
});

router.get('/:id', (req, res)=>{
  Post.findById({_id: req.params.id}).then(post=>{
    if(post){
      res.status(200).json(post);
    }
    else{
      res.status(404).json({message:'post not found'});
    }
  });
});

router.delete('/:id', checkAuth, (req, res)=>{
  Post.deleteOne({_id: req.params.id}).then(postDeleted =>{
    res.status(200).json({
      message:'post deleted successfully.'
    });
  });
});

module.exports = router;
