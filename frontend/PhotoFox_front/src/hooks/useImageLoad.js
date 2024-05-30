import { useState, useEffect } from "react";

export default function useImageLoad(lastImage, filters, tags) {
    const [loading, setLoading] = useState(true);
    const [images, setImages] = useState([]);
    const [imagesLeft, setImagesLeft] = useState(false);
    const [error, setError] = useState(false);
    let newStart = lastImage;
    useEffect(() => {
        setImages([]);
        lastImage = -1;
    }, [filters, tags]);

    useEffect(() => {
        setLoading(true);
        setError(false);

        let filters_string = '';
        if (filters) {
            if (filters.primary_filter) {
                filters_string += '&filters=' + filters.primary_filter;
            }
            for (let one_filter in filters.secondary_filter) {
                if (filters[one_filter]) {
                    filters_string += '&filters=' + filters[one_filter];
                    console.log(11)
                }
            }
        }
        let tags_string = '';
        if (tags && tags.length > 0) {
            for (let one_tag in tags) {
                if (tags[one_tag]){
                    tags_string += '&tags=' + tags[one_tag];
                    console.log(22)
                }
            }
        }
        const controller = new AbortController();
        const signal = controller.signal;
        let fetch_string = `http://127.0.0.1:3000/image/pc?last_image_id=${newStart}` + filters_string + tags_string;
        console.log(fetch_string);
        fetch(fetch_string, {
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

    }, [newStart, filters, tags]);

    return { loading, images, imagesLeft, error };
}