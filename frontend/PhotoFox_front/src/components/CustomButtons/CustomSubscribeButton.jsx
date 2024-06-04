import {getToken} from "../../utils/auth.js";
import {clearIntendedDestination, setIntendedDestination} from "../../utils/independentDestination.js";
import {json, redirect, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import './CustomSubscribeButton.css'

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
                console.log("0");
                setSubscribed(false);
            }
            else {
                console.log("1");
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
                console.log("2");
                setSubscribed(true);
            }
            else {
                console.log("3");
                throw json({message: 'Could not authenticate user.'}, {status: response.status});
            }
        }
    }
    const buttonClassList = `${!subscribed ? "sub" : "unsub"} customSubscribeButton`
    return <button onClick={handleSubscribeClick} disabled={isAuthor} className={buttonClassList}>
        {!subscribed ? 'Subscribe' : 'Unsubscribe'}
    </button>
}