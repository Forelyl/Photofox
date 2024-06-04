import { useState, useEffect } from "react";
import { getToken } from "../utils/auth";

export default function useAdminImageLoad(lastImage) {
    const [loading, setLoading] = useState(true);
    const [images, setImages] = useState([]);
    const [imagesLeft, setImagesLeft] = useState(false);
    const [error, setError] = useState(false);
    const [lastId, setLastId] = useState(-1)
    let newStart = lastImage;

    useEffect(() => {
        setImages([]);
        lastImage = -1;
    }, []);

    useEffect(() => {
        setLoading(true);
        setError(false);

        const controller = new AbortController();
        const signal = controller.signal;
        let fetch_string = `${import.meta.env.VITE_API_URL}/complaint/image?last_image_id=${newStart}`;
        const headersQuery = {
            'Content-Type': 'application/json',
            'Authorization': getToken()
        }
        fetch(fetch_string, {
            method: 'GET',
            headers: headersQuery,
            signal: signal,
        })
        .then(response => response.json())
        .then(values => {
            setImages((prevImages) => {
                const allImages = [...prevImages, ...values];
                const idMap = new Map();
                console.log(values);
                return allImages.filter((image) => {
                    if (!idMap.has(image.id)) {
                        idMap.set(image.id, true);
                        return true;
                    }
                    return false;
                });
            });
            setImagesLeft(values.length === 10);
            setLastId(values[values.length - 1].id);
            setTimeout(() => setLoading(false), 1000);
        })
        .catch(error => {
            if (error.name === 'AbortError') return;
            setError(true);
        });
        return () => controller.abort();

    }, [newStart]);

    return { loading, images, imagesLeft, error, lastId };
}

