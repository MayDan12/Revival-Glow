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

type ShippingNotificationEmailProps = {
  customerName: string;
  orderNumber: string;
  trackingNumber?: string;
  trackingUrl?: string;
};

export default function ShippingNotificationEmail({
  customerName = "Valued Customer",
  orderNumber = "#1000",
  trackingNumber,
  trackingUrl,
}: ShippingNotificationEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={headerTitle}>Revival Glow</Text>
          </Section>
          <Section style={content}>
            <Text style={heading}>Your Order is on the Way!</Text>
            <Text style={paragraph}>Hi {customerName},</Text>
            <Text style={paragraph}>
              Great news! Your order {orderNumber} has shipped and is currently on its way to you.
            </Text>
            {trackingNumber && (
              <Section style={orderDetails}>
                <Text style={detailText}>Tracking Number: {trackingNumber}</Text>
              </Section>
            )}
            {trackingUrl && (
              <Section style={buttonContainer}>
                <Button style={button} href={trackingUrl}>
                  Track Your Package
                </Button>
              </Section>
            )}
            <Text style={paragraph}>
              Please allow up to 24 hours for tracking information to update.
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
  fontSize: "24px",
  color: "#333333",
  fontWeight: "bold",
  marginBottom: "16px",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "24px",
  color: "#555555",
  marginBottom: "16px",
};

const orderDetails = {
  backgroundColor: "#fdf6e3",
  padding: "16px",
  borderRadius: "8px",
  marginBottom: "24px",
};

const detailText = {
  fontSize: "16px",
  color: "#333333",
  margin: "4px 0",
};

const buttonContainer = {
  textAlign: "center" as const,
  marginTop: "24px",
  marginBottom: "24px",
};

const button = {
  backgroundColor: "#c4592d",
  color: "#ffffff",
  padding: "12px 24px",
  borderRadius: "6px",
  textDecoration: "none",
  fontWeight: "bold",
  display: "inline-block",
};

const footer = {
  padding: "24px",
  textAlign: "center" as const,
};

const footerText = {
  fontSize: "14px",
  color: "#999999",
};
