import {Link, useSearchParams, json} from "react-router-dom";
import NavBar from "../../components/Menu/NavBar.jsx";
import ImageScroller from "../../components/ImageScroller/ImageScroller.jsx";
import { useState } from "react";
import './UsersPictures.css'

export default function UsersPictures() {
    const [searchParams] = useSearchParams();
    const pageType = searchParams.get("type") || "saved";

    if ( pageType !== "saved" && pageType !== "liked" ) {
        throw json({message: 'Unknown address'}, {status: 404});
    }
    const filter = {
        primaryFilter : {
            type: pageType,
            author: null
        },
        secondaryFilter : [],
    }

    const [filters, setFilters] = useState(filter);
    const [tags, setTags] = useState([]);

    const titlePage = pageType.charAt(0).toUpperCase() + pageType.slice(1);

    return (
        <>
            <NavBar sets={[setFilters, setTags]}/>
            <div id='top-of-users-pictures'>
                <Link to='/'>
                    <img src='/SignElements/back_arrow.svg' alt='return to home page'/>
                </Link>
                <h1>{titlePage}</h1>
            </div>
            <ImageScroller filters={filters} tags={tags} userSpecific={true}/>
        </>
    );
}