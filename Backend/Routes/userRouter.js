const express=require("express")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken");
const { UserModel } = require("../Model/User.Model");
const TutorAvailability = require('../Model/TutorAvailability');
const { auth } = require("../Middleware/auth");

require('dotenv').config()

const userRouter=express.Router();

userRouter.post("/register",async(req,res)=>{
    try{
        const {name,email,password, userType, language, subject, classGrade}=req.body;

        const exitsUser=await UserModel.findOne({email});
        if(exitsUser){
            return res.status(400).send({message:"Email Already Exits"})
        }
        bcrypt.hash(password,5,async(err,hash)=>{
            if(err){
                return res.status(400).send({error:err.message})
            }
            const user=new UserModel({name,email,password:hash, userType, language, subject, classGrade})

            await user.save()
            res.status(201).send({message:"User Register Successfully"})
        })

    }catch(err){
        res.status(500).send({error:err.message})
    }
})

userRouter.post("/login",async(req,res)=>{
    try{
        const {email,password}=req.body;

        const User=await UserModel.findOne({email});
        
        if(User==null){
            return res.status(400).send({message:"User Doesn't Exits"})
        }
        const hashedpass=User?.password
        bcrypt.compare(password,hashedpass,async(err,result)=>{
            if(err){
                return res.status(400).send({error:err.message})
            }
            if(!result){
                return res.status(400).send({message:"Wrong Credentials"})
            }
            
            const token=jwt.sign({userId:User._id,userType: User.userType},process.env.KEY);

            res.status(201).send({message:"User login Successfully",token,userId:User._id,userType: User.userType})
        })

    }catch(err){
        res.status(500).send({error:err})
    }
})

userRouter.get("/all",async(req,res)=>{
    try {
      
        const users = await UserModel.find()
    
        res.json(users);
      } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
      }
})

userRouter.get("/one",auth, async(req,res)=>{
    try {
      
        const userId = req.user.userId; 
 
        const user = await UserModel.findById(userId)
    
        res.json(user);
      } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
      }
})

userRouter.get("/online",async(req,res)=>{
    try {

        const users = await TutorAvailability.find()
    
        res.json(users);
      } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
      }
})

module.exports={
    userRouter
}