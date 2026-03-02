import express, { Request, Response } from 'express';
import  router from './routes/storeToDb';
import {router as askQuestion} from './routes/queryQuestion';
import { router as deletecollection } from './routes/deleteCollection';
import { route as adminAuth } from './routes/adminAuth';
import { ensureCollection } from './lib/qdrant';
import { json } from 'node:stream/consumers';
import {conectMongo} from "../src/db/db";

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript + Express!');
});

app.use(express.json());
app.use(("/upload"),router );
app.use(("/ask"),askQuestion);
app.use(("/deletecollection"), deletecollection);
app.use(("/admin"), adminAuth);

async function waitforEnsureCollection(retries=10) {
  for(let i=0; i<retries; i++){
    try{
      await ensureCollection();
      return;
    }catch(e){
      console.log("waiting for qdrant ensulecollection ...")
      await new Promise(r=> setTimeout(r, 2000));
    }
    console.log("collection ensured");

  }
}

async function start(){
  await waitforEnsureCollection();
  await conectMongo();
  
  app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
}

start();

export default app;   
