import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Section,
  Button,
} from "@react-email/components";
import * as React from "react";

type QuoteRequestNotificationEmailProps = {
  customerName: string;
  customerEmail: string;
  orderNumber: string;
  shippingAddress: string;
  country: string;
  itemsSummary: string;
  isAdminNotification?: boolean;
  adminDashboardUrl?: string;
};

export default function QuoteRequestNotificationEmail({
  customerName = "Valued Customer",
  customerEmail = "customer@example.com",
  orderNumber = "#1000",
  shippingAddress = "123 Main St, City, Country",
  country = "Nigeria",
  itemsSummary = "2x Product Name",
  isAdminNotification = false,
  adminDashboardUrl = "https://yourwebsite.com/admin/orders",
}: QuoteRequestNotificationEmailProps) {
  if (isAdminNotification) {
    return (
      <Html>
        <Head />
        <Body style={main}>
          <Container style={container}>
            <Section style={header}>
              <Text style={headerTitle}>Revival Glow Admin</Text>
            </Section>
            <Section style={content}>
              <Text style={heading}>📦 New Custom Shipping Quote Request</Text>
              <Text style={paragraph}>
                A new order quote request was submitted for an unsupported shipping destination ({country}).
              </Text>
              <Section style={orderDetails}>
                <Text style={detailText}><strong>Order Ref:</strong> #{orderNumber}</Text>
                <Text style={detailText}><strong>Customer Name:</strong> {customerName}</Text>
                <Text style={detailText}><strong>Customer Email:</strong> {customerEmail}</Text>
                <Text style={detailText}><strong>Destination:</strong> {shippingAddress}, {country}</Text>
                <Text style={detailText}><strong>Items:</strong> {itemsSummary}</Text>
              </Section>
              <Section style={buttonContainer}>
                <Button style={button} href={adminDashboardUrl}>
                  Set Shipping Fee & Send Invoice
                </Button>
              </Section>
            </Section>
            <Section style={footer}>
              <Text style={footerText}>
                © {new Date().getFullYear()} Revival Glow Admin Notifications
              </Text>
            </Section>
          </Container>
        </Body>
      </Html>
    );
  }

  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={headerTitle}>Revival Glow</Text>
          </Section>
          <Section style={content}>
            <Text style={heading}>Shipping Quote Request Received</Text>
            <Text style={paragraph}>Hi {customerName},</Text>
            <Text style={paragraph}>
              Thank you for choosing Revival Glow! We have received your custom shipping quote request for order #{orderNumber}.
            </Text>
            <Text style={paragraph}>
              Because your shipping destination ({country}) is outside our standard automated carrier zones, our fulfillment team is calculating the exact international shipping cost to give you the best available rate.
            </Text>
            <Section style={orderDetails}>
              <Text style={detailText}><strong>Order Ref:</strong> #{orderNumber}</Text>
              <Text style={detailText}><strong>Delivery Address:</strong> {shippingAddress}, {country}</Text>
              <Text style={detailText}><strong>Items Requested:</strong> {itemsSummary}</Text>
            </Section>
            <Text style={paragraph}>
              <strong>Next Steps:</strong> We will send you an email invoice with your custom shipping quote and a secure 1-click payment link within 24 hours.
            </Text>
            <Text style={paragraph}>Best regards,</Text>
            <Text style={paragraph}>The Revival Glow Team</Text>
          </Section>
          <Section style={footer}>
            <Text style={footerText}>
              © {new Date().getFullYear()} Revival Glow. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f5f5f5",
  fontFamily: "Helvetica, Arial, sans-serif",
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "100%",
  maxWidth: "600px",
};

const header = {
  padding: "24px",
  backgroundColor: "#fdf6e3",
  textAlign: "center" as const,
  borderTopLeftRadius: "8px",
  borderTopRightRadius: "8px",
};

const headerTitle = {
  color: "#c4592d",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "0",
};

const content = {
  backgroundColor: "#ffffff",
  padding: "24px",
  borderBottomLeftRadius: "8px",
  borderBottomRightRadius: "8px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
};

const heading = {
  color: "#333333",
  fontSize: "20px",
  fontWeight: "bold",
  marginBottom: "16px",
};

const paragraph = {
  color: "#555555",
  fontSize: "14px",
  lineHeight: "1.6",
  marginBottom: "12px",
};

const orderDetails = {
  backgroundColor: "#fafafa",
  padding: "16px",
  borderRadius: "6px",
  margin: "16px 0",
};

const detailText = {
  color: "#333333",
  fontSize: "14px",
  margin: "6px 0",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "24px 0",
};

const button = {
  backgroundColor: "#c4592d",
  borderRadius: "6px",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  padding: "12px 24px",
  display: "inline-block",
};

const footer = {
  textAlign: "center" as const,
  paddingTop: "24px",
};

const footerText = {
  color: "#888888",
  fontSize: "12px",
};
