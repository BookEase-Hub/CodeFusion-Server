import express from 'express';
import cors from 'cors';
import commandRoutes from './routes/commandRoutes';

const app = express();
app.use(cors({
  origin: "https://code-fusion-ai-assistant-n9oa.vercel.app",
  credentials: true
}));
app.use(express.json());

app.use('/api', commandRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
