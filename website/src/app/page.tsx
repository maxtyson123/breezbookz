"use client"
import {useEffect, useRef, useState} from "react";
import styles from "@/styles/main.module.css"
import book from "@/styles/book.module.css"
import Section from "@/components/section";
import { motion } from "framer-motion";
//set PATH=%PATH%;C:\Users\max.tyson\Downloads\node-v21.6.1-win-x64

export default function Home() {


    const isReady = useRef(false);
    const [page, setPage] = useState(false);

    const subtexts = [
        "Cooking your way to straight A's",
        "The best book for the best grades",
        "Making cooking fun and easy",
        "Get your copy today!",
        "Providing the best recipes for students",
        "The book that will change your life as a student",
        "For students by students",
        "The best book for students",
        "The best recipes for students",
        "The best student cookbook",
        "Fueling your academic journey deliciously",
        "Recipes to boost your brainpower",
        "Nourishing your mind and body",
        "Cooking up success, one meal at a time",
        "Healthy eats for a happy student life",
        "From kitchen to classroom: recipes for success",
        "Eating well, living well: a student's guide",
        "Ditch the stress with these easy-to-make meals",
        "Empowering students through nutritious cooking",
        "A recipe for academic excellence and wellness",
        "Tasty meals, bright minds: your student survival guide",
        "Revolutionize your study snacks with our recipes",
        "Eat smart, study smarter: the ultimate cookbook for students",
        "Achieve greatness with every bite: student-friendly recipes",
        "Well-fed, well-read: the key to academic success",
        "Cooking hacks for busy students: delicious and efficient",
        "Discover the joy of cooking while mastering your studies",
        "Transform your kitchen into your personal study sanctuary",
        "Elevate your student life with our wholesome recipes",
        "Turn mealtime into prime study time with our easy recipes",
        "The ultimate guide to student cooking and studying",
        "Fuel your academic journey with our delicious recipes"
    ];

    const bookDescription =  "BLAH BLAH BLAH BLAH BLAH BLAH BLAH BLAH BLAH BLAH BLAH BLAH BLAH BLAH BLAH BLAH BLAH BLAH BLAH\n" +
        "                        BLAH BLAH BLAH BLAH BLAH BLAH BLAH BLAH BLAH BLAH BLAH BLAH BLAH BLAH BLAH BLAH BLAH BLAH BLAH\n" +
        "                        BLAH BLAH BLAH BLAH BLAH BLAH BLAH BLAH BLAH BLAH BLAH BLAH BLAH BLAH BLAH BLAH BLAH BLAH BLAH\n" +
        "                        BLAH BLAH BLAH "
    const splitDescription = bookDescription.split(" ");

    const [displayText, setDisplayText] = useState('');



  // Contents
  const bookRef = useRef<any>(null);
  const fadeRef = useRef<any>(null);

  useEffect(() => {

    // Check if the page is already loaded
    if(isReady.current) {
      return;
    }

    isReady.current = true;



  }, []);


  const openBook = () => {
    console.log("openBook")

    if(bookRef.current) {
      console.log("open");
      bookRef.current.classList.toggle("open");
    }

    // Wait one second before animating the book
    setTimeout(() => {
      animateBook();
    }, 500);

    // Wait one second to change the page
    setTimeout(() => {
      changePage();
    }, 1000);
  }

  const animateBook = () => {
    console.log("animateBook")
    if(bookRef.current) {
      console.log("animate");
      bookRef.current.classList.toggle("animate");
    }

  }


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

              i++;
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

                  i--;
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
          setDisplayText("");

            // Restart the typing
            typeText();


      }, forwardSpeed * text.length + backwardSpeed * text.length + 1000);

  }


      const changePage = () => {

      // Set the fade out animation
      if(fadeRef.current) {
        fadeRef.current.classList.toggle("active");
      }

    // Wait for the fade out animation to finish
    setTimeout(() => {
      setPage(true);


    }, 800);

    // Start the typing
    setTimeout(() => {
        typeText();

    }, 1000);

  }

  // Setup the animation toggler when scrolled into view
    useEffect(() => {




    }, []);

  const orderNow = () => {
      console.log("Order Now")
  }

  const bookDisplay = () => {
    return (
        <>
          <ul className="shelf">
            <li ref={bookRef}>
              <img onClick={openBook} className="cover" src="/MainCover.webp"/>
              <div onClick={openBook} className="backface"> <img src="/About1.webp"/></div>
              <div className="pagecontainer">
                <ul className="pages">
                  <li id={"cover"} className="top" style={{zIndex: 4, top: 0, left: 0}}>
                    <img src="/About2.webp"/>
                  </li>
                  <li style={{top: "2px", left: "2px", zIndex: 3}}></li>
                  <li style={{top: "4px", left: "4px", zIndex: 2}}></li>
                  <li style={{top: "6px", left: "6px", zIndex: 1}}></li>
                </ul>
              </div>
              <div className="bottomcover"></div>
            </li>
            <h4>Click the cover to open</h4>
          </ul>
        </>
    )
  }

  const siteDisplay = () => {
    return (
        <>

            {/* Nav Bar */}
            <nav>
                <a href="#section-1">Home</a>
                <a href="#section-2">Our Product</a>
                <a href="#section-3">Our Aim</a>
                <a href="#section-4">Our Values</a>
                <a href="#section-5">About Us</a>

            </nav>

            <Section id={1} color={"#94C47D"}>

                {/* Main Title CREDIT https://codepen.io/amit_sheen/pen/WNweryv*/}
                <div>
                    <div className={book.imgLoader}></div>

                    <div className={book.container}>

                        <h1 className={book.title}>
                            Breez Bookz
                        </h1>

                        <div className={book.book}>
                            <div className={book.gap}></div>
                            <div className={book.pages}>
                                <div className={book.page}></div>
                                <div className={book.page}></div>
                                <div className={book.page}></div>
                                <div className={book.page}></div>
                                <div className={book.page}></div>
                                <div className={book.page}></div>
                            </div>
                            <div className={book.flips}>
                                <div className={book.flip + " " + book.flip1}>
                                    <div className={book.flip + " " + book.flip2}>
                                        <div className={book.flip + " " + book.flip3}>
                                            <div className={book.flip + " " + book.flip4}>
                                                <div className={book.flip + " " + book.flip5}>
                                                    <div className={book.flip + " " + book.flip6}>
                                                        <div className={book.flip + " " + book.flip7}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={book.credit}>
                            <p style={{display: "inline"}}>{displayText}</p><span id={"carat"}>|</span>
                        </div>

                        <ul className="circles">
                            <li></li>
                            <li></li>
                            <li></li>
                            <li></li>
                            <li></li>
                            <li></li>
                            <li></li>
                            <li></li>
                            <li></li>
                            <li></li>
                        </ul>

                    </div>
                </div>
            </Section>

            <Section id={2} color={"#6D9C67"}>
                <div className={styles.productSection}>

                    <div>
                        {/* Title */}
                        <h1> The Hungry Scholars Survival Handbook </h1>
                        <h2>Cooking your way to straight A’s</h2>

                        {/* Blurb */}
                        {splitDescription.map((el, i) => (
                            <motion.span
                                viewport={{once: false}}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{
                                    duration: 0.25,
                                    delay: i / 10,
                                }}
                                key={i}
                            >
                                {el}{" "}
                            </motion.span>
                        ))}

                        {/* Order Now */}
                        <motion.button onClick={orderNow} whileTap={{scale: 0.85}}> Order Now </motion.button>

                    </div>

                    {/* Book Image */}
                    <img data-ssc="flip-right" src={"/MainCover.webp"} alt={"The Hungry Scholars Survival Handbook"}/>
                </div>
            </Section>

            <Section id={3} color={"#477534"}>
            {/* Our Aim */}s
                <div/>
            </Section>

            <Section id={4} color={"#225011"}>
                {/* Our Values */}s
                <div/>
            </Section>

            <Section id={5} color={"#022E00"}>
                {/* About Us */}
                <div/>
                <section>
                    <div className='air air1'></div>
                    <div className='air air2'></div>
                    <div className='air air3'></div>
                    <div className='air air4'></div>
                </section>
            </Section>


        </>
    )
  }

    return (
        <>
            <div className={"fadeOverlay"} ref={fadeRef}></div>
            {
                page ?
                    siteDisplay()
                    :
                    bookDisplay()
            }
        </>
    );
}
