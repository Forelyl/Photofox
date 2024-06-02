import {Link, useParams, useSearchParams} from "react-router-dom";
import NavBar from "../components/Menu/NavBar.jsx";
import {useCallback, useRef, useState} from "react";
import useSubsScrollLoad from "../hooks/useSubsScrollLoad.js";
import MiniProfile from "../components/MiniProfile.jsx";

export default function ProfileSubs() {
    const [searchParams] = useSearchParams();
    const mode = searchParams.get("mode");
    const { profileName} = useParams()
    const [lastProfile, setLastProfile] = useState(-1);
    const {subs, subsLeft, loading, error} = useSubsScrollLoad(lastProfile, profileName, mode);
    const {rows, lastId} = spreadProfiles(subs, subsLeft);
    const lastRow = useRef();
    const lastRowRef = useCallback(node => {
        if (loading) { return; }
        if (lastRow.current) { lastRow.current.disconnect(); }

        lastRow.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && subsLeft) {
                setLastProfile(lastId);
            }
        }, {
            threshold: 0.5,
        })
        if (node) lastRow.current.observe(node);
    }, [loading, subsLeft]);

    return (
        <>
            <NavBar hideSearch={true} />
            {(rows.length !== 0) && <div className="subs-container">
                {rows.map((row, index) => {
                    if (index + 1 === rows.length) {
                        return <div key={index} ref={lastRowRef} className={(subsLeft) ? 'row' : 'row last-row' }>
                            {row.map((profile) => {
                                return (
                                    <Link to={`/${profile.login}`} key={profile.id}>
                                        <img src={profile.profile_image ?? ''}/>
                                        <span>{profile.login}</span>
                                    </Link>
                                )
                            })}
                        </div>
                    }
                    else {
                        return <div key={index} className='row'>
                            {row.map((profile) => {
                                return (
                                    <Link to={`/${profile.login}`}>
                                        <img src={profile.profile_image}/>
                                        <span>{profile.login}</span>
                                    </Link>
                                )
                            })}
                        </div>
                    }
                })}
            </div>
            }
            {(rows.length === 0 || !subsLeft) && !error && ! loading && <div className='text-subs-info'><div>No subs were found</div></div>}
            {loading && !error && <div className='text-subs-info'><div>Loading...</div></div>}
            {error && <div className='text-subs-info'><div>An error occurred when requesting the server!<br/>Please reload page</div></div>}
        </>
    );
}

function spreadProfiles(profs, imagesLeft) {
    let rows = [];
    let rowProfiles = [];
    let lastId = -1;
    let amountInRow = 0;

    profs.map((profile, index) => {

        if (amountInRow < 2) {
            rowProfiles.push(profile);
            amountInRow++;
        }

        if (!imagesLeft && (index + 1) === profs.length) {
            rows.push(rowProfiles);
            rowProfiles = [];
            amountInRow = 0
            lastId = profile.id;
        }
    });
    return {rows, lastId};
}