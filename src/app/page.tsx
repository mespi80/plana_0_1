import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Calendar, DollarSign, Users } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            PLANA
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Discover and book same-day events, experiences, and activities happening near you right now.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
              Get Started
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-slate-900">
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardHeader>
              <MapPin className="w-8 h-8 text-purple-400 mb-2" />
              <CardTitle>Real-time Discovery</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-slate-300">
                Find events happening right now in your area with our live map interface.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardHeader>
              <Calendar className="w-8 h-8 text-purple-400 mb-2" />
              <CardTitle>Same-day Booking</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-slate-300">
                Book tickets and reservations instantly with seamless payment processing.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardHeader>
              <DollarSign className="w-8 h-8 text-purple-400 mb-2" />
              <CardTitle>Best Prices</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-slate-300">
                Get the best deals on last-minute tickets and exclusive same-day offers.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardHeader>
              <Users className="w-8 h-8 text-purple-400 mb-2" />
              <CardTitle>Social Experience</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-slate-300">
                Connect with friends and discover events together with social features.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to discover what&apos;s happening?
          </h2>
          <p className="text-slate-300 mb-8">
            Join thousands of users finding amazing experiences every day.
          </p>
          <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
            Start Exploring
          </Button>
        </div>
      </div>
    </div>
  )
}
