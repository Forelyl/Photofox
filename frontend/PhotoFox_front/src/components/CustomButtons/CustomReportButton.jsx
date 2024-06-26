import {useState} from "react";
import {getToken} from "../../utils/auth.js";
import {clearIntendedDestination, setIntendedDestination} from "../../utils/independentDestination.js";
import {useNavigate} from "react-router-dom";
import './CustomReportButton.css'

export default function CustomReportButton({ id_for_report, type, children, ownerLogin=null }) {
    const [showPopup, setShowPopup] = useState(false);
    const [toShow, setToShow] = useState('Report sent');
    const navigate = useNavigate();

    async function handleReportClick() {
        let query = '';
        let intendedDestination = '';
        switch (type) {
            case "image":
                query = `${import.meta.env.VITE_API_URL}/complaint/image?image_id=${id_for_report}`;
                intendedDestination = `/picture/${id_for_report}`;
                break;
            case "comment":
                query = `${import.meta.env.VITE_API_URL}/complaint/comment?comment_id=${id_for_report}`;
                intendedDestination = `/picture/${id_for_report}`;
                break;
            case "profile":
                query = `${import.meta.env.VITE_API_URL}/complaint/profile?profile_owner_id=${id_for_report}`;
                intendedDestination = `/${ownerLogin}`;
                break;
            default:
                throw new Error(`Unknown type '${type}'`);
        }

        if (!getToken()) {
            setIntendedDestination(intendedDestination);
            return navigate('/sign?mode=in');
        }
        else {
            clearIntendedDestination();
        }
        const response = await fetch(query, {
            method: "POST",
            headers: {
                'Authorization': getToken(),
            }
        });
        console.log(response.json());
        if (response.ok) {
            setShowPopup(true);
        }
        if (response.status === 400) {
            setToShow('You have already send a report');
            setShowPopup(true);
        }
        setTimeout(() => {
            setShowPopup(false);}, 2500);
    }

    return (
        <div>
            <button onClick={handleReportClick} className="customReportButton">
                <img src='/ImageModuleIcons/report_button.svg' alt='report button'/>
                {showPopup ? <span id='long-report-text'>{toShow}</span> : <span>{children}</span>}
            </button>
        </div>
    );
}