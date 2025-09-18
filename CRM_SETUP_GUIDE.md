# CRM Integration Setup Guide

## Overview
The CRM integration allows Business plan users to connect their HubSpot account and automatically sync invoice data, reminders, and payment status.

## What's Been Added

### Frontend Integration ✅
- CRM Integration card in Billing view (Business plan only)
- Connect/Disconnect/Sync buttons
- Automatic sync on invoice creation, reminders, and payments
- Status indicators and error handling

### Backend Functions ✅
- `crm-hubspot-start.js` - Initiates HubSpot OAuth flow
- `crm-hubspot-callback.js` - Handles OAuth callback
- `crm-sync.js` - Main sync function for all CRM operations
- `crm-disconnect.js` - Disconnects CRM integration

## Setup Steps

### 1. HubSpot App Configuration

1. **Create a HubSpot App:**
   - Go to [HubSpot Developer Portal](https://developers.hubspot.com/)
   - Create a new app
   - Note your Client ID and Client Secret

2. **Configure OAuth Settings:**
   - Set redirect URI to: `https://your-domain.netlify.app/.netlify/functions/crm-hubspot-callback`
   - Enable the following scopes:
     - `crm.objects.contacts.write`
     - `crm.objects.contacts.read`
     - `crm.objects.deals.write`
     - `crm.objects.deals.read`
     - `crm.objects.companies.write`
     - `crm.objects.companies.read`

### 2. Environment Variables

Add these to your Netlify environment variables:

```bash
HUBSPOT_CLIENT_ID=your_hubspot_client_id
HUBSPOT_CLIENT_SECRET=your_hubspot_client_secret
HUBSPOT_REDIRECT_URI=https://your-domain.netlify.app/.netlify/functions/crm-hubspot-callback
APP_BASE_URL=https://your-domain.netlify.app
ENCRYPTION_KEY=your_secure_random_string_here
```

### 3. Firebase Admin SDK Setup

Make sure Firebase Admin SDK is properly configured in your Netlify environment. The functions use the same Firebase project as your frontend.

### 4. Deploy Functions

Deploy your Netlify functions:
```bash
netlify deploy --prod
```

## How It Works

### User Flow
1. Business user clicks "Connect HubSpot" in Billing view
2. Redirected to HubSpot OAuth authorization
3. After authorization, redirected back to callback function
4. Tokens are encrypted and stored in Firestore
5. CRM card shows "Connected" status

### Automatic Sync
- **Invoice Creation**: Creates/updates contact and deal in HubSpot
- **Manual Reminders**: Logs reminder activity as notes
- **AI Reminders**: Logs AI reminder activity as notes
- **Payment Marking**: Marks deals as "closed/won"

### Data Structure
```json
{
  "crm": {
    "provider": "hubspot",
    "connected": true,
    "expiresAt": 1699999999,
    "lastSyncedAt": "2023-11-15T10:30:00Z",
    "accessToken": "encrypted_token",
    "refreshToken": "encrypted_token"
  }
}
```

## Testing

### Local Testing
1. Set up environment variables in `.env` file
2. Use `netlify dev` to test functions locally
3. Test with Business plan user (agmart17@gmail.com has special access)

### Production Testing
1. Deploy to Netlify
2. Configure environment variables in Netlify dashboard
3. Test OAuth flow with real HubSpot account

## Troubleshooting

### Common Issues
1. **"Failed to start CRM connect"**: Check HubSpot Client ID and environment variables
2. **OAuth callback fails**: Verify redirect URI matches exactly
3. **Token refresh fails**: Check Client Secret and token expiration handling
4. **Sync operations fail**: Verify HubSpot API permissions and rate limits

### Debug Steps
1. Check Netlify function logs
2. Verify environment variables are set
3. Test HubSpot API calls manually
4. Check Firestore permissions

## Security Notes

- Access tokens are encrypted before storage
- Only Business plan users can access CRM features
- Firebase ID tokens are verified on every request
- HubSpot tokens are refreshed automatically when expired

## Next Steps

1. Set up HubSpot app and get credentials
2. Configure environment variables
3. Deploy functions to Netlify
4. Test with Business plan user
5. Monitor function logs for any issues

The integration is now ready to use! Business users will see the CRM card and can connect their HubSpot accounts to automatically sync their invoice data.









