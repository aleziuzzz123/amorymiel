# Netlify Environment Variable Setup

## Required Environment Variable

You need to add the Resend API key to your Netlify environment variables:

1. Go to your Netlify dashboard
2. Navigate to your site settings
3. Go to "Environment variables"
4. Add a new variable:
   - **Key**: `RESEND_API_KEY`
   - **Value**: `re_T8PmbfXN_PKf26mPZa8MY1sBmJd52nYJE`

## After adding the environment variable:

1. Redeploy your site (or it will auto-deploy)
2. Test the cart abandonment functionality

The cart abandonment emails will now work through the Netlify function, bypassing CORS issues.
