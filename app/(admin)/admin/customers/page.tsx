// app/admin/customers/page.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  MoreVertical,
  Eye,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  ShoppingBag,
  DollarSign,
  Send,
  Tag,
} from "lucide-react";
import { supabase } from "@/utils/supabase/client";
import { toast } from "sonner";
import Link from "next/link";

// Types
interface Customer {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  total_orders: number;
  total_spent: number;
  first_order: string;
  last_order: string;
  order_statuses: {
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
}

interface CustomerOrder {
  id: number;
  order_status: string;
  total_amount: number;
  created_at: string;
  items: any[];
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  type: "promotional" | "transactional" | "abandoned_cart";
}

export default function AdminCustomersPage() {
  // State
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<string>("last_order");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [customerOrders, setCustomerOrders] = useState<CustomerOrder[]>([]);
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [customMessage, setCustomMessage] = useState("");

  // Email templates (you can move this to a database later)
  const defaultEmailTemplates: EmailTemplate[] = [
    {
      id: "welcome",
      name: "Welcome Email",
      subject: "Welcome to Revival Glow!",
      body: "Thank you for your purchase. We're excited to have you as a customer!",
      type: "transactional",
    },
    {
      id: "shipping_update",
      name: "Shipping Update",
      subject: "Your order has shipped!",
      body: "Great news! Your order has been shipped and is on its way to you.",
      type: "transactional",
    },
    {
      id: "loyalty_discount",
      name: "Loyalty Discount",
      subject: "Special discount for our valued customer",
      body: "As a thank you for your loyalty, here's a 15% discount on your next purchase!",
      type: "promotional",
    },
    {
      id: "reorder_reminder",
      name: "Reorder Reminder",
      subject: "Time to restock your favorites?",
      body: "It looks like you might be running low on your favorite products. Here's a reminder to reorder!",
      type: "promotional",
    },
  ];

  // Fetch customers and their order data
  useEffect(() => {
    fetchCustomers();
    setEmailTemplates(defaultEmailTemplates);
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);

      // Get all orders to aggregate customer data
      const { data: orders, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Aggregate customer data from orders
      const customerMap = new Map<string, Customer>();

      orders?.forEach((order) => {
        const customerEmail = order.email;

        if (!customerMap.has(customerEmail)) {
          customerMap.set(customerEmail, {
            id: customerEmail, // Use email as ID for now
            email: order.email,
            full_name: order.full_name,
            phone: order.phone,
            address: order.address,
            city: order.city,
            state: order.state,
            postal_code: order.postal_code,
            country: order.country,
            total_orders: 0,
            total_spent: 0,
            first_order: order.created_at,
            last_order: order.created_at,
            order_statuses: {
              pending: 0,
              processing: 0,
              shipped: 0,
              delivered: 0,
              cancelled: 0,
            },
          });
        }

        const customer = customerMap.get(customerEmail)!;
        customer.total_orders += 1;
        customer.total_spent += order.total_amount;
        customer.order_statuses[
          order.order_status as keyof typeof customer.order_statuses
        ] += 1;

        // Update first and last order dates
        if (new Date(order.created_at) < new Date(customer.first_order)) {
          customer.first_order = order.created_at;
        }
        if (new Date(order.created_at) > new Date(customer.last_order)) {
          customer.last_order = order.created_at;
        }
      });

      setCustomers(Array.from(customerMap.values()));
    } catch (error) {
      console.error("Error fetching customers:", error);
      toast.error("Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerOrders = async (customerEmail: string) => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("email", customerEmail)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCustomerOrders(data || []);
    } catch (error) {
      console.error("Error fetching customer orders:", error);
      toast.error("Failed to load customer orders");
    }
  };

  // Filter and sort customers
  const filteredCustomers = useMemo(() => {
    let filtered = customers.filter(
      (customer) =>
        customer.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm) ||
        customer.city.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort customers
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "last_order":
          return (
            new Date(b.last_order).getTime() - new Date(a.last_order).getTime()
          );
        case "total_spent":
          return b.total_spent - a.total_spent;
        case "total_orders":
          return b.total_orders - a.total_orders;
        case "name":
          return a.full_name.localeCompare(b.full_name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [customers, searchTerm, sortBy]);

  // Customer segmentation
  const customerSegments = useMemo(() => {
    const segments = {
      new: customers.filter((c) => c.total_orders === 1),
      regular: customers.filter(
        (c) => c.total_orders >= 2 && c.total_orders <= 5
      ),
      vip: customers.filter((c) => c.total_orders > 5),
      highValue: customers.filter((c) => c.total_spent > 50000), // $500+ in cents
      inactive: customers.filter((c) => {
        const lastOrderDate = new Date(c.last_order);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return lastOrderDate < thirtyDaysAgo;
      }),
    };

    return segments;
  }, [customers]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount / 100);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get customer segment badge
  const getCustomerSegment = (customer: Customer) => {
    if (customer.total_orders === 1)
      return { label: "New", variant: "secondary" as const };
    if (customer.total_orders > 5)
      return { label: "VIP", variant: "default" as const };
    if (customer.total_spent > 50000)
      return { label: "High Value", variant: "default" as const };

    const lastOrderDate = new Date(customer.last_order);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    if (lastOrderDate < thirtyDaysAgo)
      return { label: "Inactive", variant: "outline" as const };

    return { label: "Regular", variant: "secondary" as const };
  };

  // Send email to customer
  const sendCustomerEmail = async () => {
    if (!selectedCustomer || !selectedTemplate) return;

    try {
      const template = emailTemplates.find((t) => t.id === selectedTemplate);
      if (!template) return;

      // In a real implementation, you would integrate with your email service
      // For now, we'll simulate the email sending

      const emailData = {
        to: selectedCustomer.email,
        subject: template.subject,
        body: customMessage || template.body,
        customerName: selectedCustomer.full_name,
      };

      console.log("Sending email:", emailData);

      // TODO: Integrate with your email service (Resend, SendGrid, etc.)
      // await fetch('/api/send-email', {
      //   method: 'POST',
      //   body: JSON.stringify(emailData)
      // });

      toast.success(`Email sent to ${selectedCustomer.email}`);
      setShowEmailDialog(false);
      setSelectedTemplate("");
      setCustomMessage("");
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send email");
    }
  };

  // View customer details
  const handleViewCustomer = async (customer: Customer) => {
    setSelectedCustomer(customer);
    await fetchCustomerOrders(customer.email);
    setShowCustomerDetails(true);
  };

  // Render customer details modal
  const renderCustomerDetails = () => {
    if (!selectedCustomer) return null;

    const segment = getCustomerSegment(selectedCustomer);

    return (
      <Dialog open={showCustomerDetails} onOpenChange={setShowCustomerDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              {selectedCustomer.full_name}
            </DialogTitle>
            <DialogDescription>
              Customer since {formatDate(selectedCustomer.first_order)}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{selectedCustomer.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{selectedCustomer.phone}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p>{selectedCustomer.address}</p>
                    <p>
                      {selectedCustomer.city}, {selectedCustomer.state}{" "}
                      {selectedCustomer.postal_code}
                    </p>
                    <p>{selectedCustomer.country}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Customer Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Total Orders</span>
                  <span className="font-medium">
                    {selectedCustomer.total_orders}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Total Spent</span>
                  <span className="font-medium">
                    {formatCurrency(selectedCustomer.total_spent)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Customer Segment</span>
                  <Badge variant={segment.variant}>{segment.label}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>First Order</span>
                  <span>{formatDate(selectedCustomer.first_order)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Order</span>
                  <span>{formatDate(selectedCustomer.last_order)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Order Status Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Order Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {Object.entries(selectedCustomer.order_statuses).map(
                    ([status, count]) =>
                      count > 0 && (
                        <div key={status} className="flex justify-between">
                          <span className="capitalize">{status}</span>
                          <span className="font-medium">{count}</span>
                        </div>
                      )
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Orders */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-sm">Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {customerOrders.slice(0, 5).map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between border-b pb-3"
                    >
                      <div>
                        <p className="font-medium">Order #{order.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(order.created_at)} • {order.items.length}{" "}
                          items
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {formatCurrency(order.total_amount)}
                        </p>
                        <Badge variant="outline" className="capitalize">
                          {order.order_status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {customerOrders.length === 0 && (
                    <p className="text-muted-foreground text-center py-4">
                      No orders found
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedCustomer(selectedCustomer);
                setShowEmailDialog(true);
              }}
              className="gap-2"
            >
              <Send className="w-4 h-4" />
              Send Email
            </Button>
            <Button onClick={() => setShowCustomerDetails(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  // Render email dialog
  const renderEmailDialog = () => {
    if (!selectedCustomer) return null;

    const template = emailTemplates.find((t) => t.id === selectedTemplate);

    return (
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Send Email to {selectedCustomer.full_name}
            </DialogTitle>
            <DialogDescription>
              Send a personalized message to this customer.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Email Template</label>
              <Select
                value={selectedTemplate}
                onValueChange={setSelectedTemplate}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  {emailTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {template && (
              <>
                <div>
                  <label className="text-sm font-medium">Subject</label>
                  <Input value={template.subject} readOnly />
                </div>
                <div>
                  <label className="text-sm font-medium">Message</label>
                  <textarea
                    value={customMessage || template.body}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    className="w-full h-32 p-3 border rounded-md text-sm resize-none"
                    placeholder="Customize your message..."
                  />
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEmailDialog(false)}>
              Cancel
            </Button>
            <Button onClick={sendCustomerEmail} disabled={!selectedTemplate}>
              <Send className="w-4 h-4 mr-2" />
              Send Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif text-foreground mb-2">
              Customer Management
            </h1>
            <p className="text-muted-foreground">
              Manage customer relationships and communications
            </p>
          </div>
        </div>

        {/* Customer Segments Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">
                  {customers.length}
                </p>
                <p className="text-sm text-muted-foreground">Total Customers</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {customerSegments.vip.length}
                </p>
                <p className="text-sm text-muted-foreground">VIP Customers</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {customerSegments.highValue.length}
                </p>
                <p className="text-sm text-muted-foreground">High Value</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-amber-600">
                  {customerSegments.inactive.length}
                </p>
                <p className="text-sm text-muted-foreground">Inactive</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {customerSegments.new.length}
                </p>
                <p className="text-sm text-muted-foreground">New Customers</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search customers by name, email, phone, or city..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last_order">Last Order</SelectItem>
                    <SelectItem value="total_spent">Total Spent</SelectItem>
                    <SelectItem value="total_orders">Total Orders</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => {
                  // TODO: Implement bulk email feature
                  toast.info("Bulk email feature coming soon!");
                }}
              >
                <Send className="w-4 h-4" />
                Bulk Email
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Customers Table */}
        <Card>
          <CardHeader>
            <CardTitle>Customers ({filteredCustomers.length})</CardTitle>
            <CardDescription>
              {filteredCustomers.length} of {customers.length} customers shown
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              // Skeleton loader
              [...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="border-b border-border p-4 animate-pulse"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="w-48 h-4 bg-muted rounded"></div>
                      <div className="w-32 h-3 bg-muted rounded"></div>
                    </div>
                    <div className="w-20 h-6 bg-muted rounded"></div>
                    <div className="w-24 h-8 bg-muted rounded"></div>
                  </div>
                </div>
              ))
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold text-foreground">
                        Customer
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">
                        Contact
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">
                        Orders
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">
                        Total Spent
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">
                        Segment
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">
                        Last Order
                      </th>
                      <th className="text-right py-3 px-4 font-semibold text-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {filteredCustomers.map((customer, index) => {
                        const segment = getCustomerSegment(customer);
                        return (
                          <motion.tr
                            key={customer.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ delay: index * 0.05 }}
                            className="border-b border-border hover:bg-muted/50 transition-colors"
                          >
                            <td className="py-4 px-4">
                              <div>
                                <p className="font-medium text-foreground">
                                  {customer.full_name}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Since {formatDate(customer.first_order)}
                                </p>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div>
                                <p className="text-foreground">
                                  {customer.email}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {customer.phone}
                                </p>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                <ShoppingBag className="w-4 h-4 text-muted-foreground" />
                                <span className="font-medium">
                                  {customer.total_orders}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-4 font-semibold text-foreground">
                              {formatCurrency(customer.total_spent)}
                            </td>
                            <td className="py-4 px-4">
                              <Badge variant={segment.variant}>
                                {segment.label}
                              </Badge>
                            </td>
                            <td className="py-4 px-4 text-foreground">
                              {formatDate(customer.last_order)}
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="gap-2"
                                  onClick={() => handleViewCustomer(customer)}
                                >
                                  <Eye className="w-4 h-4" />
                                  View
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button size="sm" variant="outline">
                                      <MoreVertical className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setSelectedCustomer(customer);
                                        setShowEmailDialog(true);
                                      }}
                                    >
                                      <Send className="w-4 h-4 mr-2" />
                                      Send Email
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Tag className="w-4 h-4 mr-2" />
                                      Add to Segment
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </AnimatePresence>
                  </tbody>
                </table>
                {filteredCustomers.length === 0 && (
                  <div className="text-center py-12">
                    <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No customers found</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modals */}
        {renderCustomerDetails()}
        {renderEmailDialog()}
      </motion.div>
    </div>
  );
}
