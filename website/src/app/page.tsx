"use client"
import {useEffect, useRef, useState} from "react";


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
              <div className="backface"> <img src="/About1.webp"/></div>
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

  return (
      <>
        <div className={"fadeOverlay"} ref={fadeRef}></div>
        {
          page ?
            <div className={"test"}>BREEZ BOOKZ WEBSITE HERE</div>
              :
            bookDisplay()
        }
      </>
  );
}
