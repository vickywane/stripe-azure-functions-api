require("dotenv").config();
const { ManagementClient } = require("auth0");

const headers = {
  "Access-Control-Allow-Methods": "*",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

const management = new ManagementClient({
  domain: "dev-okv6c3dp.auth0.com",
  clientId: "c7GGyh8iTUq1SYRi3fkncQAZHY7Ui1C8",
  clientSecret:
    "83cD9DarN6HGmLv7MuozYmsGVMu_tGFdsisYzEitRzodm1XAyc7N4AFBslsvTYPJ",
  scope: "read:users update:users",
});

module.exports = async function (context, req) {
  if (req.method === "GET") {
    const { userId } = req.query;

    try {
      const { billing_data } = await management.getUser({ id: userId });

      context.res = {
        headers,
        body: {
          billing_data,
        },
      };
    } catch (error) {
      context.res = {
        headers,
        body: {
          error,
          message: "Error fetching user biling data",
        },
      };
    }
  } else if (req.method === "POST") {
    const { userId, productId } = req.body;

    try {
      const { user_metadata } = await management.getUser({ id: userId });

      const items = [...user_metadata];

      const user = await management.updateUserMetadata(
        { id: userId },
        {
          billing_data: items.push({
            productId,
          }),
        }
      );

      context.res = {
        headers,
        body: {
          message: "Billing data updated",
          user,
        },
      };
    } catch (error) {
      context.res = {
        headers,
        body: { error, message: "error inserting user billing data" },
      };
    }
  }
};
