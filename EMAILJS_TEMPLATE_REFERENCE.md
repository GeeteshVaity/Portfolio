# EmailJS Template Configuration

## Quick Reference for EmailJS Email Template Setup

### Create New Template in EmailJS Dashboard:

**Step 1: Template Name**
- Use: `contact_form` (or your preferred name)

**Step 2: Template Parameters**
Your template must include these exact variables:
- `from_name` → Sender's name
- `from_email` → Sender's email  
- `message` → Message content

**Step 3: Email Subject (Optional)**
```
New Message from {{from_name}}
```

**Step 4: Template Body**
Copy and paste this into your EmailJS template editor:

```
Hello!

You've received a new message from your portfolio website:

---

From: {{from_name}}
Email: {{from_email}}

Message:
{{message}}

---

Please reply to {{from_email}} to continue the conversation.

Best regards,
Portfolio Contact Form
```

### Alternative Template (Professional):

```
<h2>New Contact Form Submission</h2>

<p><strong>From:</strong> {{from_name}}</p>
<p><strong>Email:</strong> <a href="mailto:{{from_email}}">{{from_email}}</a></p>

<h3>Message:</h3>
<p>{{message}}</p>

<hr>

<p><small>Sent from your portfolio website contact form</small></p>
```

**Step 5: Send To**
- Enter your email address: `geeteshvaity22@gmail.com`
- Or your preferred recipient email

**Step 6: Copy the Template ID**
- After saving, copy the **Template ID** shown in the template list
- Example format: `template_abc123xyz`
- This goes in ContactSection.tsx as `YOUR_TEMPLATE_ID`

## Form Field Mapping

The React form automatically sends these fields to EmailJS:

```javascript
{
  from_name: 'User entered name',        // Required, min 2 chars
  from_email: 'user@email.com',          // Required, valid email
  message: 'User message here...',       // Required, min 10 chars
  to_email: 'geeteshvaity22@gmail.com'  // Recipient (optional in template)
}
```

## Template Variable Syntax

EmailJS uses double curly braces: `{{variable_name}}`

Valid variables in your template:
- `{{from_name}}` ✅
- `{{from_email}}` ✅  
- `{{message}}` ✅
- `{{to_email}}` ✅ (optional)

## Verification Steps

After creating your template:

1. ✅ Template appears in your Email Templates list
2. ✅ Template ID is visible (copy it!)
3. ✅ Recipient email is set to your email
4. ✅ Variables are spelled exactly as: from_name, from_email, message
5. ✅ Template is marked as "Active" or "Published"

## Testing Your Template

EmailJS provides a preview/test feature:

1. Go to your template
2. Click "Test" or "Preview"
3. Fill in sample data
4. Send a test email to verify formatting

## Common Issues

### Template variables not showing
- ✅ Check spelling: `{{from_name}}` not `{{from_Name}}`
- ✅ Must have double curly braces: `{{ }}`
- ✅ Spaces matter: `{{ from_name }}` (with spaces) vs `{{from_name}}` (no spaces)
- ✅ Use lowercase: `from_email` not `from_Email`

### Recipient not receiving emails
- ✅ Verify recipient email is correct and verified in EmailJS
- ✅ Check spam folder
- ✅ Check EmailJS activity log for errors
- ✅ May need to verify ownership if using new email

### Template not working with form
- ✅ Template ID must match exactly in ContactSection.tsx
- ✅ Service ID must match exactly
- ✅ Make sure template is active/published
- ✅ Check browser console for errors

## Resources

- [EmailJS Template Documentation](https://www.emailjs.com/docs/user-guide/templates/)
- [EmailJS Variables & Conditions](https://www.emailjs.com/docs/user-guide/dynamic-content/)
