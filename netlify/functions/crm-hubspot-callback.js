const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore } = require('firebase-admin/firestore');
const crypto = require('crypto');

// Initialize Firebase Admin
let app;
let auth;
let db;

try {
  app = initializeApp();
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.log('Firebase already initialized or not configured');
}

// Simple encryption/decryption functions
function encrypt(text, key) {
  const algorithm = 'aes-256-gcm';
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipher(algorithm, key);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  return {
    encrypted,
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex')
  };
}

function decrypt(encryptedData, key) {
  const algorithm = 'aes-256-gcm';
  const decipher = crypto.createDecipher(algorithm, key);
  
  decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));
  
  let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

exports.handler = async (event, context) => {
  try {
    const { code, state } = event.queryStringParameters || {};
    
    if (!code || !state) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'text/html'
        },
        body: `
          <html>
            <body>
              <h1>CRM Connection Failed</h1>
              <p>Missing authorization code or state parameter.</p>
              <script>
                setTimeout(() => {
                  window.close();
                }, 3000);
              </script>
            </body>
          </html>
        `
      };
    }

    const userId = state; // We used user ID as state

    // Exchange code for tokens
    const hubspotClientId = process.env.HUBSPOT_CLIENT_ID;
    const hubspotClientSecret = process.env.HUBSPOT_CLIENT_SECRET;
    const redirectUri = process.env.HUBSPOT_REDIRECT_URI || `${process.env.APP_BASE_URL}/.netlify/functions/crm-hubspot-callback`;

    if (!hubspotClientId || !hubspotClientSecret) {
      console.error('HubSpot credentials not configured');
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'text/html'
        },
        body: `
          <html>
            <body>
              <h1>CRM Connection Failed</h1>
              <p>HubSpot credentials not configured.</p>
              <script>
                setTimeout(() => {
                  window.close();
                }, 3000);
              </script>
            </body>
          </html>
        `
      };
    }

    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://api.hubapi.com/oauth/v1/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: hubspotClientId,
        client_secret: hubspotClientSecret,
        redirect_uri: redirectUri,
        code: code
      })
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token exchange failed:', errorText);
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'text/html'
        },
        body: `
          <html>
            <body>
              <h1>CRM Connection Failed</h1>
              <p>Failed to exchange authorization code for tokens.</p>
              <script>
                setTimeout(() => {
                  window.close();
                }, 3000);
              </script>
            </body>
          </html>
        `
      };
    }

    const tokenData = await tokenResponse.json();
    const { access_token, refresh_token, expires_in } = tokenData;

    // Encrypt and store tokens
    const encryptionKey = process.env.ENCRYPTION_KEY || 'default-key-change-in-production';
    const encryptedAccessToken = encrypt(access_token, encryptionKey);
    const encryptedRefreshToken = encrypt(refresh_token, encryptionKey);

    // Store in Firestore
    const profileRef = db.collection('artifacts').doc('invoice-reminder').collection('users').doc(userId).collection('profile').doc('data');
    
    await profileRef.update({
      'crm.provider': 'hubspot',
      'crm.connected': true,
      'crm.accessToken': encryptedAccessToken,
      'crm.refreshToken': encryptedRefreshToken,
      'crm.expiresAt': Date.now() + (expires_in * 1000),
      'crm.lastSyncedAt': new Date()
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html'
      },
      body: `
        <html>
          <body>
            <h1>CRM Connected Successfully!</h1>
            <p>Your HubSpot account has been connected. You can now close this window.</p>
            <script>
              setTimeout(() => {
                window.close();
              }, 2000);
            </script>
          </body>
        </html>
      `
    };

  } catch (error) {
    console.error('Error in crm-hubspot-callback:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'text/html'
      },
      body: `
        <html>
          <body>
            <h1>CRM Connection Failed</h1>
            <p>An error occurred while connecting to HubSpot.</p>
            <script>
              setTimeout(() => {
                window.close();
              }, 3000);
            </script>
          </body>
        </html>
      `
    };
  }
};








