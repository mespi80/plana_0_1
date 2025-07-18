# Google OAuth Setup for Vercel Deployment

## Problem
When using Google OAuth on your Vercel deployment, users are redirected to `localhost:3000` instead of your Vercel domain.

## Solution

### 1. Update Google OAuth Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Find your OAuth 2.0 Client ID and click on it
4. In the **Authorized redirect URIs** section, add:
   ```
   https://your-app-name.vercel.app/auth/callback
   ```
   (Replace `your-app-name` with your actual Vercel app name)

### 2. Update Supabase Configuration

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** → **URL Configuration**
4. Update the **Site URL** to:
   ```
   https://your-app-name.vercel.app
   ```
5. Add these URLs to **Redirect URLs**:
   ```
   https://your-app-name.vercel.app/auth/callback
   https://your-app-name.vercel.app/
   https://your-app-name.vercel.app/auth/reset-password
   ```

### 3. Add Environment Variables in Vercel

In your Vercel dashboard, add these environment variables:

```
NEXT_PUBLIC_SITE_URL=https://your-app-name.vercel.app
```

### 4. Code Changes Made

The code has been updated to use dynamic URL configuration:

- **`src/lib/auth-config.ts`** - New configuration file that handles different environments
- **`src/app/auth/login/page.tsx`** - Updated to use the new OAuth configuration

### 5. How It Works

The new configuration automatically detects the environment:
- **Development**: Uses `http://localhost:3000`
- **Vercel Production**: Uses `https://your-app-name.vercel.app`
- **Custom Production**: Uses `NEXT_PUBLIC_SITE_URL` environment variable

### 6. Testing

1. Deploy your changes to Vercel
2. Try the Google OAuth flow
3. Verify you're redirected to your Vercel domain, not localhost

### 7. Troubleshooting

If you're still having issues:

1. **Check Vercel URL**: Make sure you're using the correct Vercel domain
2. **Clear Browser Cache**: Clear cookies and cache for your domain
3. **Check Supabase Logs**: Look at the Authentication logs in Supabase dashboard
4. **Verify Environment Variables**: Ensure `NEXT_PUBLIC_SITE_URL` is set correctly

### 8. Additional Notes

- The `VERCEL_URL` environment variable is automatically provided by Vercel
- The configuration falls back to `NEXT_PUBLIC_SITE_URL` if needed
- All OAuth flows (Google, password reset) now use the same configuration

## Environment Variables Summary

Add these to your Vercel environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=https://your-app-name.vercel.app
```

Replace `your-app-name` with your actual Vercel app name. 