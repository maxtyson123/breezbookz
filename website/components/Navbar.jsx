'use client';

import { motion } from 'framer-motion';

import styles from '../styles';
import { navVariants } from '../utils/motion';
import {useEffect, useState} from "react";
import Link from "next/link";
import {GetCart} from "../constants/cart";

function Navbar({ itemAmount = 0 } ) {

  const [navOpen, setNavOpen] = useState(false);
  const [cartItems, setCartItems] = useState(0);

  useEffect(() => {

        // If the item amount is 0 fetch the cart items
        if (itemAmount > 0) {
            setCartItems(itemAmount);
            return;
        }

        // Get the cart
       GetCart().then((cart) => {
           console.log(cart);
            setCartItems(cart.products.length);
        });


  }, [itemAmount]);


  return(
      <>
          <motion.nav
              variants={navVariants}
              initial="hidden"
              whileInView="show"
              className={`${styles.xPaddings} py-8 relative`}
          >
              <div className="absolute w-[50%] inset-0 gradient-01"/>
              <div
                  className={`${styles.innerWidth} mx-auto flex justify-between gap-8`}
              >
                  <div className="cursor-pointer">
                      <img
                          src="/cart-head.svg"
                          alt="search"
                          className="w-[34px] h-[34px] object-contain cursor-pointer"
                      />
                      <h3
                            style={{position: "relative", top: "-65%", left: "20%", backgroundColor: "#94C47D", borderRadius: "50%", padding: "0.5rem 1rem", scale: "0.55"}}
                            className="font-bold text-[22px] leading-[25.28px] text-white">
                          {cartItems}
                      </h3>
                  </div>

                  <h2 className="font-extrabold text-[24px] leading-[30.24px] text-white">
                      The Hungry Scholars Survival Handbook
                  </h2>
                  <img
                      src="/menu.svg"
                      alt="menu"
                      className="w-[24px] h-[24px] object-contain cursor-pointer"
                      onClick={() => setNavOpen(true)}
                  />
              </div>
          </motion.nav>

          <div className={`sidenav ${navOpen ? 'open' : ''}`}>
              <a href="javascript:void(0)" className="closebtn" onClick={() => setNavOpen(false)}>&times;</a>
              <Link href="/">Home</Link>
              <Link href="/buy">Buy Our Book</Link>
              <Link href="/cart">Cart</Link>
              <Link href="/login">Login</Link>
          </div>

      </>
  )
};

export default Navbar;
