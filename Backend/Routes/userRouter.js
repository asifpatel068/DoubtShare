const express=require("express")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken");
const { UserModel } = require("../Model/User.Model");
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
            res.status(201).send({messege:"User Register Successfully"})
        })

    }catch(err){
        res.status(500).send({error:err.messege})
    }
})

userRouter.post("/login",async(req,res)=>{
    try{
        const {email,password}=req.body;

        const User=await UserModel.findOne({email});
        
        if(User==null){
            return res.status(400).send({error:"User Doesn't Exits"})
        }
        const hashedpass=User?.password
        bcrypt.compare(password,hashedpass,async(err,result)=>{
            if(err){
                return res.status(400).send({error:err.message})
            }
            if(!result){
                return res.status(400).send({error:"Wrong Credentials"})
            }
            
            const token=jwt.sign({userId:User._id,userType: User.userType},process.env.KEY);

            res.status(201).send({messege:"User login Successfully",token})
        })

    }catch(err){
        res.status(500).send({error:err})
    }
})


module.exports={
    userRouter
}