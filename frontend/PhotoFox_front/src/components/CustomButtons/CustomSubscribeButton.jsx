import {getToken} from "../../utils/auth.js";
import {clearIntendedDestination, setIntendedDestination} from "../../utils/independentDestination.js";
import {json, redirect, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";

export default function CustomSubscribeButton({ intendedDestination, authorId, initialState, isAuthor = false }){
    const [subscribed, setSubscribed] = useState();

    useEffect(() => {
        setSubscribed(initialState);
    }, [initialState]);

    const navigate = useNavigate();

    async function handleSubscribeClick() {
        if (!getToken()) {
            setIntendedDestination(intendedDestination);
            return navigate('/sign?mode=in');
        }
        else {
            clearIntendedDestination();
        }
        let response;
        if(subscribed) {
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