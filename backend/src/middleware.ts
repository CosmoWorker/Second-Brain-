import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import  config from './config'

export const auth=(req: Request, res: Response, next: NextFunction):void=>{
    const token=req.headers.authorization;
    if (!token){
        res.status(401).json({
            message: "Unauthorized"
        })
        return;
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