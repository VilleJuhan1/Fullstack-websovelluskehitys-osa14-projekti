import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_12345';

// Initialize the Stripe SDK
export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2026-05-27.dahlia', // Use latest required by SDK typings
  host: process.env.STRIPE_API_BASE ? process.env.STRIPE_API_BASE.replace(/^https?:\/\//, '').split(':')[0] : 'api.stripe.com',
  protocol: process.env.STRIPE_API_BASE && process.env.STRIPE_API_BASE.startsWith('http://') ? 'http' : 'https',
  port: process.env.STRIPE_API_BASE && process.env.STRIPE_API_BASE.split(':').length === 3 
    ? parseInt(process.env.STRIPE_API_BASE.split(':')[2]) 
    : undefined,
});
