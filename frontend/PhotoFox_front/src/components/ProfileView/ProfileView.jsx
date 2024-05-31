import {Link, useParams} from "react-router-dom";
import {testAuthor} from "../../utils/auth.js";
import CustomSubscribeButton from "../CustomButtons/CustomSubscribeButton.jsx";
import CustomReportButton from "../CustomButtons/CustomReportButton.jsx";


export default function ProfileView({loading, setLoading}) {
    const {profileName} = useParams();

    const isOwner = testAuthor()


    function handleSubscribe(){

    }

    return (
        <div>
            <div id='left'>
                <img />
                <h3>{profileName}</h3>
            </div>
            <div id='right'>
                <p>{description}</p>
                <div id='info-row'>
                    <div>
                        <Link to={'/'}>Subscribers</Link>
                        <span>{subsCounter}</span>
                    </div>
                    <div>
                        <Link to={'/'}>Subscribed on</Link>
                        <span>{subedCounter}</span>
                    </div>
                    {(!isOwner) ?
                        <>
                            <button onClick={handleSubscribe}>Subscribe</button>
                            <CustomReportButton type={"profile"} id_for_report={2} ownerLogin={profileName} />
                        </>
                        :
                        <Link to={'edit'}>Edit profile</Link>

                    }
                </div>
            </div>
        </div>
    )
}