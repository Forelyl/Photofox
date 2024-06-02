import {Link} from "react-router-dom";
import {testAuthor} from "../../utils/auth.js";
import CustomReportButton from "../CustomButtons/CustomReportButton.jsx";
import useProfileLoad from "../../hooks/useProfileLoad.js";
import './ProfileView.css'
import CustomSubscribeButton from "../CustomButtons/CustomSubscribeButton.jsx";

export default function ProfileView({loading, setLoading, profileName}) {

    const {error, profileData} = useProfileLoad(profileName, setLoading);
    const {profileId, profileImage, description, login, subscribedOn, subscribers, isBlocked, subscribedNow} = profileData;
    const isOwner = testAuthor(login);
    if (error) {
        throw new Error("User was not found.");
    }
    if (isBlocked) throw new Error('User is blocked');


    return (
        <>
            <div id='profile'>
                <div id='left'>
                    {loading ? 
                    <div><img src="/loading.io_Ellipsis.svg" alt="" /></div>
                    :
                    <div><img src={profileImage ?? '/NavBarElements/profile_icon.svg'} alt='profile image' /></div>
                    }
                    <h3>{login}</h3>
                </div>
                <div id='right'>
                    <div id='profile-description'>{description}</div>
                    <div id='info-row'>
                        <div className='button-and-number'>
                            <div className='profile-button'>
                                <Link to={'subs?mode=on_me'}>Subscribers</Link>
                            </div>
                            <span>{subscribers}</span>
                        </div>
                        <div className='button-and-number'>
                            <div className='profile-button'>
                                <Link to={'subs?mode=me_on'}>Subscribed on</Link>
                            </div>
                            <span>{subscribedOn}</span>
                        </div>
                        {(!isOwner) ?
                            <>
                                <CustomSubscribeButton intendedDestination={`/${login}`} authorId={profileId} initialState={subscribedNow}/>
                                <CustomReportButton type={"profile"} id_for_report={1} ownerLogin={profileName} />
                            </> :
                            <Link to={'edit'} className='profile-button' id='edit-profile'>Edit profile</Link>
                        }
                    </div>
                </div>
            </div>
            {loading && <div className='text-subs-info-profile'><div>Loading...</div></div>}
        </>
    )
}