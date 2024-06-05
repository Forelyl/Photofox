import './HomePage.css'
import Banner from "../../components/Banner/Banner.jsx";
import NavBar from "../../components/Menu/NavBar.jsx";
import ImageScroller from "../../components/ImageScroller/ImageScroller.jsx";
import { useRef, useState } from "react";

export default function HomePage() {
    const elementRef = useRef(null);
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState({
        primaryFilter : {
            type: null,
            author: null
        },
        secondaryFilter : [],
    });
    const [tags, setTags] = useState([]);
    console.log(filters, "it`s filters");
    function handleScrollClick() {
        elementRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start"
        })
    }

    return (
        <div id='home'>
            <Banner scrollToElement={handleScrollClick}/>
            <NavBar ref={elementRef} setFilters={setFilters} setTags={setTags} setSearch={setSearch}/>
            <ImageScroller filters={filters} tags={tags} search={search}/>
        </div>
    );
}


