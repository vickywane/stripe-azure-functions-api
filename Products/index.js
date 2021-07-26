require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const headers = {
  "Access-Control-Allow-Methods": "*",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

module.exports = async function (context, req) {

  try {
    const { data } = await stripe.products.list({});

    context.res = {
      headers,
      body: {
        data,
      },
    };
  } catch (e) {
    console.log(e);
    context.res = {
      headers,
      // status: 200, /* Defaults to 200 */
      body: e,
    };
  }
};
