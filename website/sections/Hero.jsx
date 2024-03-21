'use client';

import { motion } from 'framer-motion';

import { useEffect, useRef, useState } from 'react';
import styles from '../styles';
import { slideIn, staggerContainer, textVariant } from '../utils/motion';
import book from '../styles/book.module.css';

const Hero = () => (
  <section className={`${styles.yPaddings} sm:pl-16 pl-6`}>
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.25 }}
      className={`${styles.innerWidth} mx-auto flex flex-col`}
    >
      <div className="flex justify-center items-center flex-col relative z-10">
        <motion.h1 variants={textVariant(1.1)} className={styles.heroHeading}>
          Breez Bookz
        </motion.h1>
        <motion.div
          variants={textVariant(1.2)}
          className="flex flex-row justify-center items-center"
        >
          <h1 className={styles.heroSubHeading} style={{ width: '100vw' }}><TypingText /><span id="carat">|</span></h1>
        </motion.div>
      </div>

      <motion.div
        variants={slideIn('right', 'tween', 0.2, 1)}
        className="relative w-full md:-mt-[20px] -mt-[12px]"
      >

        <div className="absolute w-full h-[455px] hero-gradient rounded-tl-[140px] z-[0] -top-[10px] p-0" />

        <div className={book.bc}>
          <div className={book.book}>
            <div className={book.gap} />
            <div className={book.pages}>
              <div className={book.page} />
              <div className={book.page} />
              <div className={book.page} />
              <div className={book.page} />
              <div className={book.page} />
              <div className={book.page} />
            </div>
            <div className={book.flips}>
              <div className={`${book.flip} ${book.flip1}`}>
                <div className={`${book.flip} ${book.flip2}`}>
                  <div className={`${book.flip} ${book.flip3}`}>
                    <div className={`${book.flip} ${book.flip4}`}>
                      <div className={`${book.flip} ${book.flip5}`}>
                        <div className={`${book.flip} ${book.flip6}`}>
                          <div className={`${book.flip} ${book.flip7}`} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <a href="#explore">
          <div className="w-full flex justify-end sm:-mt-[70px] -mt-[50px] pr-[40px] relative left-12">
            <img
              src="/stamp.png"
              alt="stamp"
              className="sm:w-[255px] w-[200px] sm:h-[255px] h-[200px] object-contain"
            />
          </div>
        </a>
      </motion.div>
    </motion.div>
  </section>
);

const TypingText = () => {
  const isAnimating = useRef(false);

  const subtexts = [
    "Cooking your way to straight A's",
    'The best book for the best grades',
    'Making cooking fun and easy',
    'Get your copy today!',
    'Providing the best recipes for students',
    'The book that will change your life as a student',
    'For students by students',
    'The best book for students',
    'The best recipes for students',
    'The best student cookbook',
    'Fueling your academic journey deliciously',
    'Recipes to boost your brainpower',
    'Nourishing your mind and body',
    'Cooking up success, one meal at a time',
    'Healthy eats for a happy student life',
    'From kitchen to classroom: recipes for success',
    "Eating well, living well: a student's guide",
    'Ditch the stress with these easy-to-make meals',
    'Empowering students through nutritious cooking',
    'A recipe for academic excellence and wellness',
    'Tasty meals, bright minds: your student survival guide',
    'Revolutionize your study snacks with our recipes',
    'Eat smart, study smarter: the ultimate cookbook for students',
    'Achieve greatness with every bite: student-friendly recipes',
    'Well-fed, well-read: the key to academic success',
    'Cooking hacks for busy students: delicious and efficient',
    'Discover the joy of cooking while mastering your studies',
    'Transform your kitchen into your personal study sanctuary',
    'Elevate your student life with our wholesome recipes',
    'Turn mealtime into prime study time with our easy recipes',
    'The ultimate guide to student cooking and studying',
    'Fuel your academic journey with our delicious recipes',
  ];

  const [displayText, setDisplayText] = useState('');

  const typeText = () => {
    let i = 0;
    let currentSubtext = Math.floor(Math.random() * subtexts.length);
    let text = subtexts[currentSubtext];

    const forwardSpeed = 80;
    const backwardSpeed = 40;

    const forwardInterval = setInterval(() => {
      if (i < text.length) {
        // Set the display text
        setDisplayText(text.substring(0, i + 1));

        i += 1;
      } else {
        // Clear the interval
        clearInterval(forwardInterval);
      }
    }, forwardSpeed);

    // Wait for the forward interval to finish
    setTimeout(() => {
      const backwardInterval = setInterval(() => {
        if (i > 0) {
          // Set the display text
          setDisplayText(text.substring(0, i - 1));

          i -= 1;
        } else {
          // Clear the interval
          clearInterval(backwardInterval);
        }
      }, backwardSpeed);
    }, forwardSpeed * text.length + 1000);

    // Wait for the backward interval to finish
    setTimeout(() => {
      // Reset
      i = -1;

      // Get a random subtext that is not the current one
      let newText = Math.floor(Math.random() * subtexts.length);
      while (newText === currentSubtext) {
        newText = Math.floor(Math.random() * subtexts.length);
      }

      // Set the new subtext
      currentSubtext = newText;
      text = subtexts[currentSubtext];

      // Clear the text
      setDisplayText('·');

      // Restart the typing
      typeText();
    }, forwardSpeed * text.length + backwardSpeed * text.length + 1000);
  };

  useEffect(() => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    typeText();
  }, []);

  return (
    <span>{displayText}</span>
  );
};

export default Hero;
