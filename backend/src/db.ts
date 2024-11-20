import mongoose from "mongoose";
import { Schema } from "mongoose";
import config from "./config";
mongoose.connect(config.DB_URL);

export type tUser={
    username: string;
    password: string;
}

const userSchema=new Schema<tUser>({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true}
})

export const UserModel=mongoose.model("User", userSchema)

export type tTag={
    title: string
}

const tagSchema=new Schema<tTag>({
    title: {type: String, required: true}
})

export const TagModel=mongoose.model("Tag", tagSchema)

export type tContent={
    link: string;
    type: "document" | "audio" | "image" | "link";
    title: string; 
    tags: mongoose.Types.ObjectId[];
    userId: mongoose.Types.ObjectId;
}

const contentSchema=new Schema<tContent>({
    link: String,
    type: {type: String, required: true},
    title: String,
    tags: [{type: mongoose.Types.ObjectId, ref: 'Tag'}],
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
})

export const ContentModel=mongoose.model("Content", contentSchema);

type tLink={
    hash: string;
    userId: mongoose.Types.ObjectId;
}

const linkSchema=new Schema<tLink>({
    hash: {type: String, required: true},
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}
})

export const LinkModel=mongoose.model("Link", linkSchema);