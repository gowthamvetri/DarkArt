import express, { response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import helmet from 'helmet'
import connectDB from './config/connectdb.js'
import userRouter from './route/user.route.js'
import categoryRouter from './route/category.route.js'
import upload from './middleware/multer.js'
import uploadRouter from './route/upload.router.js'
import subCategoryRouter from './route/subCategory.route.js'

dotenv.config()
const app = express()
app.use(cors({
    credentials:true,
    origin:process.env.FRONT_URL
}))
app.use(express.json())
app.use(cookieParser())
app.use(morgan())
app.use(helmet({
    crossOriginResourcePolicy:false
}))

const PORT = 8080 || process.env.PORT

app.get('/',(req,res)=>{
    res.json({
        message:"You are on live now on arun  port "+PORT
    })
})

app.use('/api/user',userRouter)
app.use('/api/category',categoryRouter);
app.use('/api/file',uploadRouter)
app.use("/api/subcategory",subCategoryRouter)


connectDB().then(
    ()=>{
        app.listen(PORT,()=>{
            console.log("Server is running");
        })
    }
);