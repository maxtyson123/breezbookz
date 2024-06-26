'use client';

import { motion } from 'framer-motion';
import {mailtolink, socials} from '../constants';

import styles from '../styles';
import { footerVariants } from '../utils/motion';
import Link from "next/link";

const Footer = () => (
  <motion.footer
    variants={footerVariants}
    initial="hidden"
    whileInView="show"
    className={`${styles.xPaddings} py-8 relative`}
  >
    <div className="footer-gradient" />
    <div className={`${styles.innerWidth} mx-auto flex flex-col gap-8`}>
      <div className="flex items-center justify-between flex-wrap gap-5">
        <h4 className="font-bold md:text-[64px] text-[44px] text-white">
          Get yours today!
        </h4>
        <Link href={mailtolink} className="flex items-center h-fit py-4 px-6 bg-[#94c47d] rounded-[32px] gap-[12px]">
          <img
            src="/headset.svg"
            alt="headset"
            className="w-[24px] h-[24px] object-contain"
          />
          <span className="font-normal text-[16px] text-white">
            Order Now
          </span>
        </Link>
      </div>

      <div className="flex flex-col">
        <div className="mb-[50px] h-[2px] bg-white opacity-10" />

        <div className="flex items-center justify-between flex-wrap gap-4">
          <h4 className="font-extrabold text-[24px] text-white">
            Breez Bookz
          </h4>
          <p className="font-normal text-[14px] text-white opacity-50">
            Copyright © 2024 Breez Bookz. All rights reserved.
          </p>

          <div className="flex gap-4">
            {socials.map((social) => (
                <Link href={social.link} key={social.name}>
                  <img
                    key={social.name}
                    src={social.url}
                    alt={social.name}
                    className="w-[24px] h-[24px] object-contain cursor-pointer"
                  />
                </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  </motion.footer>
);

export default Footer;
