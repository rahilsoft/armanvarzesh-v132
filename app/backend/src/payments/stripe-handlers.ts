// Phase H″ — Stripe event handlers (safe defaults)
import Stripe from 'stripe';
import { sanitizePaymentPayload } from './privacy';

// Replace console.* with your logger if available
export async function handleStripeEvent(event: Stripe.Event) {
  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
      case 'payment_intent.payment_failed':
      case 'charge.succeeded':
      case 'charge.refunded':
      case 'checkout.session.completed':
      case 'customer.subscription.created':
      case 'customer.subscription.deleted':
      case 'invoice.payment_succeeded':
      case 'invoice.payment_failed':
        console.log('[stripe] event', event.type, { id: event.id });
        break;
      default:
        console.log('[stripe] unhandled event', event.type);
    }
  } catch (e) {
    console.error('[stripe] handler error', e);
  }
}

// Utility to sanitize object before logging
export function safe(obj: any) {
  try { return sanitizePaymentPayload(obj); } catch { return obj; }
}