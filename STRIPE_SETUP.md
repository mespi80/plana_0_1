# Stripe Setup Guide

This guide will help you set up Stripe payment processing for PLANA.

## 1. Create a Stripe Account

1. Go to [stripe.com](https://stripe.com) and create an account
2. Complete the account verification process
3. Switch to test mode for development

## 2. Get Your API Keys

1. In your Stripe Dashboard, go to **Developers > API keys**
2. Copy your **Publishable key** and **Secret key**
3. Add them to your `.env.local` file:

```env
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

## 3. Set Up Webhooks

1. In your Stripe Dashboard, go to **Developers > Webhooks**
2. Click **Add endpoint**
3. Set the endpoint URL to: `https://your-domain.com/api/stripe/webhook`
4. For local development, use Stripe CLI or ngrok
5. Select these events to listen for:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
6. Copy the webhook signing secret and add it to your `.env.local`:

```env
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## 4. Test the Integration

1. Use Stripe's test card numbers:
   - **Success**: `4242 4242 4242 4242`
   - **Decline**: `4000 0000 0000 0002`
   - **Requires Authentication**: `4000 0025 0000 3155`

2. Test the payment flow in your app

## 5. Production Setup

1. Switch to live mode in your Stripe Dashboard
2. Update your API keys to live keys
3. Update your webhook endpoint URL
4. Test with real payment methods

## 6. Environment Variables

Add these to your `.env.local` file:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret_here
```

## 7. Features Implemented

- ✅ Payment intent creation
- ✅ Secure payment processing
- ✅ Webhook handling
- ✅ Payment success/failure pages
- ✅ Customer management
- ✅ Refund processing
- ✅ Subscription support

## 8. Security Notes

- Never expose your secret key in client-side code
- Always verify webhook signatures
- Use HTTPS in production
- Implement proper error handling
- Follow PCI compliance guidelines

## 9. Testing

The integration includes:
- Payment form with Stripe Elements
- Success/failure pages
- Webhook event handling
- Error handling and user feedback

## 10. Next Steps

1. Customize the payment form styling
2. Add email notifications
3. Implement booking management
4. Add analytics tracking
5. Set up automated testing 