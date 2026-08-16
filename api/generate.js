import { GoogleGenerativeAI } from "@google/generative-ai";
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

const apiKey = process.env.VITE_GOOGLE_AI_API_KEY || process.env.GOOGLE_AI_API_KEY;
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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const { prompt, userId } = req.body;

  if (!prompt || !userId) {
    return res.status(400).json({ error: 'Missing prompt or userId' });
  }

  try {
    const userRef = db.collection('users').doc(userId);
    
    // Atomic transaction for rate limiting
    let isPremium = false;
    await db.runTransaction(async (t) => {
      const doc = await t.get(userRef);
      if (!doc.exists) {
        throw new Error('User not found');
      }
      
      const data = doc.data();
      isPremium = data.isPremium || false;
      const count = data.generationCount || 0;
      
      // Limit Free users to 10 generations, Pro users to 1000
      const limit = isPremium ? 1000 : 10;
      
      if (count >= limit) {
        throw new Error('Generation limit exceeded');
      }
      
      t.update(userRef, { generationCount: count + 1 });
    });

    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    const result = await chatSession.sendMessage(prompt);
    const text = result.response.text();

    return res.status(200).json({ result: text });
  } catch (error) {
    console.error('AI Generation Error:', error);
    if (error.message === 'Generation limit exceeded') {
      return res.status(429).json({ error: 'Generation limit exceeded. Please upgrade to Pro.' });
    }
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
