# PLANA - Real-time Local Discovery Platform

PLANA is a real-time local discovery platform that helps users find and book same-day events, experiences, and activities happening near them right now.

## 🚀 Features

- **Real-time Map Discovery**: Interactive map showing events happening now
- **Tinder-style Card Interface**: Swipe through events to discover new experiences
- **Same-day Booking**: Instant booking with seamless payment processing
- **QR Code System**: Unified QR codes for all experiences
- **Business Dashboard**: Event management and analytics for venues
- **Social Features**: Connect with friends and share experiences

## 🛠️ Tech Stack

- **Frontend**: Next.js 14+ with TypeScript and App Router
- **Styling**: Tailwind CSS + Shadcn UI components
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Payments**: Stripe
- **Maps**: Google Maps API
- **State Management**: React Server Components + nuqs
- **Forms**: React Hook Form + Zod validation

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd plana
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

   # Stripe Configuration
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_webhook_secret

   # Google Maps API
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

   # App Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/       # Dashboard routes
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Shadcn UI components
│   ├── auth/             # Authentication components
│   ├── events/           # Event-related components
│   ├── map/              # Map components
│   ├── booking/          # Booking components
│   └── business/         # Business dashboard components
├── lib/                  # Utility libraries
│   ├── supabase.ts       # Supabase client
│   ├── stripe.ts         # Stripe configuration
│   ├── maps.ts           # Google Maps configuration
│   └── utils.ts          # General utilities
├── types/                # TypeScript type definitions
│   ├── events.ts         # Event-related types
│   └── user.ts           # User-related types
└── hooks/                # Custom React hooks
    ├── use-auth.ts       # Authentication hook
    ├── use-events.ts     # Events data hook
    └── use-location.ts   # Location services hook
```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding Shadcn UI Components

```bash
npx shadcn@latest add <component-name>
```

### Database Schema

The project uses Supabase with the following main tables:
- `profiles` - User profiles and preferences
- `venues` - Venue information
- `events` - Event details
- `bookings` - User bookings
- `businesses` - Business accounts
- `check_ins` - QR code check-ins
- `favorites` - User favorites

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Manual Deployment

1. Build the project: `npm run build`
2. Start the production server: `npm run start`

## 📱 Mobile Support

The application is designed with a mobile-first approach and includes:
- Responsive design for all screen sizes
- Touch-friendly interactions
- PWA capabilities
- Optimized performance for mobile devices

## 🔒 Security

- Row Level Security (RLS) policies in Supabase
- Secure authentication with Supabase Auth
- PCI-compliant payment processing with Stripe
- Environment variable protection
- Input validation with Zod

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@plana.com or create an issue in the repository.
