import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
    user: String,
    password: String,
    mode: String
});

export const Users = mongoose.model("Users", usersSchema);