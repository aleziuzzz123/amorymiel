# Netlify Environment Variables Setup

## Required Environment Variables

You need to set up the following environment variables in your Netlify dashboard:

### 1. For the Netlify Function (Server-side)
- **Variable Name**: `RESEND_API_KEY`
- **Value**: `re_T8PmbfXN_PKf26mPZa8MY1sBmJd52nYJE`

### 2. For the Frontend (Client-side)
- **Variable Name**: `VITE_RESEND_API_KEY`
- **Value**: `re_T8PmbfXN_PKf26mPZa8MY1sBmJd52nYJE`

## How to Set Up in Netlify:

1. Go to your Netlify dashboard
2. Select your project (amorymiel)
3. Go to **Site settings** → **Environment variables**
4. Click **Add variable**
5. Add both variables above
6. Click **Save**

## Important Notes:

- The `RESEND_API_KEY` is used by the Netlify function (server-side)
- The `VITE_RESEND_API_KEY` is used by the React app (client-side)
- Both should have the same value: `re_T8PmbfXN_PKf26mPZa8MY1sBmJd52nYJE`
- After adding the variables, you may need to trigger a new deployment

## After Setting Up:

1. The deployment should now succeed
2. Cart abandonment emails should work
3. All email functionality should be restored

## Testing:

1. Add items to cart
2. Click "Pagar con Mercado Pago"
3. Cancel the payment
4. Check your email for the cart abandonment email

