# Billing Settings Integration Setup Guide

This guide will help you set up the billing settings page with Stripe customer portal integration.

## What's Been Added

### 1. Billing Settings Page
- New billing view accessible from the main dashboard
- Shows subscription status, renewal dates, and cancellation info
- One-click access to Stripe customer portal for billing management

### 2. Navigation Integration
- Added "Billing" button in the header (visible when signed in)
- Seamless navigation between dashboard and billing settings

### 3. Netlify Function
- `create-portal-link.js` - Creates Stripe customer portal sessions
- Handles authentication and customer ID lookup

## Setup Steps

### 1. Environment Variables
Add these environment variables in your Netlify dashboard under **Site settings > Environment variables**:

```
STRIPE_SECRET_KEY=sk_test_... (or sk_live_... for production)
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----
SITE_URL=https://your-domain.netlify.app
```

### 2. Firebase Service Account
1. Go to Firebase Console > Project Settings > Service Accounts
2. Click "Generate new private key"
3. Download the JSON file
4. Extract the values for the environment variables above

### 3. Stripe Configuration
1. Enable Customer Portal in your Stripe dashboard:
   - Go to **Settings > Billing > Customer portal**
   - Enable **Cancel subscription**
   - Set cancellation to **End of current period**
   - Set **Return URL** to: `https://your-domain.netlify.app/settings/billing?portal=done`

### 4. Firestore Rules
Update your Firestore rules to allow users to read their own billing data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, update: if request.auth != null && request.auth.uid == uid;
      allow create: if request.auth != null && request.auth.uid == uid;
      // Server-side webhooks can write regardless:
      allow write: if request.auth.token.admin == true;
    }
  }
}
```

### 5. User Data Structure
Ensure your user documents in Firestore have the following structure:

```javascript
// Document: /users/{userId}
{
  stripeCustomerId: "cus_...", // Stripe customer ID
  status: "active", // Subscription status
  priceId: "price_...", // Stripe price ID
  current_period_end: 1234567890, // Unix timestamp
  cancel_at_period_end: false // Boolean
}
```

## How It Works

### 1. User Flow
1. User clicks "Billing" button in header
2. App loads subscription data from Firestore
3. User sees current plan status and billing info
4. User clicks "Manage billing / Cancel plan"
5. App calls Netlify function to create portal session
6. User is redirected to Stripe customer portal
7. After managing billing, user returns to your app

### 2. Premium Access Logic
Users have premium access if:
- `status` is `'active'`, `'trialing'`, or `'past_due'`, OR
- `cancel_at_period_end` is `true` AND current time < `current_period_end`

### 3. Webhook Integration
When users cancel or modify subscriptions through the portal, Stripe webhooks should update the user's Firestore document to reflect the new status.

## Testing

### 1. Test Subscription Flow
1. Create a test subscription in Stripe
2. Update user's Firestore document with subscription data
3. Visit billing settings page
4. Verify all information displays correctly
5. Test portal link generation

### 2. Test Cancellation Flow
1. Cancel subscription through Stripe portal
2. Verify webhook updates user's `cancel_at_period_end` field
3. Check that billing page shows "Cancellation scheduled"
4. Verify premium access continues until `current_period_end`

## Troubleshooting

### Common Issues

1. **"No Stripe customer ID found"**
   - Ensure user document has `stripeCustomerId` field
   - Check that Stripe customer was created during subscription

2. **"Unauthorized" error**
   - Verify Firebase token is being sent correctly
   - Check Firebase service account permissions

3. **Portal link not working**
   - Verify Stripe secret key is correct
   - Check that customer portal is enabled in Stripe dashboard
   - Ensure return URL is set correctly

4. **Billing data not loading**
   - Check Firestore rules allow user to read their document
   - Verify user document structure matches expected format

## Security Notes

- The Netlify function verifies Firebase tokens before processing
- Stripe customer portal handles all payment method updates securely
- No sensitive billing data is stored in your app's frontend
- All billing operations go through Stripe's secure infrastructure

## Next Steps

1. Set up Stripe webhooks to sync subscription changes
2. Add email notifications for subscription events
3. Implement usage tracking and limits
4. Add support for multiple subscription tiers
5. Create admin dashboard for subscription management

