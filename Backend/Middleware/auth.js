const jwt=require("jsonwebtoken");
require('dotenv').config()

const auth=async(req,res,next)=>{
    const token=req.headers.authorization;

    if(!token){
        return res.status(401).send({error:"Unauthorized, Please Login"})
    }
    try{
        const decoded=jwt.verify(token,process.env.KEY);
        if(decoded){
             req.user={userId:decoded.userId,userType:decoded.userType};
          
            next()
        }
       
    }catch(err){
        return res.status(401).send({error:"Unauthorized error, Please Login"})
    }
}

module.exports={
    auth
}