'use client';

import { motion } from 'framer-motion';
import { TypingText } from '../components';

import styles from '../styles';
import { fadeIn, staggerContainer } from '../utils/motion';

const About = () => (
  <section className={`${styles.paddings} relative z-10`}>
    <div className="gradient-02 z-0" />
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.25 }}
      className={`${styles.innerWidth} mx-auto ${styles.flexCenter} flex-col`}
    >
      <TypingText title="| About Breez Bookz" textStyles="text-center" />

      <motion.p
        variants={fadeIn('up', 'tween', 0.2, 1)}
        className="mt-[8px] font-normal sm:text-[32px] text-[20px] text-center text-secondary-white"
      >
        Why <span className="font-extrabold text-[#94C47D]"> Breez Bookz </span> and not Jamie Oliver? Or
        Gordan Ramsey? Or every other ‘101 recipes for you’ website. This food information and recipe guide provides
        all <span className="font-extrabold text-[#94C47D]">young adults </span> who aren't confident in the kitchen
        with easy, <span className="font-extrabold text-[#94C47D]"> healthy </span> and cheap
        meals to make your stressful university easier. We are here to help you make the most of your time at university
        by providing you with the tools to make your own meals and <span className="font-extrabold text-[#94C47D]"> save money </span>.
      </motion.p>

      <motion.img
        variants={fadeIn('up', 'tween', 0.3, 1)}
        src="/arrow-down.svg"
        alt="arrow down"
        className="w-[18px] h-[28px] object-contain mt-[28px]"
      />
    </motion.div>
  </section>
);

export default About;
