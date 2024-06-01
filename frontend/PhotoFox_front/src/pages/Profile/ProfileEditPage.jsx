import NavBar from "../../components/Menu/NavBar.jsx";
import {useParams} from "react-router-dom";
import ProfileEdit from "../../components/ProfileView/ProfileEdit.jsx";

export default function ProfileEditPage() {
    const {profileName} = useParams();

    return (
        <>
            <NavBar hideSearch={true} hideAdd={true}/>
            <ProfileEdit loading={loading} setLoading={setLoading}/>
        </>
    );
}