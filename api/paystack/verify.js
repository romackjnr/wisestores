import process from "node:process";
import {
  PRODUCT_PRICES,
  SHIPPING_FEE,
  STORE_CURRENCY,
} from "../../src/constants/product-pricing.js";

const sendJson = (response, status, body) =>
  response.status(status).json(body);

export default async function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return sendJson(response, 405, { error: "Method not allowed." });
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    return sendJson(response, 503, {
      error: "Paystack is not configured. Add PAYSTACK_SECRET_KEY in Vercel settings.",
    });
  }

  const reference = typeof request.query?.reference === "string"
    ? request.query.reference.trim()
    : "";
  if (!/^[\w.-]{8,100}$/.test(reference)) {
    return sendJson(response, 400, { error: "A valid Paystack reference is required." });
  }

  try {
    const paystackResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      { headers: { Authorization: `Bearer ${secretKey}` } }
    );
    const paystackResult = await paystackResponse.json();
    if (!paystackResponse.ok || !paystackResult.status) {
      return sendJson(response, 502, {
        error: paystackResult.message || "Paystack could not verify this payment.",
      });
    }

    const transaction = paystackResult.data;
    if (transaction.status !== "success") {
      return sendJson(response, 402, {
        status: transaction.status || "failed",
        error: "Paystack has not marked this payment as successful.",
      });
    }

    const items = transaction.metadata?.items;
    if (!Array.isArray(items) || items.length < 1) {
      return sendJson(response, 400, { error: "The transaction is missing valid order details." });
    }

    let expectedAmountKobo = SHIPPING_FEE * 100;
    for (const item of items) {
      const quantity = Number(item.quantity);
      const pricing = PRODUCT_PRICES[item.productId];
      if (!pricing || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
        return sendJson(response, 400, { error: "The transaction order details are invalid." });
      }
      expectedAmountKobo += pricing.price * quantity * 100;
    }

    if (
      transaction.currency !== STORE_CURRENCY ||
      transaction.amount !== expectedAmountKobo ||
      Number(transaction.metadata.expected_amount_kobo) !== expectedAmountKobo
    ) {
      return sendJson(response, 409, {
        error: "The verified payment amount does not match the order total.",
      });
    }

    return sendJson(response, 200, {
      status: "success",
      reference: transaction.reference,
      amount: transaction.amount,
      currency: transaction.currency,
    });
  } catch {
    return sendJson(response, 502, { error: "Could not reach Paystack. Please try again." });
  }
}