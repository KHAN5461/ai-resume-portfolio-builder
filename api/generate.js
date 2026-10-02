import { GoogleGenAI } from "@google/genai";
import * as admin from 'firebase-admin';

// Initialize Firebase Admin
if (!admin.apps.length) {
  let credential;
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      credential = admin.credential.cert(serviceAccount);
    } catch (e) {
      console.warn("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY as JSON. Falling back to default application credentials.");
    }
  }
  
  admin.initializeApp({
    credential: credential || admin.credential.applicationDefault(),
    projectId: process.env.VITE_FIREBASE_PROJECT_ID
  });
}
const db = admin.firestore();

const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GOOGLE_AI_API_KEY || process.env.GOOGLE_AI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const { prompt, userId } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt' });
  }

  try {
    if (userId) {
      const userRef = db.collection('users').doc(userId);
      
      // Atomic transaction for rate limiting if user doc exists
      await db.runTransaction(async (t) => {
        const doc = await t.get(userRef);
        if (doc.exists) {
          const data = doc.data();
          const isPremium = data.isPremium || false;
          const count = data.generationCount || 0;
          const limit = isPremium ? 1000 : 50;
          
          if (count >= limit) {
            throw new Error('Generation limit exceeded');
          }
          t.update(userRef, { generationCount: count + 1 });
        }
      }).catch((err) => {
        console.warn('Firestore transaction warning (proceeding):', err.message);
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    });

    const text = response.text || '';
    return res.status(200).json({ result: text, text });
  } catch (error) {
    console.error('AI Generation Error:', error);
    if (error.message === 'Generation limit exceeded') {
      return res.status(429).json({ error: 'Generation limit exceeded. Please upgrade to Pro.' });
    }
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
