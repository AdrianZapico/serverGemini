import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({
  origin: ['https://robot-chat-questions.netlify.app/', 'http://localhost:3000'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));
app.use(express.json());

app.post('/generate', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const genAI = new GoogleGenerativeAI({ apiKey: process.env.API_KEY });
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);

    if (result?.response?.text) {
      res.json({ response: result.response.text });
    } else {
      res.status(500).json({ error: 'Invalid response from AI model' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
  
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
