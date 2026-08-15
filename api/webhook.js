import Stripe from 'stripe';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const firebaseApp = initializeApp({
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
});
const db = getFirestore(firebaseApp);

async function buffer(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const rawBody = await buffer(req);
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.client_reference_id || session.metadata?.userId;
        const plan = session.metadata?.plan || 'pro';
        
        if (userId) {
          const userRef = doc(db, 'users', userId);
          await updateDoc(userRef, {
            isPremium: true,
            plan: plan,
            stripeCustomerId: session.customer,
            stripeSubscriptionId: session.subscription,
            upgradedAt: new Date().toISOString(),
          });
        }
        break;
      }
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        // Optionally update plan details based on subscription status
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('stripeSubscriptionId', '==', subscription.id));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // A user might only have one document
          const promises = querySnapshot.docs.map((userDoc) => 
            updateDoc(doc(db, 'users', userDoc.id), {
              isPremium: false,
              plan: 'free'
            })
          );
          await Promise.all(promises);
        }
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error handling webhook event:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
}
