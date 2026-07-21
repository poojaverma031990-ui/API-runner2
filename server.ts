import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Chat API Route
  app.post('/api/chat', async (req, res) => {
    try {
      const { messages, systemInstruction, model, provider } = req.body;
      const customApiKey = req.headers['x-api-key'] as string;
      
      let apiKey = customApiKey;
      if (apiKey && apiKey.includes(',')) {
        const keys = apiKey.split(',').map(k => k.trim()).filter(Boolean);
        if (keys.length > 0) {
          apiKey = keys[Math.floor(Math.random() * keys.length)];
        }
      }

      if (provider === 'google' && !apiKey) {
        apiKey = process.env.GEMINI_API_KEY as string;
      }

      if (!apiKey && provider !== 'pollinations') {
        return res.status(401).json({ error: `No API key provided for ${provider}. Please configure it in Settings.` });
      }

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      if (provider === 'google') {
        const ai = new GoogleGenAI({ 
          apiKey,
          httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
        });

        // Convert messages to Gemini SDK format
        const contents = messages.map((m: any) => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }]
        }));

        const stream = await ai.models.generateContentStream({
          model: model,
          contents,
          config: {
            systemInstruction: systemInstruction || undefined,
          }
        });

        for await (const chunk of stream) {
          if (chunk.text) {
            res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
          }
        }
        res.write(`data: [DONE]\n\n`);
        res.end();
      } else {
        // Handle OpenAI-compatible APIs (Groq, OpenRouter)
        let baseURL = '';
        if (provider === 'groq') baseURL = 'https://api.groq.com/openai/v1/chat/completions';
        if (provider === 'openrouter') baseURL = 'https://openrouter.ai/api/v1/chat/completions';
        if (provider === 'pollinations') baseURL = 'https://text.pollinations.ai/openai';

        const openAiMessages = [];
        if (systemInstruction) {
          openAiMessages.push({ role: 'system', content: systemInstruction });
        }
        for (const m of messages) {
          openAiMessages.push({ role: m.role, content: m.content });
        }

        const fetchHeaders: any = {
          'Content-Type': 'application/json'
        };
        if (apiKey && provider !== 'pollinations') {
          fetchHeaders['Authorization'] = `Bearer ${apiKey}`;
        }
        if (provider === 'openrouter') {
          fetchHeaders['HTTP-Referer'] = 'https://aistudio.google.com';
          fetchHeaders['X-Title'] = 'Studio Pro Agent';
        }

        const fetchResponse = await fetch(baseURL, {
          method: 'POST',
          headers: fetchHeaders,
          body: JSON.stringify({
            model: model,
            messages: openAiMessages,
            stream: true
          })
        });

        if (!fetchResponse.ok) {
          const err = await fetchResponse.text();
          throw new Error(`API Error: ${fetchResponse.status} ${err}`);
        }

        const reader = fetchResponse.body?.getReader();
        if (!reader) throw new Error('No response body');
        
        const decoder = new TextDecoder('utf-8');
        let done = false;
        let buffer = '';
        
        while (!done) {
          const { value, done: readerDone } = await reader.read();
          done = readerDone;
          if (value) {
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const dataStr = line.slice(6);
                if (dataStr.trim() === '[DONE]') {
                  continue;
                }
                try {
                  const data = JSON.parse(dataStr);
                  if (data.choices && data.choices[0].delta && typeof data.choices[0].delta.content === 'string') {
                    res.write(`data: ${JSON.stringify({ text: data.choices[0].delta.content })}\n\n`);
                  }
                } catch(e) {
                  // Ignore JSON parse errors for incomplete chunks
                }
              }
            }
          }
        }
        res.write(`data: [DONE]\n\n`);
        res.end();
      }
    } catch (error: any) {
      console.error('Chat API Error:', error);
      
      let errorMessage = error.message || 'An error occurred during chat generation.';
      if (errorMessage.includes('401') || errorMessage.includes('invalid_api_key') || errorMessage.includes('Unauthorized')) {
        errorMessage = "Invalid or missing API Key. Please check your API key in the sidebar settings or switch to Google Gemini.";
      } else if (errorMessage.includes('429') || errorMessage.includes('quota') || errorMessage.includes('RESOURCE_EXHAUSTED')) {
        errorMessage = "Rate limit or quota exceeded for this model. Please try again in a moment, or switch to a different model or AI provider in the sidebar.";
      } else if (errorMessage.includes('502') || errorMessage.includes('503') || errorMessage.includes('504') || errorMessage.includes('Cloudflare')) {
        errorMessage = "The AI provider's server is currently down or experiencing issues (Bad Gateway / Timeout). Please try again later or switch to a different AI provider in the sidebar.";
      } else if (errorMessage.includes('<!DOCTYPE html>')) {
        errorMessage = "The AI provider returned an invalid HTML response. They might be experiencing downtime. Please switch to a different provider.";
      } else if (errorMessage.includes('402 Payment Required') || errorMessage.includes('deprecation_notice') || errorMessage.includes('deprecated for authenticated users')) {
        errorMessage = "This AI provider (Pollinations) is currently unavailable or deprecated. Please switch to a different AI provider like Google or Groq in the sidebar.";
      }

      if (res.headersSent) {
        res.write(`data: ${JSON.stringify({ error: errorMessage })}\n\n`);
        res.end();
      } else {
        res.status(500).json({ error: errorMessage });
      }
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
