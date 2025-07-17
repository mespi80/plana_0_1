"use client";

import { useState } from "react";
import { CreditCard, History, Settings, Plus } from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { SavedPaymentMethods } from "@/components/payment/saved-payment-methods";
import { TransactionHistory } from "@/components/payment/transaction-history";
import { PaymentForm } from "@/components/payment/payment-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type TabType = "payment-methods" | "transaction-history" | "payment-preferences";

export default function PaymentSettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("payment-methods");
  const [showAddPaymentMethod, setShowAddPaymentMethod] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | undefined>(undefined);

  const tabs = [
    {
      id: "payment-methods" as TabType,
      label: "Payment Methods",
      icon: CreditCard
    },
    {
      id: "transaction-history" as TabType,
      label: "Transaction History",
      icon: History
    },
    {
      id: "payment-preferences" as TabType,
      label: "Preferences",
      icon: Settings
    }
  ];

  const handleAddPaymentMethod = () => {
    setShowAddPaymentMethod(true);
  };

  const handleEditPaymentMethod = (paymentMethod: any) => {
    console.log("Edit payment method:", paymentMethod);
    // In a real app, this would open an edit modal
  };

  const handleDeletePaymentMethod = (paymentMethodId: string) => {
    console.log("Delete payment method:", paymentMethodId);
    // In a real app, this would call an API
  };

  const handleSetDefaultPaymentMethod = (paymentMethodId: string) => {
    console.log("Set default payment method:", paymentMethodId);
    // In a real app, this would call an API
  };

  const handleViewTransactionDetails = (transaction: any) => {
    console.log("View transaction details:", transaction);
    // In a real app, this would open a modal or navigate to details page
  };

  const handleDownloadReceipt = (transaction: any) => {
    console.log("Download receipt:", transaction);
    // In a real app, this would generate and download a PDF receipt
  };

  const handlePaymentSuccess = (paymentIntentId: string) => {
    console.log("Payment successful:", paymentIntentId);
    setShowAddPaymentMethod(false);
    // In a real app, this would refresh the payment methods list
  };

  const handlePaymentError = (error: string) => {
    console.error("Payment error:", error);
    // In a real app, this would show an error message
  };

  if (showAddPaymentMethod) {
    return (
      <AppLayout>
        <div className="flex-1 p-4 bg-gray-50">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Add Payment Method</h1>
              <Button
                variant="outline"
                onClick={() => setShowAddPaymentMethod(false)}
              >
                Cancel
              </Button>
            </div>
            
            <PaymentForm
              amount={0}
              eventId=""
              eventTitle="Add Payment Method"
              ticketQuantity={1}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex-1 p-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Payment Settings</h1>
            <p className="text-gray-600">Manage your payment methods and view transaction history</p>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-white rounded-lg p-1 mb-6 shadow-sm">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "bg-purple-100 text-purple-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === "payment-methods" && (
              <div className="space-y-6">
                <SavedPaymentMethods
                  onAdd={handleAddPaymentMethod}
                  onEdit={handleEditPaymentMethod}
                  onDelete={handleDeletePaymentMethod}
                  onSetDefault={handleSetDefaultPaymentMethod}
                  selectedId={selectedPaymentMethod}
                />
                
                {/* Payment Preferences */}
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Auto-save payment methods</h4>
                        <p className="text-sm text-gray-600">
                          Automatically save new payment methods for future use
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Email receipts</h4>
                        <p className="text-sm text-gray-600">
                          Send email receipts for all transactions
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "transaction-history" && (
              <TransactionHistory
                onViewDetails={handleViewTransactionDetails}
                onDownloadReceipt={handleDownloadReceipt}
              />
            )}

            {activeTab === "payment-preferences" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Billing Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          First Name
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          defaultValue="John"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          defaultValue="Doe"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        defaultValue="john.doe@example.com"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Billing Address
                      </label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        rows={3}
                        defaultValue="123 Main St, New York, NY 10001"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Two-factor authentication</h4>
                        <p className="text-sm text-gray-600">
                          Require additional verification for payments
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Payment notifications</h4>
                        <p className="text-sm text-gray-600">
                          Get notified of all payment activities
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end">
                  <Button>
                    Save Preferences
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
} 