import mongoose from "mongoose";

const botSchema= new mongoose.Schema(
    {
        name:{type:String , required:true},
        adminId:{type:String, required:true},
        files:[
            {
                name:{type:String , require:true},
                url:{type:String ,require:true},
                type:String,
                uploadedAt:{type:Date ,default :Date.now()}
            }
        ]
    },
    {timestamps:true}
)

botSchema.index({name:1, adminId:1},{unique:true});


export const Bot= mongoose.model("Bot",botSchema);