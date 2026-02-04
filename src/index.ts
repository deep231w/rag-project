import express, { Request, Response } from 'express';
import  router from './routes/storeToDb';
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript + Express!');
});

app.use(("/upload"),router );

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

export default app;   
