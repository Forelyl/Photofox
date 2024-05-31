import {getToken} from "../../utils/auth.js";
import {clearIntendedDestination, setIntendedDestination} from "../../utils/independentDestination.js";
import {json, redirect, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";


export default function CustomLikeButton({ pictureId, initialState, initialNumber, isAuthor = false }){
    const [liked, setLiked] = useState();
    const [likeCounter, setLikeCounter] = useState();
    useEffect(() => {
        setLiked(initialState);
        setLikeCounter(initialNumber)
    }, [initialState]);

    const navigate = useNavigate();

    async function handleLikeClick(navigate) {
        if (!getToken()) {
            setIntendedDestination(`/picture/${pictureId}`);
            return navigate('/sign?mode=in');
        }
        else {
            clearIntendedDestination();
        }
        let response;
        if(liked) {
            response = await fetch(`${import.meta.env.VITE_API_URL}/like?image_id=${pictureId}`, {
                method: "DELETE",
                headers: {
                    'Authorization': getToken(),
                    'content-type': 'application/json'
                }
            });
            if (response.ok) {
                setLiked(false);
            }
            else {
                throw json({message: 'Could not authenticate user.'}, {status: response.status});
            }
        }
        else {
            response = await fetch(`${import.meta.env.VITE_API_URL}/like?image_id=${pictureId}`, {
                method: "POST",
                headers: {
                    'Authorization': getToken(),
                    'content-type': 'application/json'
                }
            });
            let value = await response.json();
            console.log(value);
            if (response.ok) {
                setLiked(true);
            }
            else {
                throw json({message: 'Could not authenticate user.'}, {status: response.status});
            }
        }
    }
    useEffect(() => {
        if (getToken()) {
            getNewCounter(liked);
        }
    }, [liked]);

    function getNewCounter(liked) {
        const values = fetch(`${import.meta.env.VITE_API_URL}/like?image_id=${pictureId}`, {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'content-type': 'application/json'
            }
        })
        .then(response => response.json())
        .then((values) => {
            setLikeCounter(values.like_counter);
        })
    }

    return <button onClick={() => handleLikeClick(navigate)} disabled={isAuthor}>
        <img src={(!liked) ? '/DropdownElements/like.svg' : '/ImageModuleIcons/like.svg'}
             alt='like button'/>
        <span>{likeCounter} likes</span>
    </button>
}