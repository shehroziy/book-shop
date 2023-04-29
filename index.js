import express from "express"
import {create } from 'express-handlebars';
import mongoose from "mongoose";
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import ProductsRoutes from "./routes/products.js"
import AuthRoutes from "./routes/auth.js"


dotenv.config()

const app = express()

const hbs = create({defaultLayout: "main", extname: "hbs"});

// Register `hbs.engine` with the Express app.
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', './views');
app.use(express.urlencoded({extended: true}))
app.use(express.static("public"))
app.use(express.json())

app.use(ProductsRoutes)
app.use(AuthRoutes)

const startApp = ()=>{
    try{
        mongoose.set("strictQuery", false)
        mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true}, console.log("mongodb connect"));
        
        const PORT = process.env.PORT || 4000
        
        app.listen(PORT, ()=> console.log(`server is connect port ${PORT}`))

    } catch (error){
        console.log(error);
    }
}

startApp()