import './HomePage.css'
import Banner from "../../components/Banner/Banner.jsx";
import NavBar from "../../components/Menu/NavBar.jsx";
import ImageScroller from "../../components/ImageScroller/ImageScroller.jsx";
import { useRef } from "react";

export default function HomePage() {
    const elementRef = useRef(null);

    function handleScrollClick() {
        elementRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start"
        })
    }
    return (
        <div id='home'>
            <Banner scrollToElement={handleScrollClick}/>
            <NavBar ref={elementRef}/>
            <ImageScroller />
        </div>
    );
}

