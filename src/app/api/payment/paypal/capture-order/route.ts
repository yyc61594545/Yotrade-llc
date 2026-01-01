import { NextRequest, NextResponse } from "next/server";
import { getPayPalClient } from "@/lib/paypal";
import { OrdersController } from "@paypal/paypal-server-sdk";
import { getDb } from "@/db";
import { payment, user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import { PaymentTypes } from "@/payment/types";
import { sendManualEmail } from "@/mail/send-manual";
import { sendNotification } from "@/notification/notification";
import { websiteConfig } from "@/config/website";
import { addLifetimeMonthlyCredits } from "@/credits/credits";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderID, userId, planId, priceId } = body;

    if (!orderID || !userId || !priceId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Initialize PayPal Client
    const client = getPayPalClient();
    const ordersController = new OrdersController(client);

    const collect = {
      id: orderID,
      prefer: "return=minimal"
    };

    const { result } = await ordersController.captureOrder(collect);

    // Check for success status
    // PayPal returns 'COMPLETED' for successful captures
    if (result.status === 'COMPLETED') {
        const capture = result.purchaseUnits?.[0]?.payments?.captures?.[0];
        const amount = capture?.amount?.value ? parseFloat(capture.amount.value) : 0;
        const payerEmail = result.payer?.emailAddress || '';
        const payerName = (result.payer?.name?.givenName + ' ' + result.payer?.name?.surname).trim();
        const payerId = result.payer?.payerId || '';

        // Record in Database
        const db = await getDb();

        // Ensure user exists or update customerId?
        // For PayPal, we might not have a "Customer ID" in the same persistent way Stripe does,
        // but PayerID is consistent-ish. We can store PayerID in customerId column or just leave it.
        // Let's store PayerID.

        const now = new Date();
        await db.insert(payment).values({
            id: randomUUID(),
            priceId: priceId,
            type: PaymentTypes.ONE_TIME,
            userId: userId,
            customerId: payerId, // Storing PayPal Payer ID here
            sessionId: orderID,  // Storing PayPal Order ID here
            status: 'completed',
            periodStart: now,
            createdAt: now,
            updatedAt: now,
        });

        console.log(`PayPal payment recorded for user ${userId}, Order ${orderID}`);

        // Post-payment actions (Credits, Notifications, Email)

        // 1. Credits
        if (websiteConfig.credits?.enableCredits) {
             await addLifetimeMonthlyCredits(userId, priceId);
        }

        // 2. Notification
        await sendNotification(orderID, payerId, userId, amount);

        // 3. Send Manual PDF Email
        if (payerEmail) {
            sendManualEmail(payerEmail, payerName).catch(err =>
                console.error('Failed to send manual email (PayPal):', err)
            );
        }

        return NextResponse.json({ success: true, status: result.status });
    } else {
        return NextResponse.json({ success: false, status: result.status }, { status: 400 });
    }

  } catch (error) {
    console.error("Failed to capture PayPal order:", error);
    return NextResponse.json({ error: "Failed to capture order" }, { status: 500 });
  }
}
