import { useState, useEffect } from "react";

export default function useImageLoad(lastImage, filters, ) {
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
        //console.log('im here line 18')
        //console.log(lastImage)
        fetch(`http://127.0.0.1:3000/image/last?last_image_id=${lastImage}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            signal: signal
        })
        .then(response => response.json())
        .then(values => {
            setImages((prevImages) => {
                const allImages = [...prevImages, ...values];
                const idMap = new Map();

                return allImages.filter((image) => {
                    if (!idMap.has(image.id)) {
                        idMap.set(image.id, true);
                        return true;
                    }
                    return false;
                });
            });
            setImagesLeft(values.length === 30);
            setTimeout(() => setLoading(false), 1000);
        })
        .catch(error => {
            if (error.name === 'AbortError') return;
            setError(true);
        });
        return () => controller.abort();
    }, [lastImage, filters]);

    return {loading, images, imagesLeft, error};
}

