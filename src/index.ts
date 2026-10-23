import express, { Request, Response } from 'express';
import  router from './routes/fileHandler/storeToDb';
import {router as askQuestion} from './routes/queryQuestion';
import { router as deletecollection } from './routes/deleteCollection';
import { route as adminAuth } from './routes/adminAuth';
import { router as botRoutr } from './routes/botRoutr';
import { ensureCollection } from './lib/qdrant';
import {conectMongo} from "./db/db";
import cors from 'cors';
import { createRouteHandler } from 'uploadthing/express';
import { UploadRouter } from './routes/fileHandler/uploadFile';
import {route as ConfigROute} from "./routes/apiConfigForLlm"
import { router as botQuerySdk } from './routes/botQueryForSdk'; 
const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, RAG SERVER IS WORKING!!!');
});

// app.options("*", cors());
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://rag-frontend-three-nu.vercel.app"
  ],
  methods: "*",
  allowedHeaders:"*",
  credentials: true
}));

//file uploadthing router
app.use("/api/uploadthing",createRouteHandler({
  router:UploadRouter
}))

app.use(express.json());

app.use(("/upload"),router );
app.use(("/askai"),askQuestion);
app.use(("/deletecollection"), deletecollection);
app.use(("/admin"), adminAuth);
app.use(("/bot"), botRoutr);
app.use(("/confg") ,ConfigROute);
app.use(("/ask-bot-sdk"), botQuerySdk)

async function start(){
  await ensureCollection();
  await conectMongo();  
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

start();

export default app;   
