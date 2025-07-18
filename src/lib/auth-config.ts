// Auth configuration for different environments
export const getAuthConfig = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const isVercel = process.env.VERCEL === '1';
  
  // Base URL configuration
  let baseUrl: string;
  
  if (isProduction && isVercel) {
    // Use Vercel's environment variable for the deployment URL
    baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_SITE_URL || 'https://your-app-name.vercel.app';
  } else if (isProduction) {
    // Use custom production URL
    baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-app-name.vercel.app';
  } else {
    // Development
    baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  }

  return {
    baseUrl,
    redirectUrl: `${baseUrl}/auth/callback`,
    homeUrl: `${baseUrl}/`,
  };
};

// OAuth configuration
export const getOAuthConfig = () => {
  const config = getAuthConfig();
  
  return {
    redirectTo: config.redirectUrl,
    homeUrl: config.homeUrl,
  };
}; 