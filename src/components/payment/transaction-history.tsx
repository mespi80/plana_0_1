"use client";

import { useState, useEffect } from "react";
import { 
  CreditCard, 
  Calendar, 
  MapPin, 
  Download, 
  Eye, 
  Filter,
  Search,
  ArrowUpDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Transaction {
  id: string;
  eventTitle: string;
  eventDate: string;
  venue: string;
  amount: number;
  status: "completed" | "pending" | "failed" | "refunded";
  paymentMethod: string;
  ticketQuantity: number;
  transactionDate: string;
  paymentIntentId: string;
}

interface TransactionHistoryProps {
  onViewDetails?: (transaction: Transaction) => void;
  onDownloadReceipt?: (transaction: Transaction) => void;
}

export function TransactionHistory({
  onViewDetails,
  onDownloadReceipt
}: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    const mockTransactions: Transaction[] = [
      {
        id: "txn_1",
        eventTitle: "Jazz Night at Blue Note",
        eventDate: "Tonight, 8:00 PM",
        venue: "Blue Note Jazz Club",
        amount: 50.00,
        status: "completed",
        paymentMethod: "Visa •••• 4242",
        ticketQuantity: 2,
        transactionDate: "2024-01-15T20:30:00Z",
        paymentIntentId: "pi_1234567890"
      },
      {
        id: "txn_2",
        eventTitle: "Comedy Show at Laugh Factory",
        eventDate: "Tomorrow, 7:30 PM",
        venue: "Laugh Factory",
        amount: 36.00,
        status: "completed",
        paymentMethod: "Mastercard •••• 5555",
        ticketQuantity: 2,
        transactionDate: "2024-01-14T18:45:00Z",
        paymentIntentId: "pi_0987654321"
      },
      {
        id: "txn_3",
        eventTitle: "Art Gallery Opening",
        eventDate: "Friday, 6:00 PM",
        venue: "Modern Art Museum",
        amount: 24.00,
        status: "refunded",
        paymentMethod: "Visa •••• 4242",
        ticketQuantity: 2,
        transactionDate: "2024-01-13T15:20:00Z",
        paymentIntentId: "pi_1122334455"
      },
      {
        id: "txn_4",
        eventTitle: "Food & Wine Festival",
        eventDate: "Saturday, 2:00 PM",
        venue: "Central Park",
        amount: 90.00,
        status: "pending",
        paymentMethod: "Visa •••• 4242",
        ticketQuantity: 2,
        transactionDate: "2024-01-12T10:15:00Z",
        paymentIntentId: "pi_5566778899"
      }
    ];

    setTransactions(mockTransactions);
    setFilteredTransactions(mockTransactions);
    setIsLoading(false);
  }, []);

  // Filter and sort transactions
  useEffect(() => {
    let filtered = transactions;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(txn =>
        txn.eventTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.venue.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(txn => txn.status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === "date") {
        comparison = new Date(a.transactionDate).getTime() - new Date(b.transactionDate).getTime();
      } else if (sortBy === "amount") {
        comparison = a.amount - b.amount;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    setFilteredTransactions(filtered);
  }, [transactions, searchTerm, statusFilter, sortBy, sortOrder]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return "✓";
      case "pending":
        return "⏳";
      case "failed":
        return "✗";
      case "refunded":
        return "↻";
      default:
        return "•";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
          <span className="ml-2">Loading transactions...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Transaction History</h2>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export All
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "date" | "amount")}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="date">Sort by Date</option>
              <option value="amount">Sort by Amount</option>
            </select>

            {/* Sort Order */}
            <Button
              variant="outline"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="flex items-center space-x-2"
            >
              <ArrowUpDown className="w-4 h-4" />
              <span>{sortOrder === "asc" ? "Ascending" : "Descending"}</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <div className="space-y-4">
        {filteredTransactions.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== "all" 
                  ? "Try adjusting your filters" 
                  : "You haven't made any transactions yet"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredTransactions.map((transaction) => (
            <Card key={transaction.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{transaction.eventTitle}</h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                        {getStatusIcon(transaction.status)} {transaction.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{transaction.eventDate}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>{transaction.venue}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CreditCard className="w-4 h-4" />
                        <span>{transaction.paymentMethod}</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 text-sm">
                      <span className="text-gray-600">
                        {transaction.ticketQuantity} ticket{transaction.ticketQuantity > 1 ? 's' : ''} • 
                        {formatDate(transaction.transactionDate)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2 ml-4">
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">
                        ${transaction.amount.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Transaction ID: {transaction.paymentIntentId.slice(-8)}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewDetails?.(transaction)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDownloadReceipt?.(transaction)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Summary */}
      {filteredTransactions.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">
                Showing {filteredTransactions.length} of {transactions.length} transactions
              </span>
              <span className="font-medium text-gray-900">
                Total: ${filteredTransactions.reduce((sum, txn) => sum + txn.amount, 0).toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 