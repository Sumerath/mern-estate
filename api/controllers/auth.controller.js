import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';


export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashedPassword});
    try {
        await newUser.save()
        res.status(201).json('User created successfully!');
    } catch (error) {
        next(error);
    }
};

export const signin = async (req, res, next) => {
    const { email , password} = req.body; 
    try {
        //checking if the email exists in the database
        const validUser = await User.findOne({ email });
        if (!validUser) return next(errorHandler(404, 'User not found!')); 
        //checking and comparing the hashed password to the normal password in SignIn page
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) return next(errorHandler(401, 'Wrong credentials!'));
        //creating a token to authenticate the user by creating a cookie
        const token = jwt.sign( {id: validUser._id} , process.env.JWT_SECRET )
        //removing password from the details
        const { password : pass, ...rest} = validUser._doc;
        //saving the token as cookie
        res.cookie('access_token', token, { httpOnly: true }).status(200).json(rest);
    }
    catch (error) {
        next(error);
    }
}