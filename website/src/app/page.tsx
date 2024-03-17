"use client"
import {useEffect, useRef, useState} from "react";
import styles from "@/styles/main.module.css"
import book from "@/styles/book.module.css"
import Section from "@/components/section";

export default function Home() {


  const isReady = useRef(false);
  const [page, setPage] = useState(false);

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

  const changePage = () => {

      // Set the fade out animation
      if(fadeRef.current) {
        fadeRef.current.classList.toggle("active");
      }

    // Wait for the fade out animation to finish
    setTimeout(() => {
      setPage(true);
    }, 800);

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
                          Making cooking a "breez"
                      </div>

                  </div>
              </div>
          </Section>

         <Section id={2} color={"#6D9C67"}>
              {/* Our Product */}
             <div/>
        </Section>

         <Section id={3} color={"#477534"}>
             {/* Our Aim */}s
            <div/>
         </Section>

         <Section id={4} color={"#225011"}>
             {/* Our Aim */}s
             <div/>
         </Section>

         <Section id={5} color={"#022E00"}>
             {/* About Us */}
             <div/>
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
