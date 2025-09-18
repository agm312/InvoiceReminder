# Email Setup Instructions

To enable automatic email sending in your Invoice Reminder app, you need to configure EmailJS. Follow these steps:

## Step 1: Sign up for EmailJS
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Create a free account
3. Verify your email address

## Step 2: Create an Email Service
1. In your EmailJS dashboard, click on "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, Yahoo, etc.)
4. Follow the setup instructions to connect your email account
5. Give your service a name (e.g., "invoice-reminder-service")

## Step 3: Create an Email Template
1. In your EmailJS dashboard, click on "Email Templates"
2. Click "Create New Template"
3. Use the following template structure:

### Template Name: `Invoice Reminder`

### Subject:
```
Invoice Reminder - {{invoice_amount}} Due {{due_date}}
```

**Note:** The date will be formatted as MM-DD-YYYY (e.g., "07-03-2025") in the subject line for better readability.

### HTML Body:
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice Reminder</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #4f46e5;">Invoice Reminder</h2>

        <p>Hi {{to_name}},</p>

        <p>This is a friendly reminder about your outstanding invoice.</p>

        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1f2937;">Invoice Details:</h3>
            <ul style="list-style: none; padding: 0;">
                <li style="margin-bottom: 10px;"><strong>Amount:</strong> {{invoice_amount}}</li>
                <li style="margin-bottom: 10px;"><strong>Due Date:</strong> {{due_date}}</li>
                <li style="margin-bottom: 10px;"><strong>Description:</strong> {{invoice_description}}</li>
            </ul>
        </div>

        <p>Please let us know if you have any questions about this invoice.</p>

        <p>Thank you for your business!</p>

        <p>Best regards,<br>
        Invoice Reminder Service</p>
    </div>
</body>
</html>
```

### Plain Text Body:
```
Hi {{to_name}},

This is a friendly reminder about your outstanding invoice.

Invoice Details:
• Amount: {{invoice_amount}}
• Due Date: {{due_date}}
• Description: {{invoice_description}}

Please let us know if you have any questions about this invoice.

Thank you for your business!

Best regards,
Invoice Reminder Service
```

## Step 4: Get Your Credentials
1. From your EmailJS dashboard, copy these values:
   - **Service ID**: Found in Email Services section (your service ID: `service_ayk4nl5`)
   - **Template ID**: Found in Email Templates section (your template ID: `template_yg5gfju`)
   - **Public Key**: Found in Account > General (your public key: `9rWSKXIXBLpoAD5p7`)

## Step 5: Configure Your App
1. Open your Invoice Reminder app
2. Click on the settings or configuration button
3. Enter your EmailJS credentials:
   - Service ID: `service_ayk4nl5`
   - Template ID: `template_yg5gfju`
   - Public Key: `9rWSKXIXBLpoAD5p7`
4. Click "Save Configuration"
5. Test the configuration by clicking "Test Email"

## Step 6: Test the Email Functionality
1. Create a test invoice in your app
2. Click "Send Reminder"
3. Check that the email is sent successfully
4. Verify the recipient receives the email

## Troubleshooting

### Common Issues:

1. **"Email service not configured" error**
   - Make sure you've entered all three credentials (Service ID, Template ID, Public Key)
   - Verify the credentials are correct in your EmailJS dashboard

2. **"Test email failed" error**
   - Check that your email service is properly connected in EmailJS
   - Verify your email account credentials in the EmailJS service settings
   - Make sure your email provider allows SMTP access

3. **Emails not being delivered**
   - Check your spam/junk folder
   - Verify the recipient email address is correct
   - Make sure your email service has sending limits (free plan has limits)

### EmailJS Free Plan Limits:
- 200 emails per month
- 50 emails per day
- 2 email services
- 10 email templates

For higher limits, consider upgrading to a paid EmailJS plan.

## Security Notes
- Never share your EmailJS Public Key publicly
- The Public Key is safe to use in client-side code
- Keep your email service credentials secure
- Regularly monitor your email sending activity

## Support
If you need help setting up EmailJS, visit:
- EmailJS Documentation: [https://www.emailjs.com/docs/](https://www.emailjs.com/docs/)
- EmailJS Support: [https://www.emailjs.com/support/](https://www.emailjs.com/support/)
