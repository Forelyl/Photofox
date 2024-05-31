import { useState, useEffect } from "react";

export default function useImageLoad(lastImage, filters, tags) {
    const [loading, setLoading] = useState(true);
    const [images, setImages] = useState([]);
    const [imagesLeft, setImagesLeft] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        setImages([]);
    }, [filters, tags]);

    useEffect(() => {
        setLoading(true);
        setError(false);

        let filters_string = '';
        if (filters && filters.length > 0) {
            for (let one_filter in filters_string) {
                filters_string += '&filters=' + one_filter;
            }
        }
        let tags_string = '';
        if (tags && tags.length > 0) {
            for (let one_tag in tags) {
                tags_string += '&tags=' + one_tag;
            }
        }
        const controller = new AbortController();
        const signal = controller.signal;
        fetch(`${import.meta.env.VITE_API_URL}/image/pc?last_image_id=${lastImage}` + filters_string + tags_string, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            signal: signal
        })
        .then(response => response.json())
        .then(values => {
            console.log(values);
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
            console.log('see ya')
            setTimeout(() => setLoading(false), 1000);
        })
        .catch(error => {
            if (error.name === 'AbortError') return;
            setError(true);
        });
        return () => controller.abort();

    }, [lastImage, filters, tags]);

    return { loading, images, imagesLeft, error };
}