import { useState, useEffect } from "react";

export default function useImageLoad(lastImage, filters) {
    const [loading, setLoading] = useState(true);
    const [images, setImages] = useState([]);
    const [imagesLeft, setImagesLeft] = useState(false);

    useEffect(() => {
        setImages([]);
    }, [filters]);

    useEffect(() => {
        setLoading(true);
        // setError(false);
        async function getF(){
            const response = await fetch(`http://127.0.0.1:3000/image/last`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'last_image-id': lastImage
                }
            });
            const values = await response.json();
            setImages((prevImages) => [...prevImages, ...values]);
            setImagesLeft(values.length > 0);
            return null;
        }
        const gg = getF();
        setLoading(false);
    }, [lastImage, filters]);

    return {loading, images, imagesLeft};
}

