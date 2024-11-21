import express from "express";
import mongoose from "mongoose";
import {Request, Response} from "express"
import jwt from "jsonwebtoken";
import {UserModel, ContentModel, LinkModel} from "./db";
import {z} from "zod";
import bcrypt from "bcrypt";
import {auth} from "./middleware";
import config from './config'

const app=express();
app.use(express.json());

app.post("/api/v1/signup", async(req: Request, res: Response)=>{

    const reqUserBody=z.object({
        // email: z.string().min(6).max(100).email("Invalid Email Addresss"),
        username: z.string().min(3, "username must be atleast 3 characters").max(10, "username cannot be more than 10 characters"),
        password: z.string().min(8, "Must be atleast 6 characters").max(20, "Password cannot be more than 20 characters")
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
    const userId=(req as any).userId;
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
            message: "Server Error: Getting Content"
        })
    }
})

app.delete("/api/v1/content", auth, async(req: Request, res: Response)=>{
    const contentId=req.body.contentId;
    const userId=(req as any).userId;
    try{
        const content=await ContentModel.findOneAndDelete({
            _id: contentId,
            userId: userId,
        })
        
        if (!content){
            res.status(403).json({
                message: "Cannot Delete, Content not found or unauthorized"
            })
        }else{
            res.json({
                message: "Deleted!"
            })
        }
    }catch(e){
        console.log("Error deleting", e);
        res.json({
            message: "Server Delete Error"
        })
    }
})

app.post("/api/v1/brain/share", auth, async(req: Request, res: Response)=>{
    const userId=(req as any).userId
    const contentId=req.body.contentId;
    try{
        const content=await ContentModel.findById({
            userId: userId
        })
        if (!content){
            res.status(411).json({
                message: "Content Not found or unauthorized"
            })
        }else{
            let isLink=await LinkModel.findOne({
                userId: userId,
            })
            if (!isLink){
                isLink=await LinkModel.create({
                    hash: 
                    userId: userId,
                })
            }
        }
    }catch(e){

    }

    
})

app.get("/api/v1/brain/:shareLink", async(req: Request, res: Response)=>{
    
})

app.listen(3000);