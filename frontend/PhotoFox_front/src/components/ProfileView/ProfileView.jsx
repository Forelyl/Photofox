import {Link, useParams} from "react-router-dom";
import {testAuthor} from "../../utils/auth.js";
import CustomReportButton from "../CustomButtons/CustomReportButton.jsx";
import useProfileLoad from "../../hooks/useProfileLoad.js";
import './ProfileView.css'
import CustomSubscribeButton from "../CustomButtons/CustomSubscribeButton.jsx";

export default function ProfileView({loading, setLoading}) {
    const {profileName} = useParams();
    const {error, profileData} = useProfileLoad(profileName, setLoading);
    const {profileId, profileImage, description, login, subscribedOn, subscribers, isBlocked} = profileData;
    const isOwner = testAuthor(profileId, login);
    console.log(isOwner, "is owner");

    if (isBlocked) throw new Error('User is blocked');


    return (
        <>
            {!error && <div>
                <div id='left'>
                    {loading ? (<div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>) :
                        (<img src={profileImage ?? '/NavBarElements/profile_icon.svg'} alt='profile image' />)}
                    <h3>{login}</h3>
                </div>
                <div id='right'>
                    <p>{description}</p>
                    <div id='info-row'>
                        <div>
                            <Link to={'subs?type=on_me'}>Subscribers</Link>
                            <span>{subscribers}</span>
                        </div>
                        <div>
                            <Link to={'subs?type=me_on'}>Subscribed on</Link>
                            <span>{subscribedOn}</span>
                        </div>
                        {(!isOwner) ?
                            <>
                                <CustomSubscribeButton intendedDestination={`/${login}`} authorId={profileId}/>
                                <CustomReportButton type={"profile"} id_for_report={1} ownerLogin={profileName} />
                            </> :
                            <Link to={'edit'}>Edit profile</Link>
                        }
                    </div>
                </div>
            </div>}
            {loading && !error && <div><div>Loading...</div></div>}
            {error && <div>An error occurred when requesting the server!<br/>Please reload page</div>}
        </>
    )
}