import NavBar from "../components/Menu/NavBar.jsx";
import ImageFrame from "../components/ImageView/ImageFrame.jsx";
import ImageScroller from "../components/ImageScroller/ImageScroller.jsx";
import {useState} from "react";

export default function PicturePage() {
    const [filters] = useState({
        primaryFilter : {
            type: null,
            author: null,
        },
        secondaryFilter : [],
    });
    const [tags] = useState([]);
    const [loading, setLoading] = useState(true);
    
    return (
        <>
            <NavBar hideSearch={true}/>
            <ImageFrame setLoading={setLoading} loading={loading}/>
            {!loading && <ImageScroller filters={filters} tags={tags}/>}
        </>
    );
}