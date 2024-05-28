import './HomePage.css'
import Banner from "../../components/Banner/Banner.jsx";
import NavBar from "../../components/Menu/NavBar.jsx";
import ImageScroller from "../../components/ImageScroller/ImageScroller.jsx";

export default function HomePage() {
    return (
        <div id='home'>
            <Banner />
            <NavBar />
            <ImageScroller />
        </div>
    );
}

