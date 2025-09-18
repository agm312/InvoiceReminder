# Testing the Billing Settings Integration

## Quick Test Steps

### 1. Test Plan Display
1. Sign in with `agmart17@gmail.com` (should show "Business Plan")
2. Sign in with any other email (should show "Free Plan")
3. Check that the billing page shows the correct plan name

### 2. Test Billing Button Visibility
- **Free users**: Should see "Upgrade to manage billing" prompt
- **Paid users**: Should see "Manage billing / Cancel plan" button

### 3. Test Local Development
To test the Netlify function locally:

```bash
# Install Netlify CLI if you haven't already
npm install -g netlify-cli

# Start local development server
netlify dev
```

This will start your app with Netlify functions running locally.

### 4. Test Data Structure
For testing, you can manually add test data to Firestore:

```javascript
// Document: /users/{userId}
{
  plan: "business", // or "pro" or "free"
  stripeCustomerId: "cus_test123", // Only for paid users
  status: "active", // Only for paid users
  current_period_end: 1735689600, // Unix timestamp
  cancel_at_period_end: false
}
```

## Expected Behavior

### Free Users (plan: "free")
- Plan Status: "Starter"
- Badge: "Free Plan" (gray)
- Button: "Upgrade to manage billing" (blue)
- Renewal Date: "—"
- Cancellation: "Not scheduled"

### Pro Users (plan: "pro")
- Plan Status: "Pro"
- Badge: "Pro Plan" (green)
- Button: "Manage billing / Cancel plan" (black)
- Renewal Date: Shows actual date
- Cancellation: Shows status

### Business Users (plan: "business")
- Plan Status: "Business"
- Badge: "Business Plan" (green)
- Button: "Manage billing / Cancel plan" (black)
- Renewal Date: Shows actual date
- Cancellation: Shows status

## Troubleshooting

### If you see "No Stripe customer ID found"
- This is expected for free users
- The upgrade prompt should appear instead of the billing button

### If the Netlify function returns 501 error
- Make sure you're running `netlify dev` instead of just opening the HTML file
- Check that the function dependencies are installed: `cd netlify/functions && npm install`

### If plan names don't match
- Check that the user's `plan` field in Firestore matches: "free", "pro", or "business"
- The special user `agmart17@gmail.com` should always show "Business Plan"

