import {getToken} from "../../utils/auth.js";
import {clearIntendedDestination, setIntendedDestination} from "../../utils/independentDestination.js";
import {json, redirect, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";

export default function CustomSaveButton({ pictureId, authorId, initialState, isAuthor = false }){
    const [saved, setSaved] = useState();

    useEffect(() => {
        setSaved(initialState);
    }, [initialState]);

    const navigate = useNavigate();

    async function handleSubscribeClick() {
        if (!getToken()) {
            setIntendedDestination(`/picture/${pictureId}`);
            return navigate('/sign?mode=in');
        }
        else {
            clearIntendedDestination();
        }
        let response;
        if(saved) {
            response = await fetch(`${import.meta.env.VITE_API_URL}/subscribe?subscribed_on_id=${authorId}`, {
                method: "DELETE",
                headers: {
                    'Authorization': getToken(),
                }
            });
            if (response.ok) {
                setSubscribed(false);
            }
            else {
                throw json({message: 'Could not authenticate user.'}, {status: response.status});
            }
        }
        else {
            response = await fetch(`${import.meta.env.VITE_API_URL}/subscribe?subscribe_on_id=${authorId}`, {
                method: "POST",
                headers: {
                    'Authorization': getToken(),
                }
            });
            if (response.ok) {
                setSubscribed(true);
            }
            else {
                throw json({message: 'Could not authenticate user.'}, {status: response.status});
            }
        }
    }

    return <button onClick={handleSubscribeClick} disabled={isAuthor}>
        {!subscribed ? 'Subscribe' : 'Unsubscribe'}
    </button>
}