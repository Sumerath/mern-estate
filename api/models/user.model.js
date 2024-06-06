import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
//record time of creation of user and update of user. Can be used to sort
}, { timestamps: true  }); 

const User = mongoose.Model('User', userSchema);

export default User;