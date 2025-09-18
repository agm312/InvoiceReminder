# CRM Integration Environment Variables
# Add these to your Netlify environment variables or .env file

# HubSpot OAuth Configuration
HUBSPOT_CLIENT_ID=your_hubspot_client_id_here
HUBSPOT_CLIENT_SECRET=your_hubspot_client_secret_here
HUBSPOT_REDIRECT_URI=https://your-domain.netlify.app/.netlify/functions/crm-hubspot-callback

# App Configuration
APP_BASE_URL=https://your-domain.netlify.app

# Encryption Key (generate a secure random string)
ENCRYPTION_KEY=your_secure_encryption_key_here

# Firebase Admin SDK (if not already configured)
# You'll need to set up Firebase service account credentials
# GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account-key.json
# Or configure Firebase Admin SDK in your Netlify environment






