// import express, { response } from 'express'
// import cors from 'cors'
// import dotenv from 'dotenv'
// import cookieParser from 'cookie-parser'
// import morgan from 'morgan'
// import helmet from 'helmet'
// import connectDB from './config/connectdb.js'
// import userRouter from './route/user.route.js'
// import categoryRouter from './route/category.route.js'
// import uploadRouter from './route/upload.router.js'
// import productRouter from './route/product.route.js'
// import cartRouter from './route/cart.route.js'
// import addressRouter from './route/address.route.js'
// import orderRouter from './route/order.route.js'


// dotenv.config()
// const app = express()
// app.use(cors({
//     credentials:true,
//     origin:process.env.FRONT_URL
// }))
// app.use(express.json())
// app.use(cookieParser())
// app.use(morgan())
// app.use(helmet({
//     crossOriginResourcePolicy:false
// }))

// const PORT = 8080 || process.env.PORT

// app.get('/',(req,res)=>{
//     res.json({
//         message:"You are on live now on arun  port "+PORT
//     })
// })

// app.use('/api/user',userRouter)
// app.use('/api/category',categoryRouter);
// app.use('/api/file',uploadRouter)
// app.use("/api/product",productRouter)
// app.use("/api/cart",cartRouter)
// app.use("/api/address",addressRouter)
// app.use("/api/order",orderRouter)



// connectDB().then(
//     ()=>{
//         app.listen(PORT,()=>{
//             console.log("Server is running");
//         })
//     }
// );
import express, { response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import helmet from 'helmet'
import connectDB from './config/connectdb.js'
import userRouter from './route/user.route.js'
import categoryRouter from './route/category.route.js'
import uploadRouter from './route/upload.router.js'
import productRouter from './route/product.route.js'
import cartRouter from './route/cart.route.js'
import addressRouter from './route/address.route.js'
import orderRouter from './route/order.route.js'
import contactRouter from './route/contact.route.js'  // Add this import


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
        message:"You are on live now on arun port "+PORT
    })
})

app.use('/api/user',userRouter)
app.use('/api/category',categoryRouter);
app.use('/api/file',uploadRouter)
app.use("/api/product",productRouter)
app.use("/api/cart",cartRouter)
app.use("/api/address",addressRouter)
app.use("/api/order",orderRouter)
app.use("/api/contact",contactRouter)  // Add this route


connectDB().then(
    ()=>{
        app.listen(PORT,()=>{
            console.log("Server is running");
        })
    }
);