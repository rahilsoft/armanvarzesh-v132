import { handleStripeEvent } from './stripe-handlers';
// Phase H′ — Stripe webhook mount (Express) 
import { Request, Response } from 'express';
import Stripe from 'stripe';

export function mountStripeWebhook(app: any) {
  const express = require('express');
  // Raw body is required by Stripe to verify signatures
  app.use('/payments/stripe/webhook', express.raw({ type: 'application/json' }));

  app.post('/payments/stripe/webhook', (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'] as string;
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!secret) return res.status(500).send('Missing STRIPE_WEBHOOK_SECRET');
    let event: Stripe.Event;
    try {
      event = Stripe.webhooks.constructEvent((req as any).body, sig, secret);
    } catch (err: any) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    try { handleStripeEvent(event); } catch {}
    // Minimal ack to avoid retries:
    return res.json({ received: true, type: event.type });
  });
}
