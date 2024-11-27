import express from "express";
import {Request, Response} from "express"
import jwt from "jsonwebtoken";
import {UserModel, ContentModel, LinkModel, tUser, TagModel} from "./db";
import {z} from "zod";
import { createHash } from 'crypto';
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

app.get("/api/v1/tags", auth, async(req: Request, res: Response)=>{
    try{
        const tags=await TagModel.find().select("title")
        res.json(tags)
    }catch(e){
        console.log("Error getting tags", e)
        res.json({
            message: "Tags Server Error"
        })
    }
})

app.post("/api/v1/content", auth, async(req: Request, res: Response)=>{
    const { link, type, title, tags } = req.body;
    try{
        if (tags){
            for (let tag of tags){
                const existingTag=await TagModel.findOne({title: tag})
                if (!existingTag){
                    const newTag=new TagModel({title: tag})
                    await newTag.save();
                }
            }
        }
        await ContentModel.create({
            link,
            type, 
            title,
            userId: (req as any).userId,
            tags: tags
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
        res.status(500).json({
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
        res.status(500).json({
            message: "Server Delete Error"
        })
    }
})

app.post("/api/v1/brain/share", auth, async(req: Request, res: Response)=>{
    const userId=(req as any).userId
    const { share }=req.body;
    try{
        let isLink= await LinkModel.findOne({
            userId: userId,
        })
        if (share){
            if (!isLink){
                const hash=createHash('sha-256').update(userId).digest('hex');
                isLink=await LinkModel.create({
                    hash: hash,
                    userId: userId,
                    share: true,
                })
                return;
            }else{
                isLink.share=true;
                await isLink.save()
            }
            res.json({
                message:"Shareable link created",
                link: `http://localhost:${config.PORT}/api/v1/brain/${isLink.hash}`
            }) 
        }else{
            if (isLink){
                isLink.share=false;
                await isLink.save();
                res.json({
                    message: "Shareable Link Disabled"
                })
            }else{
                res.status(411).json({
                    message : "No shareable Link found"
                })
            }
        }
    }catch(e){
        console.log("Error creating Link", e);
        res.status(500).json({
            message: "Server Error Creating/Updating Link"
        })
    }
})

app.get("/api/v1/brain/:shareLink", async(req: Request, res: Response)=>{
    const shareLink=req.params.shareLink;
    try{
        const link=await LinkModel.findOne({ hash: shareLink }).populate("userId");
        if (!link || !link.share){
            res.json({
                message: "Invalid or Unauthorized"
            })
            return;
        }
        const user=link.userId as tUser;
        const content=await ContentModel.find({userId: link.userId});
        res.json({
            username: user.username,
            content: content.length?content : []
        })

    }catch(e){
        console.log("Error accessing Link Content", e);
        res.status(500).json({
            message: "Server Error accessing Link Content"
        })
    }
})

app.listen(config.PORT);