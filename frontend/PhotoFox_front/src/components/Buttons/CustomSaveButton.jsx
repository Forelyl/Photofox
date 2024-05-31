import {getToken} from "../../utils/auth.js";
import {clearIntendedDestination, setIntendedDestination} from "../../utils/independentDestination.js";
import {json, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";

export default function CustomSaveButton({ pictureId, initialState }){
    const [saved, setSaved] = useState();

    useEffect(() => {
        setSaved(initialState);
    }, [initialState]);

    const navigate = useNavigate();

    async function handleSaveClick() {
        if (!getToken()) {
            setIntendedDestination(`/picture/${pictureId}`);
            return navigate('/sign?mode=in');
        }
        else {
            clearIntendedDestination();
        }
        let response;
        if(saved) {
            response = await fetch(`${import.meta.env.VITE_API_URL}/save/delete?image_id=${pictureId}`, {
                method: "DELETE",
                headers: {
                    'Authorization': getToken(),
                }
            });
            if (response.ok) {
                setSaved(false);
            }
            else {
                throw json({message: 'Could not authenticate user.'}, {status: response.status});
            }
        }
        else {
            response = await fetch(`${import.meta.env.VITE_API_URL}/save/add?image_id=${pictureId}`, {
                method: "POST",
                headers: {
                    'Authorization': getToken(),
                }
            });
            if (response.ok) {
                setSaved(true);
            }
            else {
                throw json({message: 'Could not authenticate user.'}, {status: response.status});
            }
        }
    }

    return <button onClick={handleSaveClick}>
        <img src='/DropdownElements/saved.svg' alt='save button'/>
        <span>Save</span>
    </button>
}