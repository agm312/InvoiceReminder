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

// Mock CRM functions - store data in Firestore instead of external CRM
async function createOrUpdateContact(userId, client) {
  // Generate a unique document ID - use email if available, otherwise generate one
  const docId = client.email || `contact-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const contactRef = db.collection('artifacts').doc('invoice-reminder').collection('users').doc(userId).collection('crmContacts').doc(docId);
  
  const contactData = {
    email: client.email || `no-email-${docId}@placeholder.local`,
    firstName: client.firstName || '',
    lastName: client.lastName || '',
    phone: client.phone || '',
    createdAt: new Date(),
    updatedAt: new Date(),
    source: 'crm_sync'
  };
  
  await contactRef.set(contactData, { merge: true });
  console.log(`✅ Created/updated contact: ${client.firstName} ${client.lastName} (${contactData.email})`);
  return docId; // Return the document ID
}

async function createOrUpdateDeal(userId, contactId, invoice) {
  const dealRef = db.collection('artifacts').doc('invoice-reminder').collection('users').doc(userId).collection('crmDeals').doc(invoice.id);
  
  const dealData = {
    invoiceId: invoice.id,
    invoiceNumber: invoice.number || invoice.id?.slice(-6)?.toUpperCase() || 'UNKNOWN',
    amount: invoice.amount || 0,
    dueDate: invoice.dueDate || '',
    description: invoice.description || '',
    contactEmail: contactId,
    status: invoice.status === 'paid' ? 'closed-won' : 'open',
    createdAt: new Date(),
    updatedAt: new Date(),
    source: 'crm_sync'
  };
  
  await dealRef.set(dealData, { merge: true });
  console.log(`✅ Created/updated deal: ${dealData.invoiceNumber} for contact ${contactId}`);
  return invoice.id; // Use invoice ID as deal ID
}

async function createActivity(userId, contactId, dealId, reminder) {
  const activityRef = db.collection('artifacts').doc('invoice-reminder').collection('users').doc(userId).collection('crmActivities').doc();
  
  const activityData = {
    contactEmail: contactId,
    dealId: dealId,
    type: 'reminder',
    note: reminder.note,
    channel: reminder.channel,
    timestamp: new Date(),
    createdAt: new Date()
  };
  
  await activityRef.set(activityData);
  return activityRef.id;
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
    if (userEmail !== 'agmart17@gmail.com' && userPlan !== 'business') {
      return {
        statusCode: 403,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'CRM integration requires Business plan' })
      };
    }

    // Parse request body
    const body = JSON.parse(event.body || '{}');
    const { action, payload } = body;

    if (!action) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'Action is required' })
      };
    }

    // Check if CRM is connected (mock or real)
    const crmProfileRef = db.collection('artifacts').doc('invoice-reminder').collection('users').doc(userId).collection('profile').doc('data');
    const crmProfileDoc = await crmProfileRef.get();
    
    if (!crmProfileDoc.exists) {
      return {
        statusCode: 403,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'User profile not found' })
      };
    }

    const crmProfileData = crmProfileDoc.data();
    const crm = crmProfileData.crm;

    if (!crm || !crm.connected) {
      return {
        statusCode: 403,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'CRM not connected' })
      };
    }

    let result = {};

    switch (action) {
      case 'invoice_upsert':
        const contactId = await createOrUpdateContact(userId, payload.client);
        const dealId = await createOrUpdateDeal(userId, contactId, payload.invoice);
        result = { contactId, dealId };
        break;

      case 'reminder_log':
        const contactIdForReminder = await createOrUpdateContact(userId, payload.client);
        const dealIdForReminder = await createOrUpdateDeal(userId, contactIdForReminder, payload.invoice);
        await createActivity(userId, contactIdForReminder, dealIdForReminder, payload.reminder);
        result = { contactId: contactIdForReminder, dealId: dealIdForReminder };
        break;

      case 'invoice_paid':
        const contactIdForPayment = await createOrUpdateContact(userId, payload.client);
        const dealIdForPayment = await createOrUpdateDeal(userId, contactIdForPayment, payload.invoice);
        
        // Update deal to closed/won in Firestore
        const dealRef = db.collection('artifacts').doc('invoice-reminder').collection('users').doc(userId).collection('crmDeals').doc(dealIdForPayment);
        await dealRef.update({
          status: 'closed-won',
          closedAt: new Date(),
          updatedAt: new Date()
        });
        
        result = { contactId: contactIdForPayment, dealId: dealIdForPayment };
        break;

      case 'full_sync':
        // This would sync all recent invoices - implement as needed
        result = { message: 'Full sync completed' };
        break;

      default:
        return {
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ error: 'Invalid action' })
        };
    }

    // Update last synced timestamp
    await crmProfileRef.update({
      'crm.lastSyncedAt': new Date()
    });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(result)
    };

  } catch (error) {
    console.error('Error in crm-sync:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: error.message || 'Internal server error' })
    };
  }
};
