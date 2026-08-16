import { auth } from '../lib/firebaseConfig';

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

    const userId = auth.currentUser?.uid;
    if (!userId) {
      throw new Error("User must be logged in to generate content.");
    }

    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt, userId })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to generate content');
    }

    const text = data.result;
    aiCache.set(hash, text);
    return { response: { text: () => text } };
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
    
    // We lost true streaming by moving to the Vercel serverless function, 
    // so we mock a fast stream that just yields the full text at once.
    const userId = auth.currentUser?.uid;
    if (!userId) {
      throw new Error("User must be logged in to generate content.");
    }

    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt, userId })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to generate content');
    }

    const text = data.result;
    aiCache.set(hash, text);

    return {
      stream: (async function* () {
        yield { text: () => text };
      })()
    };
  },
  cacheResult: (prompt, finalResult) => {
    const hash = hashPrompt(prompt);
    aiCache.set(hash, finalResult);
  }
};
