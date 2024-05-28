import { useState, useEffect } from "react";

export default function useImageLoad(lastImage, filters) {
    const [loading, setLoading] = useState(true);
    const [images, setImages] = useState([]);
    const [imagesLeft, setImagesLeft] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        setImages([]);
    }, [filters]);

    useEffect(() => {
        setLoading(true);
        setError(false);
        const controller = new AbortController();
        const signal = controller.signal;

        fetch(`http://127.0.0.1:3000/image/last?last_image_id=${lastImage}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            signal: signal
        })
        .then(response => response.json())
        .then(values => {
            setImages((prevImages) => { return [...prevImages, ...values] });
            console.log(values);
            setImagesLeft(values.length > 0);
            setLoading(false);
            console.log('fetch finished')
        })
        .catch(error => {
            if (error.name === 'AbortError') return;
            setError(true);
        });
        return () => controller.abort();
    }, [lastImage, filters]);
    //console.log(imagesLeft, 'images left');

    return {loading, images, imagesLeft, error};
}

