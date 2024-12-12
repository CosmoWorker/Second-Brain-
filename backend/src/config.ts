import dotenv from 'dotenv'
dotenv.config()

type config=Record<'PORT'|'DB_URL'|'SECRET_KEY', string>

if (!process.env.PORT || !process.env.DB_URL || !process.env.SECRET_KEY){
    throw new Error("Environment variables might be empty")
}

const config: config={
    PORT: process.env.PORT,
    DB_URL: process.env.DB_URL,
    SECRET_KEY: process.env.SECRET_KEY
}

export default config;