import {useEffect, useState} from "react";

export default function useProfileLoad(profileLogin = '', setLoading) {
    const [error, setError] = useState(false);
    const [profileData, setProfileData] = useState({
        profileId: -1,
        login: profileLogin,
        profileImage: '',
        isBlocked: false,
        description: '',
        subscribedOn: 0,
        subscribers: 0
    });

    useEffect(() => {
        setLoading(true);
        setError(false);

        fetch(`${import.meta.env.VITE_API_URL}/profile?login=${profileLogin}`, {
            method: 'GET',
            headers: {
                'content-type': 'application/json'
            }
        })
        .then(response => response.json())
        .then((values) => {
            setProfileData({
                profileId: values.id,
                login: values.login,
                profileImage: values.profile_image,
                isBlocked: values.is_blocked,
                description: values.description,
                subscribedOn: values.subscribed_on,
                subscribers: values.subscribers
            });
            setTimeout(() => setLoading(false), 1000);
        })
        .catch(() => {
            setError(true);
        });
    }, [profileLogin]);

    return { error, profileData };
}