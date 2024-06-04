import AdminMenu from "../../components/AdminComps/AdminMenu.jsx";
import ReportedImage from "../../components/AdminComps/ReportedImage.jsx";
import {getToken} from "../../utils/auth.js";
import {redirect} from "react-router-dom";
import useAdminImageLoad from "../../hooks/useAdminImageLoad.js";
import {useCallback, useRef, useState} from "react";


export default function AdminPage() {
    const [ lastImage, setLastImage ] = useState(-1);
    const { loading, images, imagesLeft, error, lastId} = useAdminImageLoad(lastImage);
    const lastRow = useRef();
    const lastRowRef = useCallback(node => {
        if (loading) { return; }
        if (lastRow.current) { lastRow.current.disconnect(); }

        lastRow.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && imagesLeft) {
                console.log('see you', lastId)
                setLastImage(lastId);
            }
        }, {
            threshold: 0.5,
        })
        if (node) lastRow.current.observe(node);
    }, [loading, imagesLeft]);
    return (
        <>
            <AdminMenu />
            {(images.length !== 0) && <div className="images-container">
                {images.map((image, index) => {
                    if (index + 1 === images.length) {

                        return <ReportedImage key={index} imageData={image} ref={lastRowRef} />;
                    }
                    else {
                        return <ReportedImage key={index} imageData={image} />;
                    }
                })}
                </div>
            }
        </>
    );
}

export async function loader() {
    const token = getToken();
    if (!token) return redirect('/');

    const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/iam`, {
        method: 'GET',
        headers: {
            Authorization: `${token}`
        }
    })

    if (response.status === 200) {
        return null;
    }
    else {
        return redirect('/');
    }
}