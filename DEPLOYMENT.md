# PLANA Deployment Guide - Vercel

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Ensure your code is pushed to GitHub
3. **Environment Variables**: Gather all required API keys and secrets

## Required Environment Variables

Add these environment variables in your Vercel project settings:

### Supabase Configuration
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Google Maps Configuration
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
NEXT_PUBLIC_GOOGLE_MAPS_ID=your_google_maps_id
```

### Stripe Configuration
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

### QR Code Configuration
```
QR_SECRET_KEY=your_qr_secret_key
```

### Next.js Configuration
```
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your_nextauth_secret
```

## Deployment Steps

### 1. Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Select the repository containing PLANA

### 2. Configure Project Settings

1. **Framework Preset**: Next.js (should auto-detect)
2. **Root Directory**: `plana` (if your project is in a subdirectory)
3. **Build Command**: `npm run build` (default)
4. **Output Directory**: `.next` (default)
5. **Install Command**: `npm install` (default)

### 3. Add Environment Variables

1. In the project settings, go to "Environment Variables"
2. Add each environment variable listed above
3. Make sure to set the correct environment (Production, Preview, Development)

### 4. Deploy

1. Click "Deploy"
2. Vercel will build and deploy your application
3. Monitor the build logs for any errors

## Post-Deployment Configuration

### 1. Update Stripe Webhook URL

After deployment, update your Stripe webhook endpoint:
- Go to your Stripe Dashboard
- Navigate to Webhooks
- Update the endpoint URL to: `https://your-domain.vercel.app/api/stripe/webhook`

### 2. Update Google Maps API

Ensure your Google Maps API key has the correct domain restrictions:
- Add your Vercel domain to the allowed referrers
- Enable necessary Google Maps APIs (Maps JavaScript API, Geocoding API, Places API)

### 3. Update Supabase Configuration

1. Go to your Supabase project settings
2. Add your Vercel domain to the allowed origins
3. Update any redirect URLs if needed

## Troubleshooting

### Common Issues

1. **Build Failures**: Check the build logs for missing dependencies or TypeScript errors
2. **Environment Variables**: Ensure all required variables are set in Vercel
3. **API Errors**: Verify API keys are correct and have proper permissions
4. **CORS Issues**: Update Supabase and Google Maps settings with your domain

### Performance Optimization

1. **Image Optimization**: Vercel automatically optimizes images
2. **Edge Functions**: Consider using Vercel Edge Functions for better performance
3. **Caching**: Implement proper caching strategies for API calls

## Monitoring

1. **Vercel Analytics**: Enable Vercel Analytics for performance monitoring
2. **Error Tracking**: Set up error tracking with services like Sentry
3. **Uptime Monitoring**: Monitor your application's uptime

## Security Considerations

1. **Environment Variables**: Never commit sensitive keys to your repository
2. **API Key Restrictions**: Set proper domain restrictions on all API keys
3. **HTTPS**: Vercel automatically provides HTTPS
4. **Rate Limiting**: Implement rate limiting for your API routes

## Support

If you encounter issues:
1. Check Vercel's documentation
2. Review the build logs
3. Verify all environment variables are set correctly
4. Test locally with the same environment variables 