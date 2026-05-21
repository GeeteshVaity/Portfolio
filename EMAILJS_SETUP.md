# EmailJS Integration Setup Guide

This guide will help you configure EmailJS to enable the contact form functionality on your portfolio website.

## Step 1: Create an EmailJS Account

1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Click **"Sign Up Free"** or **"Get Started"**
3. Sign up using your email or GitHub account
4. Verify your email address

## Step 2: Get Your Public Key

1. After logging in, go to **Account** (top right menu)
2. Copy your **Public Key** from the "API Keys" section
3. This is your `YOUR_PUBLIC_KEY` value

## Step 3: Add an Email Service

1. Navigate to **Email Services** in the sidebar
2. Click **"Add New Service"**
3. Choose your email provider:
   - **Gmail**: Select "Gmail"
   - **Other Email**: Select "Other Email Services" and configure

### For Gmail:
1. Select "Gmail"
2. Click **"Connect Account"**
3. You'll be redirected to Google - approve access
4. A **Service ID** will be generated automatically
5. Copy this Service ID - this is your `YOUR_SERVICE_ID`

### For Other Email Providers:
1. Follow the provider's authentication steps
2. Copy the generated **Service ID**

## Step 4: Create an Email Template

1. Go to **Email Templates** in the sidebar
2. Click **"Create New Template"**
3. Fill in the template details:

### Template Configuration:
- **Template Name**: `contact_form` (or your preferred name)
- **Subject**: `New Message from {{from_name}}` (optional styling)

### Email Template Body:

Use this template body to display the contact form data:

```
From: {{from_name}}
Email: {{from_email}}

---

Message:

{{message}}

---

Sent from Portfolio Website Contact Form
```

### Template Variables:
Make sure your template includes these variables (they must match exactly):
- `{{from_name}}` - Sender's name
- `{{from_email}}` - Sender's email address
- `{{message}}` - Message content

### Send To:
Set the recipient email to your email address (e.g., `geeteshvaity22@gmail.com`)

4. Click **"Save"** to create the template
5. Copy the **Template ID** - this is your `YOUR_TEMPLATE_ID`

## Step 5: Update Your React Component

Open `src/components/ContactSection.tsx` and replace the placeholder values at the top:

```tsx
// EmailJS Configuration - Replace with your credentials
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID'        // Replace this
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'      // Replace this
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY'        // Replace this
```

### Example (Do not use - these are fake):
```tsx
const EMAILJS_SERVICE_ID = 'service_abc123def456'
const EMAILJS_TEMPLATE_ID = 'template_xyz789'
const EMAILJS_PUBLIC_KEY = 'public_key_a1b2c3d4e5f6'
```

## Step 6: Update Email Recipient (Optional)

If you want to send emails to a different email address than the one configured in your template:

1. Find this line in `ContactSection.tsx`:
```tsx
to_email: 'geeteshvaity22@gmail.com',
```

2. Replace `'geeteshvaity22@gmail.com'` with your actual email address

## Step 7: Test the Contact Form

1. Start your development server:
```bash
npm run dev
```

2. Navigate to the contact section
3. Fill out the form with test data
4. Click **"Send Message"**
5. You should receive an email at your configured address
6. A success toast message will appear on the website

## Features Implemented

✅ **Form Validation**
- All fields are required
- Email format validation
- Minimum character length validation
- Real-time error clearing

✅ **Loading State**
- Button text changes to "Sending..."
- Button is disabled during submission
- Prevents multiple submissions
- Spinner animation on button

✅ **Success/Error Handling**
- Success toast: "Message sent successfully! I'll get back to you soon."
- Error toast with detailed error message
- Console error logging for debugging

✅ **Form Management**
- Form clears after successful submission
- Form stays populated if there's an error
- Page doesn't reload on submit

✅ **Accessibility Features**
- Proper `htmlFor` labels
- `aria-invalid` and `aria-describedby` for error states
- `aria-busy` on submit button during loading
- Semantic HTML structure
- Keyboard navigable

✅ **UX/Animation Features**
- Smooth error message animations
- Input hover states
- Button hover effect (except when loading)
- Button press animation (except when loading)
- Maintains your existing design and animations
- No layout shift

## Troubleshooting

### "Service not found" or "Template not found" error
- Check that your Service ID and Template ID are correctly copied
- Make sure they're in the right variables in the component
- Verify the IDs in your EmailJS dashboard

### Emails not arriving
- Check EmailJS dashboard for failed email attempts
- Verify your email template is published/active
- Make sure the recipient email is configured correctly
- Check spam/promotions folder

### CORS errors
- EmailJS handles CORS properly with the public key
- Make sure you're using the correct Public Key
- Clear browser cache and restart dev server

### Form not submitting
- Check browser console for errors (F12 > Console)
- Make sure all form fields have valid data
- Check that EmailJS_PUBLIC_KEY is initialized before component mounts

## Important Security Notes

⚠️ **Public Key Usage**
- The Public Key shown in `ContactSection.tsx` is safe to expose in frontend code
- EmailJS is designed to work with public keys
- Your actual secret key stays on EmailJS servers

⚠️ **Rate Limiting**
- Free EmailJS accounts have a limit (usually 200 emails/day)
- Consider upgrading as your site grows

## Production Deployment

Before deploying to production:

1. ✅ Test the contact form thoroughly
2. ✅ Verify all three credentials are correctly set
3. ✅ Test on various devices and browsers
4. ✅ Check spam filters for your email
5. ✅ Update the `to_email` if needed to your production email
6. ✅ Consider adding rate limiting on your backend (if you have one)

## Resources

- [EmailJS Documentation](https://www.emailjs.com/docs/)
- [React Integration Guide](https://www.emailjs.com/docs/sdk/install-nodejs/)
- [Template Variables](https://www.emailjs.com/docs/user-guide/templates/)
- [Common Issues](https://www.emailjs.com/docs/intro/)

## Questions?

If you encounter any issues:
1. Check the EmailJS dashboard logs
2. Open browser console (F12) for error messages
3. Visit EmailJS support documentation
4. Check the component comments in `ContactSection.tsx`
