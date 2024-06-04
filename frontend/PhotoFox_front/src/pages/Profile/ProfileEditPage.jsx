import NavBar from "../../components/Menu/NavBar.jsx";
import {redirect, useParams} from "react-router-dom";
import ProfileEdit from "../../components/ProfileView/ProfileEdit.jsx";
import {getLogin, getToken} from "../../utils/auth.js";

export default function ProfileEditPage() {
    return (
        <>
            <NavBar hideSearch={true} hideAdd={true}/>
            <ProfileEdit/>
        </>
    );
}

export function loader({params, request}) {
    const urlParts = request.url.split("/");
    const profileName = urlParts[urlParts.length - 2];
    const login = getLogin();
    if (login && profileName === login && getToken()) {
        return null
    }
    else {
        return redirect('/sign?mode=in');
    }
}