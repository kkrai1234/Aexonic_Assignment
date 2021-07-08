const jwt = require('jsonwebtoken');



module.exports = (req, res, next) =>{
  try{
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, 'gxfcvhbjmlkjhfchgmvb,jkgjkftxjcgh,jgghfdjrxckvj,kgfkcjkg.iyygkfvjgbuhkluihjghjgkgtyxrsyirkdflbgu;fdsrytcuviuhy[8t786dotcgjhvjbkhiuiyodtyfhcg');
    next();
  } catch(error){
    res.status(401).json({ message:"Authentication failed"});
  }
};
