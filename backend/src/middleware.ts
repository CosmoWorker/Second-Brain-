import { NextFunction, Request, Response } from "express";
import jwt, { decode } from "jsonwebtoken";
import  config from './config'

export const auth=(req: Request, res: Response, next: NextFunction)=>{
    const token=req.headers.authorization;
    if (!token){
        return res.status(401).json({
            message: "Unauthorized"
        })   
    }
    try{
        const decoded=jwt.verify(token, config.SECRET_KEY) as {id: string};
        (req as any).userId=decoded.id;
        next();

    }catch(e){
        res.status(403).json({
            message: "Invalid token"
        })
    }
}