import {Link, useSearchParams, json} from "react-router-dom";
import NavBar from "../components/Menu/NavBar.jsx";
import ImageScroller from "../components/ImageScroller/ImageScroller.jsx";

export default function ProfilePictures() {
    const [searchParams] = useSearchParams();
    const page_type = searchParams.get("type") || "saved";
    if ( page_type !== "saved" && page_type !== "liked" ) {
        throw json({message: 'Unknown address'}, {status: 404});
    }

    return (
        <>
            <NavBar/>
            <div id='top'>
                <Link to='/'>
                    <img src='/SignElements/back_arrow.svg' alt='return to home page'/>
                </Link>
                <h1>{page_type}</h1>
            </div>
            <ImageScroller/>
        </>
    );
}