import mongoose from "mongoose";

const notesSchema = new mongoose.Schema({
    username: { type: String, required: true },
    todo: [ {
        title: String,
        desc: String,
        color: String,
        index: { type: Number, min: 0 }
    } ],
    done: [ {
        title: String,
        desc: String,
        color: String,
        index: { type: Number, min: 0 }
    } ],
    doing: [ {
        title: String,
        desc: String,
        color: String,
        index: { type: Number, min: 0 }
    } ]
});

export const Notes = mongoose.model("Notes", notesSchema);