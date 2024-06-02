import {useEffect, useState} from "react";
import {getToken} from "../utils/auth.js";

export default function useProfileLoad(profileLogin = '', setLoading) {
    const [error, setError] = useState(false);
    const [profileData, setProfileData] = useState({
        profileId: -1,
        login: profileLogin,
        profileImage: '',
        isBlocked: false,
        description: '',
        subscribedOn: 0,
        subscribers: 0,
        subscribedNow: false
    });

    useEffect(() => {
        setLoading(true);
        setError(false);

        let query_headers = {'Content-Type': 'application/json'};
        if (getToken()) query_headers = {'Content-Type': 'application/json', 'Authorization': getToken()};

        fetch(`${import.meta.env.VITE_API_URL}/profile${getToken() ? '/user' : ''}?login=${profileLogin}`, {
            method: 'GET',
            headers: query_headers
        })
        .then(response => {
            console.log(response)
            if (!response.ok) {
                throw new Error("User was not found")
            }
            return response.json();
        })
        .then((values) => {
            setProfileData({
                profileId: values.id,
                login: values.login,
                profileImage: values.profile_image,
                isBlocked: values.is_blocked,
                description: values.description,
                subscribedOn: values.subscribed_on,
                subscribers: values.subscribers,
                subscribedNow: values.subscribed_now
            });
            setTimeout(() => setLoading(false), 1000)
        })
        .catch((error) => {
            setError(true);
        })
        // .finally(() => setTimeout(() => setLoading(false), 1000));
    }, [profileLogin]);
    return { error, profileData };
}