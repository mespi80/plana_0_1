"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/app-layout";

export default function PrivacyPolicyPage() {
  const router = useRouter();

  return (
    <AppLayout>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => router.back()}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Privacy Policy</h1>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="prose prose-gray max-w-none">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
              <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-700 mb-4">
                Welcome to PLANA ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our event planning and booking platform.
              </p>
              <p className="text-gray-700">
                By using PLANA, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
              
              <h3 className="text-xl font-medium text-gray-900 mb-3">2.1 Personal Information</h3>
              <p className="text-gray-700 mb-4">We may collect the following personal information:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Name, email address, and phone number</li>
                <li>Profile information and preferences</li>
                <li>Payment and billing information</li>
                <li>Location data (with your consent)</li>
                <li>Profile pictures and user-generated content</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-900 mb-3">2.2 Usage Information</h3>
              <p className="text-gray-700 mb-4">We automatically collect certain information when you use our service:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Device information (IP address, browser type, operating system)</li>
                <li>Usage patterns and interactions with our platform</li>
                <li>Event booking history and preferences</li>
                <li>Search queries and navigation data</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-900 mb-3">2.3 Event and Business Information</h3>
              <p className="text-gray-700 mb-4">For business users and event organizers, we may collect:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Business name, address, and contact information</li>
                <li>Event details, descriptions, and media</li>
                <li>Pricing and availability information</li>
                <li>Customer reviews and ratings</li>
                <li>Analytics and performance data</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-700 mb-4">We use the collected information for the following purposes:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Provide, maintain, and improve our services</li>
                <li>Process bookings and payments</li>
                <li>Send notifications and updates about events</li>
                <li>Personalize your experience and recommendations</li>
                <li>Communicate with you about our services</li>
                <li>Ensure platform security and prevent fraud</li>
                <li>Comply with legal obligations</li>
                <li>Analyze usage patterns to improve our platform</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Information Sharing and Disclosure</h2>
              <p className="text-gray-700 mb-4">We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:</p>
              
              <h3 className="text-xl font-medium text-gray-900 mb-3">4.1 Service Providers</h3>
              <p className="text-gray-700 mb-4">We may share information with trusted third-party service providers who assist us in operating our platform, such as:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Payment processors (Stripe)</li>
                <li>Cloud hosting services</li>
                <li>Analytics and monitoring tools</li>
                <li>Customer support services</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-900 mb-3">4.2 Event Organizers</h3>
              <p className="text-gray-700 mb-4">When you book an event, we may share relevant information with the event organizer to facilitate your booking.</p>

              <h3 className="text-xl font-medium text-gray-900 mb-3">4.3 Legal Requirements</h3>
              <p className="text-gray-700 mb-4">We may disclose your information if required by law or to protect our rights, property, or safety.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Security</h2>
              <p className="text-gray-700 mb-4">We implement appropriate security measures to protect your personal information:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and authentication measures</li>
                <li>Secure payment processing</li>
                <li>Regular backups and disaster recovery procedures</li>
              </ul>
              <p className="text-gray-700">
                However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Your Rights and Choices</h2>
              <p className="text-gray-700 mb-4">You have the following rights regarding your personal information:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li><strong>Access:</strong> Request a copy of your personal information</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                <li><strong>Restriction:</strong> Request limitation of data processing</li>
              </ul>
              <p className="text-gray-700">
                To exercise these rights, please contact us using the information provided below.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Cookies and Tracking Technologies</h2>
              <p className="text-gray-700 mb-4">We use cookies and similar technologies to:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Remember your preferences and settings</li>
                <li>Analyze website traffic and usage patterns</li>
                <li>Provide personalized content and recommendations</li>
                <li>Ensure platform functionality and security</li>
              </ul>
              <p className="text-gray-700">
                You can control cookie settings through your browser preferences. However, disabling certain cookies may affect platform functionality.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Third-Party Services</h2>
              <p className="text-gray-700 mb-4">Our platform may contain links to third-party websites or integrate with third-party services. We are not responsible for the privacy practices of these external services. We encourage you to review their privacy policies.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Children's Privacy</h2>
              <p className="text-gray-700 mb-4">Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. International Data Transfers</h2>
              <p className="text-gray-700 mb-4">Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Changes to This Privacy Policy</h2>
              <p className="text-gray-700 mb-4">We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this Privacy Policy periodically.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Contact Us</h2>
              <p className="text-gray-700 mb-4">If you have any questions about this Privacy Policy or our privacy practices, please contact us:</p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-2"><strong>Email:</strong> privacy@plana.com</p>
                <p className="text-gray-700 mb-2"><strong>Address:</strong> [Your Business Address]</p>
                <p className="text-gray-700"><strong>Phone:</strong> [Your Phone Number]</p>
              </div>
            </section>

            <div className="text-center text-sm text-gray-500 mt-8 pt-8 border-t border-gray-200">
              <p>This Privacy Policy is effective as of the date listed above and applies to all users of the PLANA platform.</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
} 