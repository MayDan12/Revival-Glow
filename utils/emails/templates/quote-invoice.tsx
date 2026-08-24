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

type QuoteInvoiceEmailProps = {
  customerName: string;
  orderNumber: string;
  subtotalAmount: string;
  shippingAmount: string;
  taxAmount?: string;
  totalAmount: string;
  paymentUrl: string;
};

export default function QuoteInvoiceEmail({
  customerName = "Valued Customer",
  orderNumber = "#1000",
  subtotalAmount = "$50.00",
  shippingAmount = "$15.00",
  taxAmount = "$0.00",
  totalAmount = "$65.00",
  paymentUrl = "https://checkout.stripe.com/pay/...",
}: QuoteInvoiceEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={headerTitle}>Revival Glow</Text>
          </Section>
          <Section style={content}>
            <Text style={heading}>Shipping Quote Ready & Invoice</Text>
            <Text style={paragraph}>Hi {customerName},</Text>
            <Text style={paragraph}>
              Great news! We have calculated the custom shipping rate for your order #{orderNumber}.
            </Text>
            <Section style={orderDetails}>
              <Text style={detailText}><strong>Order Ref:</strong> #{orderNumber}</Text>
              <Text style={detailText}><strong>Subtotal:</strong> {subtotalAmount}</Text>
              <Text style={detailText}><strong>Custom Shipping Fee:</strong> {shippingAmount}</Text>
              {taxAmount && taxAmount !== "$0.00" && (
                <Text style={detailText}><strong>Estimated Tax:</strong> {taxAmount}</Text>
              )}
              <Text style={detailText}><strong>Grand Total:</strong> {totalAmount}</Text>
            </Section>
            <Section style={buttonContainer}>
              <Button style={button} href={paymentUrl}>
                Complete Order & Pay {totalAmount}
              </Button>
            </Section>
            <Text style={paragraph}>
              Clicking the button above will take you to our secure checkout page to complete your payment.
            </Text>
            <Text style={paragraph}>
              If you have any questions or need to modify your delivery address, reply to this email.
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
  padding: "14px 28px",
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
