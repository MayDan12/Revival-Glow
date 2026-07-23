import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Section,
} from "@react-email/components";
import * as React from "react";

type AdminCustomEmailProps = {
  customerName: string;
  bodyText: string;
};

export default function AdminCustomEmail({
  customerName = "Valued Customer",
  bodyText = "This is a custom message.",
}: AdminCustomEmailProps) {
  // Split the body into paragraphs for nicer rendering
  const paragraphs = bodyText.split("\n").filter((p) => p.trim() !== "");

  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={headerTitle}>Revival Glow</Text>
          </Section>
          <Section style={content}>
            <Text style={paragraph}>Hi {customerName},</Text>
            {paragraphs.map((text, i) => (
              <Text key={i} style={paragraph}>
                {text}
              </Text>
            ))}
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

const paragraph = {
  fontSize: "16px",
  lineHeight: "24px",
  color: "#555555",
  marginBottom: "16px",
};

const footer = {
  padding: "24px",
  textAlign: "center" as const,
};

const footerText = {
  fontSize: "14px",
  color: "#999999",
};
