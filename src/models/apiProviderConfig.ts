import mongoose from "mongoose";


const apiProviderSchema = new mongoose.Schema(
    {
        adminId:{type:String ,require:true ,  unique:true},

        llmProvider:{
            type:String ,
            enum: ["gemini", "openai", "ollama"],
            require :true
        },
        llmApiKey:{type:String , require :true},
        llmModel:{type:String , require: true},

        embeddedProvider:{
            type:String ,
            enum: ["gemini", "openai", "ollama"],
            require :true
        },
        embeddedApiKey:{type:String , require :true},
        embeddedModel:{type:String , require: true},
    },
    {timestamps:true}
)

export const ApiProviderConfig= mongoose.model("ApiProviderConfig", apiProviderSchema);