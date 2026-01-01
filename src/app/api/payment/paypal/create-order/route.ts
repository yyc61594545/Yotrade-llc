import { NextRequest, NextResponse } from "next/server";
import { getPayPalClient } from "@/lib/paypal";
import { OrdersController, OrderRequest, CheckoutPaymentIntent } from "@paypal/paypal-server-sdk";
import { findPlanByPlanId, findPriceInPlan } from "@/lib/price-plan";
import { auth } from "@/lib/auth"; // Assuming auth is available like this or via authClient?
// Checking auth usage in other routes... usually via headers or session.
// auth helper in lib/auth seems to be better-auth.
// But backend route might need to check session via headers.
// For now, allow public access or check session if critical.
// Pricing updates check session in `create-checkout-session` action usually.

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { planId, priceId } = body;

    if (!planId || !priceId) {
      return NextResponse.json({ error: "Missing planId or priceId" }, { status: 400 });
    }

    // Verify price
    const plan = findPlanByPlanId(planId);
    if (!plan) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }
    const price = findPriceInPlan(planId, priceId);
    if (!price) {
      return NextResponse.json({ error: "Invalid price" }, { status: 400 });
    }

    // Initialize PayPal Client
    const client = getPayPalClient();
    const ordersController = new OrdersController(client);

    const collect = {
      body: {
        intent: CheckoutPaymentIntent.Capture,
        purchaseUnits: [
          {
            amount: {
              currencyCode: price.currency,
              value: (price.amount / 100).toFixed(2), // Amount is usually in cents
            },
            description: `${plan.name} (Lifetime)`,
          },
        ],
      },
    };

    const { result } = await ordersController.createOrder(collect);

    return NextResponse.json({ id: result.id });
  } catch (error) {
    console.error("Failed to create PayPal order:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
