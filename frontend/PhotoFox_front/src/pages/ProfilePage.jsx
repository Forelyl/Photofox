import NavBar from "../components/Menu/NavBar.jsx";
import {useState} from "react";
import ProfileView from "../components/ProfileView/ProfileView.jsx";
import ImageScroller from "../components/ImageScroller/ImageScroller.jsx";

export default function ProfilePage() {
    const [filters] = useState({
        primaryFilter : "published",
        secondaryFilter : [],
    });
    const [tags] = useState([]);
    const [loading, setLoading] = useState(true);

    return (
        <>
            <NavBar hideSearch={true}/>
            <ProfileView loading={loading} setLoading={setLoading}/>
            {!loading && <ImageScroller filters={filters} tags={tags}/>}
        </>
    );
}