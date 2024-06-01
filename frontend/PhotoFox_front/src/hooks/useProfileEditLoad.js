import {useEffect, useState} from "react";
import {getToken} from "../utils/auth.js";

export default function useProfileEditLoad(setLoading, profileLogin) {
    const [error, setError] = useState(false);
    const [profileData, setProfileData] = useState({
        profileId: -1,
        login: '',
        profileImage: '',
        isBlocked: false,
        description: '',
        email: ''
    });

    useEffect(() => {
        setLoading(true);
        setError(false);

        fetch(`${import.meta.env.VITE_API_URL}/profile/edit`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': getToken()
            }
        })
        .then(response => response.json())
        .then((values) => {
            setProfileData({
                profileId: values.id,
                login: values.login,
                profileImage: values.profile_image ?? null,
                isBlocked: values.is_blocked,
                description: values.description,
                email: values.email
            });
            setTimeout(() => setLoading(false), 1000);
        })
        .catch(() => {
            setError(true);
        });
    }, [profileLogin]);

    return { error, profileData };
}