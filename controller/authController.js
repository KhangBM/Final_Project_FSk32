import Users from "../models/UserModel.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { handleResponseError, handleResponseSuccess } from "../utils/responses.js"

const generateAccessToken = (user) => {
    return jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET_KEY, {
        expiresIn: '1d',
    })
}

// Register
const register = async (req, res) => {
    const { email, password } = req.body
    if(!email || !password){
        handleResponseError(res, 400, "Bad request. All field are required")
        return
    }
    const existedEmail = await Users.findOne({email})
    if (existedEmail) {
        handleResponseError(res, 400, "Email has already existed")
        return
    }
    const saltRound = 10
    const hashedPassword = await bcrypt.hash(password, saltRound)
    const newUser = await Users.create({email, password: hashedPassword})
    console.log("newUser", newUser)
    handleResponseSuccess(res, 201, "Register successfully", {
        email,
        role: newUser?.role,
    })
}

// Login
const login = async (req, res) => {
    const { email, password } = req.body
    if(!email || !password) {
        handleResponseError(res, 400, "Bad request. All field are required")
        return
    }
    const checkEmailUser = await Users.findOne({email})
    console.log("checkEmailUser", checkEmailUser)
    if(!checkEmailUser){
        handleResponseError(res, 401, "Email is incorrect")
        return
    }
    const checkPasswordUser = await bcrypt.compare(password, checkEmailUser.password)
    if(!checkPasswordUser) {
        handleResponseError(res, 401, "Password is incorrect")
        return
    }
    const accessToken = generateAccessToken(checkEmailUser)
    handleResponseSuccess(res, 200, "Login successfully", {
        email,
        role: checkEmailUser?.role,
        accessToken,
    })
}

// Logout
const logout = (req, res) => {
    handleResponseSuccess(res, 200, "Logout")
}

export { register, login, logout }