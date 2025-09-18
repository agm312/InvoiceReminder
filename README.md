# Invoice Reminder SaaS

A modern, responsive web application for managing invoices and automating payment reminders. Built with HTML, CSS (Tailwind), and JavaScript with Firebase integration.

## Features

### 🚀 Core Functionality
- **Invoice Management**: Create, edit, and delete invoices
- **Client Management**: Store client information (name, email, phone)
- **Payment Tracking**: Mark invoices as paid, sent, or overdue
- **Reminder System**: Send manual reminders and automated sequences

### 💰 Subscription Plans
- **Starter (Free)**: 3 manual reminders/month, unlimited invoices
- **Pro ($29/month)**: 100 reminders/month, AI follow-up sequences, SMS support
- **Business ($79/month)**: 1,000 reminders/month, team collaboration, CRM integration

### 🔐 Authentication
- Google Sign-in
- Email/Password authentication
- Anonymous usage (limited features)

## Setup Instructions

### 1. Firebase Configuration
1. Create a Firebase project at [firebase.google.com](https://firebase.google.com)
2. Enable Authentication (Google, Email/Password, Anonymous)
3. Enable Firestore Database
4. Get your Firebase config and replace the placeholder in the code:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    projectId: "YOUR_PROJECT_ID",
    // ... other config options
};
```

### 2. Stripe Integration (Optional)
For payment processing, update the Stripe checkout links in the pricing section with your actual Stripe checkout URLs.

### 3. Deploy
- **Option 1**: Deploy to Firebase Hosting
- **Option 2**: Deploy to Netlify (Recommended)
- **Option 3**: Deploy to any static hosting service (Vercel, etc.)
- **Option 4**: Run locally by opening `index.html` in a browser

#### Netlify Deployment (Recommended)
1. Connect your GitHub repository to Netlify
2. Netlify will automatically detect the configuration files
3. Deploy - no build step required!
4. Your app will be live instantly

**Files included for Netlify compatibility:**
- `_redirects` - Handles routing
- `netlify.toml` - Build configuration

## Usage

### Getting Started
1. Open the application
2. You'll be automatically signed in anonymously
3. Click "Add Invoice" to create your first invoice
4. Fill in client details, amount, and due date
5. Use the reminder options to send payment reminders

### Invoice Management
- **Create**: Click the "+" button or "Add Invoice" button
- **Edit**: Currently not implemented (planned feature)
- **Delete**: Click the trash icon on any invoice
- **Mark as Paid**: Click the checkmark icon to mark an invoice as paid

### Reminder System
- **One-time Reminders**: Send immediate reminders manually
- **Automated Sequences**: Set up follow-up sequences (Pro+ feature)
- **Delivery Methods**: Email, SMS, or both (Pro+ feature)

### Plan Management
- View current plan status in the header
- Monitor monthly usage with the progress bar
- Upgrade plans through the pricing page
- All plans include unlimited invoice storage

## Technical Details

### Frontend
- **HTML5**: Semantic markup
- **CSS**: Tailwind CSS for styling
- **JavaScript**: ES6+ modules
- **Icons**: Lucide icon library

### Backend
- **Firebase Authentication**: User management
- **Firestore**: Database for invoices and user profiles
- **Real-time Updates**: Live invoice list updates

### Security
- User data isolation
- Anonymous authentication for basic usage
- Secure Firebase rules (configure in Firebase console)

## Customization

### Styling
- Modify Tailwind classes in the HTML
- Update CSS variables in the `<style>` section
- Change color scheme by updating Tailwind color classes

### Business Logic
- Modify plan limits in `PLAN_LIMITS` constant
- Update reminder logic in the sequence functions
- Customize invoice status calculations

### Branding
- Update company name in legal pages
- Replace placeholder contact information
- Customize plan names and pricing

## Browser Support
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License
This project is licensed under the MIT License.

## Troubleshooting Google Sign-in Issues

### Common Problems and Solutions

#### 1. "This domain is not authorized for Google sign-in"
**Problem**: Firebase doesn't recognize your domain for OAuth redirects.

**Solutions**:
- Go to Firebase Console → Authentication → Sign-in method → Google
- Add your domain to "Authorized domains"
- For local development, add `localhost`
- For production, add your actual domain (e.g., `yourdomain.com`)

#### 2. "Pop-up was blocked by browser"
**Problem**: Browser security settings block the sign-in pop-up.

**Solutions**:
- Allow pop-ups for your website in browser settings
- Try using an incognito/private window
- Disable pop-up blockers temporarily
- The app will show a specific error message for this

#### 3. "Google sign-in is not enabled"
**Problem**: Google authentication provider is not enabled in Firebase.

**Solutions**:
- Go to Firebase Console → Authentication → Sign-in method
- Find "Google" in the provider list
- Click "Enable" and configure the provider
- Add your support email

#### 4. "Network error" or connection issues
**Problem**: Unable to connect to Firebase services.

**Solutions**:
- Check your internet connection
- Verify Firebase configuration values are correct
- Make sure you're not behind a firewall blocking Firebase
- Try using a different network

#### 5. Local Development Issues
**Problem**: Issues when running locally (localhost).

**Solutions**:
- Ensure `localhost` is added to authorized domains in Firebase
- Use `http://localhost` instead of `http://127.0.0.1`
- Try different ports if using a local server
- Check browser console for CORS errors

### Debug Tools

The application includes built-in debugging tools:

1. **Open Browser Console** (F12 or right-click → Inspect)
2. **Run Debug Command**:
   ```javascript
   debugFirebase()
   ```
3. **Test Configuration**:
   ```javascript
   testFirebaseConfig()
   ```

These commands will show detailed information about your Firebase setup and help identify issues.

### Step-by-Step Firebase Setup

1. **Create Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Click "Create a project" or select existing
   - Enable Authentication and Firestore

2. **Configure Authentication**:
   - Go to Authentication → Sign-in method
   - Enable "Google" provider
   - Add your domain(s) to authorized domains
   - For local testing: add `localhost`

3. **Configure Firestore**:
   - Go to Firestore Database
   - Create database in production mode
   - Set up security rules (see Firebase documentation)

4. **Get Configuration**:
   - Go to Project settings → General
   - Scroll to "Your apps" section
   - Copy the config object values

5. **Test Locally**:
   - Open the app in your browser
   - Check browser console for debug information
   - Try the `debugFirebase()` and `testFirebaseConfig()` functions

### Browser-Specific Issues

- **Chrome**: Usually works best, check pop-up settings
- **Firefox**: May need to allow pop-ups and redirects
- **Safari**: Enable pop-ups and check privacy settings
- **Mobile browsers**: May have stricter pop-up blocking

### Still Having Issues?

1. Check the browser console for specific error messages
2. Use the debug tools mentioned above
3. Verify all Firebase configuration values
4. Test with a different browser or incognito mode
5. Check Firebase Console for any error logs

## Support
For support, please contact [your-email@domain.com]

---

**Note**: This is a demo application. For production use, ensure proper security measures, error handling, and compliance with relevant regulations.
