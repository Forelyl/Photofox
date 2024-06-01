import {Link} from "react-router-dom";
import {testAuthor} from "../../utils/auth.js";
import CustomReportButton from "../CustomButtons/CustomReportButton.jsx";
import useProfileLoad from "../../hooks/useProfileLoad.js";
import './ProfileView.css'
import CustomSubscribeButton from "../CustomButtons/CustomSubscribeButton.jsx";

export default function ProfileView({loading, setLoading, profileName}) {

    const {error, profileData} = useProfileLoad(profileName, setLoading);
    const {profileId, profileImage, description, login, subscribedOn, subscribers, isBlocked, subscribedNow} = profileData;
    const isOwner = testAuthor(profileId, login);
    console.log(isOwner, "is owner");

    if (isBlocked) throw new Error('User is blocked');


    return (
        <>
            {!error && <div id='profile'>
                <div id='left'>
                    {!loading ? 
                    <div className="lds-ellipsis-profile"><div></div><div></div><div></div><div></div></div>
                    :
                    <div><img src={profileImage ?? '/NavBarElements/profile_icon.svg'} alt='profile image' /></div>
                    }
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
                                <CustomSubscribeButton intendedDestination={`/${login}`} authorId={profileId} initialState={subscribedNow}/>
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