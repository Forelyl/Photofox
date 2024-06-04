import AdminMenu from "../../components/AdminComps/AdminMenu.jsx";
import ReportedImage from "../../components/AdminComps/ReportedImage.jsx";
import {getToken} from "../../utils/auth.js";
import {redirect} from "react-router-dom";


export default function AdminPage() {
    return (
        <>
            <AdminMenu />
            <ReportedImage />
        </>
    );
}

export async function loader() {
    const token = getToken();
    if (!token) return redirect('/');

    const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/iam`, {
        method: 'GET',
        headers: {
            Authorization: `${token}`
        }
    })

    if (response.status === 200) {
        return null;
    }
    else {
        return redirect('/');
    }
}