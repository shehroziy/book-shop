import { Router } from "express"
import User from '../models/User.js'
import bcrypt from "bcrypt"
const router = Router()

router.get("/login", (req, res)=>{
    res.render("login", {
        title: "Login",
        isLogin: true,
        loginError: req.flash("loginError")
    })
})

router.get("/register", (req, res)=>{
    res.render("register", {
        title: "Register",
        isRegister: true,
        registerError: req.flash("registerError")
    })
})

router.post("/login",  async (req, res)=>{
    const {email, password} = req.body

    if(!email || !password){
        req.flash("loginError", "All fields require")
        res.redirect("/login")
        return
    }

    const existUser = await User.findOne({email})
    if(!existUser) {
        req.flash("User not found")
        res.redirect("/login")
        return
    }

    const isPassEqual = await bcrypt.compare(password, existUser.password)
    if(!isPassEqual) {
        req.flash("loginError", "password wrong")
        res.redirect("/login")
        return
    }
    console.log(existUser);
    res.redirect("/")
})

router.post("/register", async (req, res)=>{
    const {firstname, lastname, email, password} = req.body
    if(!firstname || lastname || !email || !password){
        req.flash("registerError", "All fields require")
        res.redirect("/register")
        return
    }

    const candidate = await User.findOne({email})

    if(candidate){
        req.flash("registerError", "User already exist")
        res.redirect("/register")
        return
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    console.log(req.body);
    const userData ={
        firstName: firstname,
        lastName: lastname,
        email: email,
        password: hashedPassword
    }

    const user = await User.create(userData)
    // console.log(userData);
    res.redirect("/")
})

export default router