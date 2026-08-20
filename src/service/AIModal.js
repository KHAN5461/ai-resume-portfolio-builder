import { auth } from '../lib/firebaseConfig';
import { GoogleGenerativeAI } from '@google/generative-ai';

const getModelForKeyType = (keyType) => {
  let apiKey = import.meta.env.VITE_GEMINI_API_KEY; // Default fallback

  if (keyType === 'portfolio' && import.meta.env.VITE_GEMINI_PORTFOLIO_API_KEY) {
    apiKey = import.meta.env.VITE_GEMINI_PORTFOLIO_API_KEY;
  } else if (keyType === 'resume' && import.meta.env.VITE_GEMINI_RESUME_API_KEY) {
    apiKey = import.meta.env.VITE_GEMINI_RESUME_API_KEY;
  }

  if (!apiKey) {
    throw new Error(`Gemini API Key is missing for context: ${keyType}. Please check your .env.local file.`);
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
};

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
  sendMessage: async (prompt, keyType = 'default') => {
    const hash = hashPrompt(prompt);
    if (aiCache.has(hash)) {
      console.log("Serving AI response from cache");
      return { response: { text: () => aiCache.get(hash) } };
    }

    if (keyType === 'routing') {
      const openRouterKey = import.meta.env.VITE_OPENROUTER_API_KEY;
      if (!openRouterKey) {
        throw new Error("OpenRouter API Key is missing for routing. Please add VITE_OPENROUTER_API_KEY to your .env.local file.");
      }
      try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${openRouterKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "nvidia/nemotron-3.5-lightning:free",
            messages: [{ role: "user", content: prompt }]
          })
        });
        
        if (!response.ok) {
           const errData = await response.json();
           throw new Error(errData.error?.message || "OpenRouter API error");
        }
        
        const data = await response.json();
        const text = data.choices[0].message.content;
        aiCache.set(hash, text);
        return { response: { text: () => text } };
      } catch (error) {
        console.error("OpenRouter API Error:", error);
        throw new Error("Failed to generate content with OpenRouter API (Nemotron).");
      }
    }

    try {
      const model = getModelForKeyType(keyType);
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      aiCache.set(hash, text);
      return { response: { text: () => text } };
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw new Error(`Failed to generate content with Gemini API (${keyType} key).`);
    }
  },
  
  sendMessageStream: async (prompt, keyType = 'default') => {
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

    try {
      const model = getModelForKeyType(keyType);
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
