'use client';

import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface PayPalButtonProps {
    userId: string;
    planId: string;
    priceId: string;
    amount: number;
    currency: string;
    showSpinner?: boolean;
}

export function PayPalCheckoutButton({ userId, planId, priceId, amount, currency }: PayPalButtonProps) {
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);

    // Provide the Client ID. Ideally this comes from env.
    // Ensure you added NEXT_PUBLIC_PAYPAL_CLIENT_ID to your .env
    const initialOptions = {
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
        currency: currency,
        intent: "capture",
    };

    if (!initialOptions.clientId) {
        console.error("PayPal Client ID not found");
        return null;
    }

    return (
        <div className="w-full mt-2 relative z-0">
            {isProcessing && (
                 <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                 </div>
            )}
            <PayPalScriptProvider options={initialOptions}>
                <PayPalButtons
                    style={{ layout: "horizontal", height: 48, tagline: false, shape: 'rect' }}
                    createOrder={async (data, actions) => {
                        setIsProcessing(true);
                        try {
                            const response = await fetch("/api/payment/paypal/create-order", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    planId,
                                    priceId,
                                    userId // Optional, backend verify
                                }),
                            });

                            const orderData = await response.json();

                            if (orderData.id) {
                                return orderData.id;
                            } else {
                                const errorDetail = orderData?.details?.[0];
                                const errorMessage = errorDetail
                                  ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
                                  : JSON.stringify(orderData);
                                throw new Error(errorMessage);
                            }
                        } catch (error) {
                            console.error(error);
                            toast.error("Could not initiate PayPal checkout");
                            setIsProcessing(false);
                            throw error;
                        }
                    }}
                    onApprove={async (data, actions) => {
                        try {
                            const response = await fetch("/api/payment/paypal/capture-order", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    orderID: data.orderID,
                                    userId,
                                    planId,
                                    priceId
                                }),
                            });

                            const result = await response.json();

                            if (result.success) {
                                toast.success("Payment successful!");
                                // Refresh page or redirect to dashboard
                                router.refresh();
                                router.push('/dashboard');
                            } else {
                                toast.error("Payment failed to capture");
                            }
                        } catch (error) {
                            console.error(error);
                            toast.error("An error occurred during payment capture");
                        } finally {
                            setIsProcessing(false);
                        }
                    }}
                    onCancel={() => {
                        setIsProcessing(false);
                        toast.info("Payment cancelled");
                    }}
                    onError={(err) => {
                        console.error(err);
                        toast.error("PayPal error occurred");
                        setIsProcessing(false);
                    }}
                />
            </PayPalScriptProvider>
        </div>
    );
}
