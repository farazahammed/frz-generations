import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import 'dotenv/config';

const app = express();

app.use(cors());
app.use(express.json());

app.post('/generate', async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'No content provided' });
    }

    const response = await fetch(
      'https://api.perplexity.ai/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`
        },
        body: JSON.stringify({
          model: 'sonar-pro',
          messages: [
            {
              role: 'system',
              content:
                'You are an expert teacher. Generate ONE meaningful flashcard question and a complete, clear, well-explained answer. Do not copy text verbatim.'
            },
            {
              role: 'user',
              content
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!data.choices || !data.choices.length) {
      return res.status(500).json({ error: 'Invalid AI response' });
    }

    res.json({
      result: data.choices[0].message.content
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Perplexity API failed' });
  }
});

app.get('/', (req, res) => {
  res.send('FRZ Flashcard Backend is running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`FRZ Backend running on port ${PORT}`)
);
