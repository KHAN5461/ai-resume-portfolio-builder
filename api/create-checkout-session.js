import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const { plan, isAnnual, userEmail, userId } = req.body;

    let priceId;
    if (plan === 'pro') {
      priceId = isAnnual 
        ? process.env.STRIPE_PRO_ANNUAL_PRICE_ID 
        : process.env.STRIPE_PRO_MONTHLY_PRICE_ID;
    } else if (plan === 'enterprise') {
      priceId = isAnnual 
        ? process.env.STRIPE_ENTERPRISE_ANNUAL_PRICE_ID 
        : process.env.STRIPE_ENTERPRISE_MONTHLY_PRICE_ID;
    }

    if (!priceId) {
      return res.status(400).json({ error: 'Invalid plan or billing cycle' });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      client_reference_id: userId,
      customer_email: userEmail,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        plan,
        userId,
      },
      subscription_data: {
        metadata: {
          plan,
          userId,
        }
      },
      success_url: `${process.env.VITE_APP_URL || 'http://localhost:5173'}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.VITE_APP_URL || 'http://localhost:5173'}/#pricing`,
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return res.status(500).json({ error: error.message });
  }
}
