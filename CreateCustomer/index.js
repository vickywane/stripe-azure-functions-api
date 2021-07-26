require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

module.exports = async function (context, req) {
    const { query, body } = req

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: {
            'status': 'ok'
        }
    };
}