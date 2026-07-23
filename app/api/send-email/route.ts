import { NextRequest, NextResponse } from "next/server";
import { sendAdminCustomEmail } from "@/utils/emails/send";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { to, subject, body: emailBody, customerName, replyTo } = body;

    if (!to || !subject || !emailBody || !customerName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // You could also add authentication here to ensure only admins can trigger this.
    // Since this is an admin dashboard endpoint, we assume it's protected by middleware or similar.

    await sendAdminCustomEmail(
      to,
      subject,
      {
        customerName,
        bodyText: emailBody,
      },
      replyTo || "info@revivalglowcare.com"
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error sending custom email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
