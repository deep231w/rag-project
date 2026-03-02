import mongoose from "mongoose";

const botSchema= new mongoose.Schema(
    {
        name:{type:String , required:true},
        adminId:{type:String, required:true},
    },
    {timestamps:true}
)

botSchema.index({name:1, adminId:1},{unique:true});


export const Bot= mongoose.model("Bot",botSchema);