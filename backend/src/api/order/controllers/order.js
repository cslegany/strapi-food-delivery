'use strict';

/**
 *  order controller
 */

const stripe = require("stripe")("sk_test_51KkrGDJjd4VONjRSTB1JvweZoCBqputYSWnOCkuU42MEZFQrlQcnDdJq3vOCAByvtFZyUpI6bWziQe5h8ZGipM6b00iTY97qww");

const { createCoreController } = require('@strapi/strapi').factories;

//see: https://docs.strapi.io/developer-docs/latest/development/backend-customization/controllers.html#adding-a-new-controller
module.exports = createCoreController('api::order.order', ({ strapi }) => ({

  create: async (ctx) => {
    const { address, amount, dishes, token, city, state } = JSON.parse(
      ctx.request.body
    );
    const stripeAmount = Math.floor(amount * 100);
    // charge on stripe
    const charge = await stripe.charges.create({
      // Transform cents to dollars.
      amount: stripeAmount,
      currency: "usd",
      description: `Order ${new Date()} by ${ctx.state.user._id}`,
      source: token,
    });

    // Register the order in the database
    const order = await strapi.service('api::order.order').create({
      data: {
        user: ctx.state.user.id,
        charge_id: charge.id,
        amount: stripeAmount,
        address,
        dishes,
        city,
        state,
        publishedAt: new Date()
      }
    });

    return order;
  },
}));