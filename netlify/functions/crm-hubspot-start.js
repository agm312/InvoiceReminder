const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore } = require('firebase-admin/firestore');

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

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  try {
    // Verify Firebase ID token
    const authHeader = event.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        statusCode: 401,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'No valid authorization header' })
      };
    }

    const idToken = authHeader.split('Bearer ')[1];
    let decodedToken;
    
    try {
      decodedToken = await auth.verifyIdToken(idToken);
    } catch (error) {
      console.error('Token verification failed:', error);
      return {
        statusCode: 401,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'Invalid token' })
      };
    }

    const userId = decodedToken.uid;
    const userEmail = decodedToken.email;

    // Check if user has Business plan
    const profileRef = db.collection('artifacts').doc('invoice-reminder').collection('users').doc(userId).collection('profile').doc('data');
    const profileDoc = await profileRef.get();
    
    if (!profileDoc.exists) {
      return {
        statusCode: 403,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'User profile not found' })
      };
    }

    const profileData = profileDoc.data();
    const userPlan = profileData.plan;

    // Special access for testing - give agmart17@gmail.com Business plan access
    if (userEmail === 'agmart17@gmail.com') {
      // Allow access
    } else if (userPlan !== 'business') {
      return {
        statusCode: 403,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'CRM integration requires Business plan' })
      };
    }

    // Mock CRM connection - just mark as connected in Firestore
    await profileRef.update({
      'crm.provider': 'mock',
      'crm.connected': true,
      'crm.lastSyncedAt': new Date()
    });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        message: 'Mock CRM connected successfully',
        connected: true 
      })
    };

  } catch (error) {
    console.error('Error in crm-mock-start:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
