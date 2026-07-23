import * as React from "react";
import { getResendClient } from "../resend";
import OrderConfirmationEmail from "./templates/order-confirmation";
import PaymentConfirmationEmail from "./templates/payment-confirmation";
import ShippingNotificationEmail from "./templates/shipping-notification";
import DeliveryConfirmationEmail from "./templates/delivery-confirmation";
import ReviewRequestEmail from "./templates/review-request";
import AdminCustomEmail from "./templates/admin-custom";

type SendEmailProps = {
  to: string;
  subject: string;
  react?: React.ReactElement;
  html?: string;
  replyTo?: string;
};

export async function sendEmail({ to, subject, react, html, replyTo }: SendEmailProps) {
  const from = process.env.RESEND_FROM || "onboarding@resend.dev";
  const resend = getResendClient();

  if (react) {
    return resend.emails.send({
      from,
      to,
      subject,
      react,
      replyTo: replyTo,
    });
  }

  if (html) {
    return resend.emails.send({
      from,
      to,
      subject,
      html,
      replyTo: replyTo,
    });
  }

  throw new Error("Either react or html must be provided");
}

export async function sendOrderConfirmation(to: string, props: React.ComponentProps<typeof OrderConfirmationEmail>) {
  return sendEmail({
    to,
    subject: `Order Confirmation ${props.orderNumber}`,
    react: React.createElement(OrderConfirmationEmail, props),
  });
}

export async function sendPaymentConfirmation(to: string, props: React.ComponentProps<typeof PaymentConfirmationEmail>) {
  return sendEmail({
    to,
    subject: `Payment Received for Order ${props.orderNumber}`,
    react: React.createElement(PaymentConfirmationEmail, props),
  });
}

export async function sendShippingNotification(to: string, props: React.ComponentProps<typeof ShippingNotificationEmail>) {
  return sendEmail({
    to,
    subject: `Your order ${props.orderNumber} has shipped!`,
    react: React.createElement(ShippingNotificationEmail, props),
  });
}

export async function sendDeliveryConfirmation(to: string, props: React.ComponentProps<typeof DeliveryConfirmationEmail>) {
  return sendEmail({
    to,
    subject: `Your order ${props.orderNumber} has been delivered!`,
    react: React.createElement(DeliveryConfirmationEmail, props),
  });
}

export async function sendReviewRequest(to: string, props: React.ComponentProps<typeof ReviewRequestEmail>) {
  return sendEmail({
    to,
    subject: `How did we do? Review your recent purchase`,
    react: React.createElement(ReviewRequestEmail, props),
  });
}

export async function sendAdminCustomEmail(
  to: string, 
  subject: string, 
  props: React.ComponentProps<typeof AdminCustomEmail>,
  replyTo?: string
) {
  return sendEmail({
    to,
    subject,
    react: React.createElement(AdminCustomEmail, props),
    replyTo,
  });
}
