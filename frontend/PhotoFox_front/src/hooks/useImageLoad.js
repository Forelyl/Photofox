import {useState, useEffect} from "react";
import { getToken } from "../utils/auth";

export default function useImageLoad(pictureId, setLoading, liked, subscribed) {
    const [error, setError] = useState(false);
    const [imageParams, setImageParams] = useState({
        path: '',
        title: '',
        subscribed: false,
        liked: false,
        likeCounter: 0,
        commentCounter: 0,
        authorId: 0,
        authorLogin: '',
        authorPicture: '',
        description: '',
        tags: []
    });

    useEffect(() => {
        setLoading(true);
        setError(false);
        let query_headers = {'Content-Type': 'application/json'};
        if (getToken()) query_headers = {'Content-Type': 'application/json', 'Authorization': getToken()};

        fetch(`${import.meta.env.VITE_API_URL}/image${getToken() ? '/user' : ''}?image_id=${pictureId}`, {
            method: 'GET',
            headers: query_headers
        })
        .then(response => response.json())
        .then((values) => {
            setImageParams( {
                path: values.path,
                title: values.title,
                likeCounter: values.like_counter,
                liked: values.is_liked,
                subscribed: values.is_subscribed,
                commentCounter: values.comment_counter,
                authorId: values.author_id,
                authorLogin: values.author_login,
                authorPicture: values.author_picture,
                description: values.description,
                tags: values.tags
            });
            
            setTimeout(() => setLoading(false), 1000);
        })
        .catch(error => {
            setError(true);
        });
    }, [pictureId, liked, subscribed]);

    return { imageParams, error};
}