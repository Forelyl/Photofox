import {Link, useSearchParams, json} from "react-router-dom";
import NavBar from "../components/Menu/NavBar.jsx";
import ImageScroller from "../components/ImageScroller/ImageScroller.jsx";
import { useState } from "react";

export default function ProfilePictures() {
    const [searchParams] = useSearchParams();
    const pageType = searchParams.get("type") || "saved";

    if ( pageType !== "saved" && pageType !== "liked" ) {
        throw json({message: 'Unknown address'}, {status: 404});
    }
    const filter = {
        primaryFilter : pageType,
        secondaryFilter : [],
    }

    const [filters, setFilters] = useState(filter);
    const [tags, setTags] = useState([]);

    return (
        <>
            <NavBar sets={[setFilters, setTags]}/>
            <div id='top'>
                <Link to='/'>
                    <img src='/SignElements/back_arrow.svg' alt='return to home page'/>
                </Link>
                <h1>{pageType}</h1>
            </div>
            <ImageScroller filters={filters} tags={tags}/>
        </>
    );
}