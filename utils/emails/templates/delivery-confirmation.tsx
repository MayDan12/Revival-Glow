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

type DeliveryConfirmationEmailProps = {
  customerName: string;
  orderNumber: string;
  reviewUrl?: string;
};

export default function DeliveryConfirmationEmail({
  customerName = "Valued Customer",
  orderNumber = "#1000",
  reviewUrl,
}: DeliveryConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={headerTitle}>Revival Glow</Text>
          </Section>
          <Section style={content}>
            <Text style={heading}>Your Order has been Delivered!</Text>
            <Text style={paragraph}>Hi {customerName},</Text>
            <Text style={paragraph}>
              Good news! Your order {orderNumber} has been successfully delivered.
              We hope you love your new items.
            </Text>
            {reviewUrl && (
              <Section style={buttonContainer}>
                <Button style={button} href={reviewUrl}>
                  Leave a Review
                </Button>
              </Section>
            )}
            <Text style={paragraph}>
              If you have any issues with your delivery or your order, please don&apos;t hesitate to contact us.
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
