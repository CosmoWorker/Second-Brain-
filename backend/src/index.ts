import express from "express";
import mongoose from "mongoose";
import {Request, Response} from "express"
import jwt from "jsonwebtoken";
import {UserModel, ContentModel} from "./db";
import {z} from "zod";
import bcrypt from "bcrypt";
import {auth} from "./middleware";
import config from './config'

const app=express();
app.use(express.json());

app.post("/api/v1/signup", async(req: Request, res: Response)=>{

    const reqUserBody=z.object({
        // email: z.string().min(6).max(100).email("Invalid Email Addresss"),
        username: z.string().min(3, "Name must be valid"),
        password: z.string().min(6, "Must be atleast 6 characters")
                    .regex(/[A-Z]/, {message: "Password must contain atleast 1 uppercase character"})
                    .regex(/[\W_]/, {message: "Password must contain atleast 1 special character"})
    })

    const parseData=reqUserBody.safeParse(req.body);

    if (parseData.success){
        const { username, password}=parseData.data;
        try{
            const hashedPassword=await bcrypt.hash(password, 5);
            await UserModel.create({
                // email: email,
                username: username,
                password: hashedPassword
            })
        
            res.json({
                message: "User Signed up"
            })
        }catch(e){
            res.status(411).json({
                message: "User already exists"
            })
        }
    }else{
        console.log("Validation errors in signup: ", parseData.error.errors)
    }
})

app.post("/api/v1/signin", async(req: Request, res: Response)=>{
    const username=req.body.username;
    const password=req.body.password;
    const existingUser=await UserModel.findOne({
        username
    })

    if (existingUser){
        try{
            const hashPass=existingUser.password
            const passCheck=await bcrypt.compare(password, hashPass)
            if (passCheck){
                const token=jwt.sign({
                    id: existingUser._id
                }, config.SECRET_KEY)
                res.json({
                    message: "User signed in",
                    token: token
                })
            }else{
                res.status(411).json({
                    message: "Incorrect credentials"
                })
            }
        }catch(e){
            console.log("Error comparing passwords", e);
        }
    }else{
        res.json({  
            message: "Error in signin"
        })
    }
    
})
app.post("/api/v1/content", auth, async(req: Request, res: Response)=>{
    const { link, type, title } = req.body;
    try{
        await ContentModel.create({
            link,
            type, 
            title,
            userId: (req as any).userId,
            tags: []
        })
        res.json({
            message: "Content  Added"
        })
    }catch(e){
        console.log("Error creating content");
        res.json({
            message: "Content Server Error"
        })
    }
})

app.get("/api/v1/content",  auth, async(req:Request, res: Response)=>{
    //@ts-ignore
    const userId=req.userId;
    try{
        const content=await ContentModel.find({
            userId: userId
        }).populate("userId", "username")
        res.json({
            content
        })
    }catch(e){
        console.log("Error getting Content", e);
        res.json({
            message: "Server Error: Getting Content "
        })
    }
})

app.delete("/api/v1/content", auth,async(req: Request, res: Response)=>{
    
})

app.post("/api/v1/brain/share", (req, res)=>{
    
})

app.get("/api/v1/brain/:shareLink", (req, res)=>{
    
})

app.listen(3000);