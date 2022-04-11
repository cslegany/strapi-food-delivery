https://strapi.io/blog/nextjs-react-hooks-strapi-food-app-1
https://strapi.io/blog/nextjs-react-hooks-strapi-restaurants-2
https://strapi.io/blog/nextjs-react-hooks-strapi-dishes-3
https://strapi.io/blog/nextjs-react-hooks-strapi-auth-4
https://strapi.io/blog/nextjs-react-hooks-strapi-shopping-cart-5
https://strapi.io/blog/nextjs-react-hooks-strapi-checkout-6

Strapi new install command:
npx create-strapi-app backend

Strapi backend runs on
http://localhost:1337/
yarn develop

Frontend runs on 
http://localhost:3000/
npm run dev


create a new content type - restaurant on:
http://localhost:1337/admin/plugins/content-type-builder/content-types/api::restaurant.restaurant
add fields etc.

Go to Settings > Roles > Public > Restaurant > tick find, findOne, Save
api is on:
http://localhost:1337/api/restaurants

yarn add @strapi/plugin-graphql
http://localhost:1337/graphql

https://stackoverflow.com/questions/70592131/i-am-getting-error-when-i-am-working-on-strapi-app-using-grapql
strapi query updated to new syntax:
{
  restaurants {
    data {
      id
      attributes {
        name
        image {
          data {
            attributes {
              url
            }
          }
        }
      }
    }
  }
}

frontend:
npx create-next-app -e with-tailwindcss frontend  --use-npm

next version should be latest
npm install --save next-apollo graphql @apollo/client

Don't forget to add find and findOne roles for the Dishes as well!

Updated query:

{
  restaurant(id:1) {
    data {
      id
      attributes {
      	name
        dishes {
          data {
            id
            attributes {
              name
              description
              price
              image {
                data {
                  attributes {
                    url
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

Test address:
831 Meadowcrest Lane
Hazard
KY
41701

Server: order.js changes

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








