"use client";

import { useState, useEffect } from "react";
import { CreditCard, Plus, Trash2, Edit, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PaymentMethod {
  id: string;
  type: string;
  card?: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  };
  isDefault?: boolean;
}

interface SavedPaymentMethodsProps {
  onSelect?: (paymentMethod: PaymentMethod) => void;
  onAdd?: () => void;
  onEdit?: (paymentMethod: PaymentMethod) => void;
  onDelete?: (paymentMethodId: string) => void;
  onSetDefault?: (paymentMethodId: string) => void;
  selectedId?: string;
}

export function SavedPaymentMethods({
  onSelect,
  onAdd,
  onEdit,
  onDelete,
  onSetDefault,
  selectedId
}: SavedPaymentMethodsProps) {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    const mockPaymentMethods: PaymentMethod[] = [
      {
        id: "pm_1",
        type: "card",
        card: {
          brand: "visa",
          last4: "4242",
          expMonth: 12,
          expYear: 2025
        },
        isDefault: true
      },
      {
        id: "pm_2",
        type: "card",
        card: {
          brand: "mastercard",
          last4: "5555",
          expMonth: 8,
          expYear: 2026
        }
      }
    ];

    setPaymentMethods(mockPaymentMethods);
    setIsLoading(false);
  }, []);

  const handleDelete = async (paymentMethodId: string) => {
    if (confirm("Are you sure you want to delete this payment method?")) {
      // In a real app, call API to delete
      setPaymentMethods(prev => prev.filter(pm => pm.id !== paymentMethodId));
      onDelete?.(paymentMethodId);
    }
  };

  const handleSetDefault = async (paymentMethodId: string) => {
    // In a real app, call API to set default
    setPaymentMethods(prev => 
      prev.map(pm => ({
        ...pm,
        isDefault: pm.id === paymentMethodId
      }))
    );
    onSetDefault?.(paymentMethodId);
  };

  const getCardIcon = (brand: string) => {
    switch (brand.toLowerCase()) {
      case 'visa':
        return '💳';
      case 'mastercard':
        return '💳';
      case 'amex':
        return '💳';
      default:
        return '💳';
    }
  };

  const getCardBrandName = (brand: string) => {
    switch (brand.toLowerCase()) {
      case 'visa':
        return 'Visa';
      case 'mastercard':
        return 'Mastercard';
      case 'amex':
        return 'American Express';
      default:
        return brand.charAt(0).toUpperCase() + brand.slice(1);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
          <span className="ml-2">Loading payment methods...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Saved Payment Methods</h3>
        <Button
          onClick={onAdd}
          variant="outline"
          size="sm"
          className="flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New</span>
        </Button>
      </div>

      {paymentMethods.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No saved payment methods</h4>
            <p className="text-gray-600 mb-4">
              Add a payment method to make booking events faster and easier.
            </p>
            <Button onClick={onAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Add Payment Method
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {paymentMethods.map((paymentMethod) => (
            <Card
              key={paymentMethod.id}
              className={`cursor-pointer transition-all ${
                selectedId === paymentMethod.id
                  ? 'ring-2 ring-purple-500 border-purple-500'
                  : 'hover:shadow-md'
              }`}
              onClick={() => onSelect?.(paymentMethod)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-lg">{getCardIcon(paymentMethod.card?.brand || 'card')}</span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">
                          {getCardBrandName(paymentMethod.card?.brand || 'card')} •••• {paymentMethod.card?.last4}
                        </span>
                        {paymentMethod.isDefault && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <Check className="w-3 h-3 mr-1" />
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        Expires {paymentMethod.card?.expMonth}/{paymentMethod.card?.expYear}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {!paymentMethod.isDefault && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSetDefault(paymentMethod.id);
                        }}
                      >
                        Set Default
                      </Button>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit?.(paymentMethod);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(paymentMethod.id);
                      }}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 