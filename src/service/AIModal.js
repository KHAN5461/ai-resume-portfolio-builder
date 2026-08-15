import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GOOGLE_AI_API_KEY;

if (!apiKey) {
    console.warn("VITE_GOOGLE_AI_API_KEY is not defined in the environment variables.");
}

const genAI = new GoogleGenerativeAI(apiKey || "DUMMY_KEY");

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
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

const _AIChatSession = model.startChat({
  generationConfig,
  history: [],
});

export const AIChatSession = {
  sendMessage: async (prompt) => {
    const hash = hashPrompt(prompt);
    if (aiCache.has(hash)) {
      console.log("Serving AI response from cache");
      return { response: { text: () => aiCache.get(hash) } };
    }
    const result = await _AIChatSession.sendMessage(prompt);
    const text = result.response.text();
    aiCache.set(hash, text);
    return result;
  },
  sendMessageStream: async (prompt) => {
    // For streaming, we could cache the final result, but streaming is complex to mock.
    // So we just pass it through, or return a fake stream if cached.
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
    
    const result = await _AIChatSession.sendMessageStream(prompt);
    
    // We can't easily intercept the stream here without breaking it, 
    // so we'll let the caller handle it and maybe cache it if needed.
    // For simplicity, we just return the real stream.
    return result;
  },
  // Provide a method to manually cache a streamed result once complete
  cacheResult: (prompt, finalResult) => {
    const hash = hashPrompt(prompt);
    aiCache.set(hash, finalResult);
  }
};
