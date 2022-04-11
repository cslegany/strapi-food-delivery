import '../styles/globals.css';

import React, { useEffect, useState } from "react";
import App from "next/app";
import type { AppProps } from 'next/app';

import Cookies from "js-cookie";
import fetch from "isomorphic-fetch";
import Layout from "../components/Layout";
import AppContext from "../context/AppContext";
import withData from "../lib/apollo";

import { ICart, ICartItem, IDish } from '../typings';

function MyApp({ Component, pageProps }: AppProps) {
  const [user, setUser] = useState(null);
  const [cartData, setCartData] = useState<ICart>({ items: [], total: 0 });

  useEffect(() => {
    const token = Cookies.get("token");

    // restore cart from cookie, this could also be tracked in a db
    const cart = Cookies.get("cart");

    //if items in cart, set items and total from cookie
    if (typeof cart === "string" && cart) {
      let cartItems : ICartItem[] = JSON.parse(cart);
      
      let total: number = 0;
      cartItems.forEach(item => {
        total += item.price * item.quantity;
      });
      
      let newCart: ICart = {items: cartItems, total: total};
      setCartData(newCart);
    }

    if (token) {
      // authenticate the token on the server and place set user object
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then(async (res) => {
        // if res comes back not valid, token is not valid
        // delete the token and log the user out on client
        if (!res.ok) {
          Cookies.remove("token");
          setUser(null);
          return null;
        }
        const user = await res.json();
        setUser(user);
      });
    }
  }, []);

  const addItem = (item: ICartItem) => {

    let { items, total } = cartData;
    //check for item already in cart
    //if not in cart, add item if item is found increase quanity ++
    const newItem = items.find((i) => i.id === item.id);
    // if item is not new, add to cart, set quantity to 1
    if (!newItem) {
      //set quantity property to 1
      item.quantity = 1;

      const newCart: ICart = {
        items: [...items, item],
        total: total + item.price,
      };
      setCartData(newCart);
    } else {

      const newCart: ICart = {
        items: items.map((item) =>
          item.id === newItem.id
            ? Object.assign({}, item, { quantity: item.quantity + 1 })
            : item
        ),
        total: total + item.price,
      };
      setCartData(newCart);
    }
  };

  const removeItem = (item: ICartItem) => {
    let { items } = cartData;
    //check for item already in cart
    //if not in cart, add item if item is found increase quanity ++
    const newItem = items.find((i) => i.id === item.id);

    if (newItem.quantity > 1) {
      const newCart: ICart = {
        items: cartData.items.map((item) =>
          item.id === newItem.id
            ? Object.assign({}, item, { quantity: item.quantity - 1 })
            : item
        ),
        total: cartData.total - item.price,
      };
      setCartData(newCart);
    } else {
      const items = [...cartData.items];
      const index = items.findIndex((i) => i.id === newItem.id);
      items.splice(index, 1);

      const newCart: ICart = {
        items: items,
        total: cartData.total - item.price
      };
      setCartData(newCart);
    }
  };

  useEffect(() => {
    Cookies.set("cart", JSON.stringify(cartData.items));
  }, [cartData]);

  return (
    <AppContext.Provider
      value={{
        user: user,
        isAuthenticated: !!user,
        setUser: setUser,
        cart: cartData,
        addItem: addItem,
        removeItem: removeItem
      }}
    >
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AppContext.Provider>
  )
}

export default withData()(MyApp);
