import Stripe from 'stripe';
import * as admin from 'firebase-admin';

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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

  // Idempotency Check
  const eventRef = db.collection('stripe_events').doc(event.id);
  const eventDoc = await eventRef.get();
  if (eventDoc.exists) {
    console.log(`Event ${event.id} already processed. Skipping.`);
    return res.status(200).json({ received: true, skipped: true });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.client_reference_id || session.metadata?.userId;
        const plan = session.metadata?.plan || 'pro';
        
        if (userId) {
          const userRef = db.collection('users').doc(userId);
          await userRef.update({
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
        const usersRef = db.collection('users');
        const snapshot = await usersRef.where('stripeSubscriptionId', '==', subscription.id).get();

        if (!snapshot.empty) {
          const promises = snapshot.docs.map((userDoc) => 
            userDoc.ref.update({
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

    // Mark event as processed
    await eventRef.set({ processedAt: new Date().toISOString(), type: event.type });

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error handling webhook event:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
}
