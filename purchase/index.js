require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const headers = {
  "Access-Control-Allow-Methods": "*",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

module.exports = async function (context, req) {
  const {
    number,
    purchaseCurrency,
    cvc,
    exp_month,
    exp_year,
    purchaseAmount,
    email,
    purchaseType,
    priceEntityId,
  } = req.body;

  try {
    // Create a payment method for user using the Card Details
    const { id: paymentID } = await stripe.paymentMethods.create({
      type: "card",
      card: {
        number,
        cvc,
        exp_year,
        exp_month,
      },
    });

    const { id: customerID } = await stripe.customers.create({
      email,
      description: "Artwork gallery customer",
      payment_method: paymentID,
    });

    await stripe.paymentMethods.attach(paymentID, { customer: customerID });

    if (purchaseType === "recurring") {
      const subscriptionData = await stripe.subscriptions.create({
        customer: customerID,
        default_payment_method: paymentID,
        items: [
          {
            price: priceEntityId,
          },
        ],
      });

      context.res = {
        headers,
        body: {
          message: "SUBSCRIPTION CREATED",
          userStripeId: customerID,
          userSubscriptionId: subscriptionData.id,
        },
      };
    } else {
      const { id: paymentIntentId } = await stripe.paymentIntents.create({
        amount: purchaseAmount,
        currency: purchaseCurrency || "usd",
        customer: customerID,
        payment_method: paymentID,
      });

      const { amount_received } = await stripe.paymentIntents.confirm(
        paymentIntentId,
        {
          payment_method: paymentID,
        }
      );

      context.res = {
        headers,
        body: {
          message: `PAYMENT OF ${amount_received} RECIEVED`,
        },
      };
    }
  } catch (e) {
    context.res = {
      status: 500,
      body: e,
    };
  }
};
