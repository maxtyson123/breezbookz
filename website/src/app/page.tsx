"use client"
import {useEffect, useRef} from "react";


export default function Home() {


  const isReady = useRef(false);

  // Contents
  const bookRef = useRef<any>(null);

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
    }, 1000);
  }

  const animateBook = () => {
    console.log("animateBook")
    if(bookRef.current) {
      console.log("animate");
      bookRef.current.classList.toggle("animate");
    }
  }

  return (
      <>
        <ul className="shelf">
          <li ref={bookRef}>
            <img onClick={openBook} className="cover" src="https://3.bp.blogspot.com/-v3Or4lDcrXU/Tn4GzPDB1jI/AAAAAAAADqE/xqHYipuz2rY/s1600/Scott%2BFitzgerald_The_Great_Gatsby_cover.jpg"/>
            <div className="backface"></div>
            <div className="pagecontainer">
              <ul className="pages">
                <li id={"cover"} className="top" style={{zIndex: 4, top: 0, left: 0}}>
                  <h1>Title</h1>
                  <span className="author">Author</span>
                  <h3>Contents:</h3>
                  <ul className="contents">
                    <li><a href="#">Chapter 1<abbr>21/1/2014</abbr></a></li>
                    <li><a href="#">Chapter 2<abbr>21/1/2014</abbr></a></li>
                    <li><a href="#">Chapter 3<abbr>21/1/2014</abbr></a></li>
                    <li><a href="#">Chapter 4<abbr>21/1/2014</abbr></a></li>
                    <li><a href="#">Chapter 5<abbr>21/1/2014</abbr></a></li>
                  </ul>
                  <a href="" className="button">Continue reading</a>
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
  );
}
