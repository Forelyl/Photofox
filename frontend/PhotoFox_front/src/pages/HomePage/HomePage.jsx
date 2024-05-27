import './HomePage.css'
import Banner from "../../components/Banner/Banner.jsx";
import NavBar from "../../components/Menu/NavBar.jsx";
import ImageScroller from "../../components/ImageScroller/ImageScroller.jsx";
import {defer, useLoaderData} from "react-router-dom";

export default function HomePage() {
    const images = useLoaderData();


    return (
        <>
            <Banner />
            <NavBar />
            <ImageScroller />
        </>
    );
}

export function loader() {
    return defer({
        images: loadImage()
    });

}