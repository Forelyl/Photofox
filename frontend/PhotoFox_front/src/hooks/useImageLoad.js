import {useState, useEffect} from "react";

export default function useImageLoad(pictureId, setLoading) {
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

        fetch(`${import.meta.env.VITE_API_URL}/image?image_id=${pictureId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then((values) => {
            //console.log(values, 'values');
            setImageParams( {
                path: values.path,
                title: values.title,
                likeCounter: values.like_counter,
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
    }, [pictureId]);

    return { imageParams, error};
}