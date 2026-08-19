import { auth } from '../lib/firebaseConfig';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Caching implementation to manage AI tokens and costs
const aiCache = new Map();

// Generate a simple hash for the prompt
const hashPrompt = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash.toString();
};

export const AIChatSession = {
  sendMessage: async (prompt) => {
    const hash = hashPrompt(prompt);
    if (aiCache.has(hash)) {
      console.log("Serving AI response from cache");
      return { response: { text: () => aiCache.get(hash) } };
    }

    if (!import.meta.env.VITE_GEMINI_API_KEY) {
       console.error("VITE_GEMINI_API_KEY is not set in .env.local");
       throw new Error("Gemini API Key is missing. Please add VITE_GEMINI_API_KEY to your .env.local file.");
    }

    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      aiCache.set(hash, text);
      return { response: { text: () => text } };
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw new Error("Failed to generate content with Gemini API.");
    }
  },
  
  sendMessageStream: async (prompt) => {
    const hash = hashPrompt(prompt);
    if (aiCache.has(hash)) {
      console.log("Serving AI stream response from cache");
      const cachedText = aiCache.get(hash);
      return {
        stream: (async function* () {
          yield { text: () => cachedText };
        })()
      };
    }
    
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
       throw new Error("Gemini API Key is missing.");
    }

    try {
      const result = await model.generateContentStream(prompt);
      
      // We will intercept the stream to cache the final combined text
      let fullText = '';
      
      const interceptStream = async function* () {
         for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            fullText += chunkText;
            yield chunk;
         }
         aiCache.set(hash, fullText);
      };

      return {
        stream: interceptStream()
      };
    } catch (error) {
      console.error("Gemini API Streaming Error:", error);
      throw new Error("Failed to generate streaming content.");
    }
  },
  
  cacheResult: (prompt, finalResult) => {
    const hash = hashPrompt(prompt);
    aiCache.set(hash, finalResult);
  }
};
