import mongoose from "mongoose";
import { Users } from "./usersModel.js";
import { Notes } from "./notesModel.js";


export const connectToDB = async () => {
    try {
        await mongoose.connect(
            "mongodb://www:cs144@localhost:27017/project4?authSource=admin"
        );
        console.log("Successfully connected to MongoDB");
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
}

export const authenticate = async (username, password) => {
    console.log(username, password);
    return await Users.findOne({
        user: username,
        password: password 
    }).then(users => {
        console.log(users);
        if (users) {
            console.log("found a matching user!");
            return true;
        }
        else {
            console.log("found no matching users");
            return false;
        }
    }).catch(err => {
        console.error(err);
        return false;
    })
}

export const checkCookie = async (username) => {
    console.log(username);
    return await Users.findOne({
        user: username,
    }).then(users => {
        console.log(users);
        if (users) {
            console.log("found a matching user!");
            return true;
        }
        else {
            console.log("found no matching users");
            return false;
        }
    }).catch(err => {
        console.error(err);
        return false;
    });
}

export const getCards = async (username) => {
    return await Notes.findOne({ 
        username: username
    }).then(notes => {
        return notes;
    }).catch(err => {
        console.log(err);
    });
}

export const saveCards = async (username, todo, doing, done) => {
    await Notes.replaceOne(
        {username: username},
        {
            username: username,
            todo: todo,
            doing: doing,
            done: done
        },
        {upsert: true, strict: true}
    ).then((res) => {
        console.log(res);
    }).catch((err) => {
        console.log(err);
    });
}