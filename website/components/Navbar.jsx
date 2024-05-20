'use client';

import { motion } from 'framer-motion';

import styles from '../styles';
import { navVariants } from '../utils/motion';
import {useState} from "react";
import Link from "next/link";

const Navbar = () => {

  const [navOpen, setNavOpen] = useState(false);


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
                  <img
                      src="/cart-head.svg"
                      alt="search"
                      className="w-[34px] h-[34px] object-contain cursor-pointer"
                  />
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
