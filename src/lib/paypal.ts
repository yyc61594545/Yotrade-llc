import { Client, Environment } from "@paypal/paypal-server-sdk";

/**
 * PayPal API Client
 *
 * Initializes the PayPal SDK client for server-side usage.
 */

// Create a function to get the client ensures env vars are loaded
export const getPayPalClient = () => {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Missing PayPal credentials");
  }

  // Determine environment
  // Default to Sandbox unless explicitly set to production
  const environment = process.env.NODE_ENV === 'production'
    ? Environment.Production
    : Environment.Sandbox;

  return new Client({
    clientCredentialsAuthCredentials: {
      oAuthClientId: clientId,
      oAuthClientSecret: clientSecret,
    },
    timeout: 0,
    environment: environment,
  });
};
