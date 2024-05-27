import {useState, useRef, useCallback} from "react";
import useImageLoad from "../../utils/useImageLoad.js";
import ImageRow from "./ImageRow.jsx";
import './test.css';

export default function ImageScroller() {
    const [lastImage, setLastImage] = useState(-1);
    const [filters, setFilters] = useState([]);

    const {images, imagesLeft, loading} = useImageLoad(lastImage, filters);
    const {rows, lastId} = spreadImages(images, imagesLeft);

    const lastRow = useRef();
    const lastRowRef = useCallback(node => {
        if (loading) return;
        if (lastRow.current) lastRow.current.disconnect();
        lastRow.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && imagesLeft) {
                setLastImage(lastId);
            }
        })
        if (node) lastRow.current.observe(node);
    }, [loading, imagesLeft]);

    return (
        <div >
            <div className="grid-container">
                {rows.map((row, index) => {
                    if (index + 1 === images.length) {
                        console.log('sd')
                        return <ImageRow key={index} images={row} ref={lastRowRef}/>
                    }
                    else {
                        return <ImageRow key={index} images={row}/>
                    }
                })}
            </div>
            <div>{loading && <span>Loading...</span>}</div>
        </div>
    );
}

function spreadImages(images, imagesLeft) {
    let rows = [];
    let rowImages = [];
    let expectedWidth = 0;
    let lastId;
    const maxWidth = 1500;
    images.map((image, index) => {
        expectedWidth += image.width;
        console.log(expectedWidth, image.id);
        if (expectedWidth < maxWidth) {
            rowImages.push(image);
            console.log('kf')
        }

        if ((!imagesLeft && (index + 1) === images.length) || expectedWidth > maxWidth) {
            rows.push(rowImages);

            rowImages = [];
            expectedWidth = 0;
            lastId = image.id - 1;
        }
    });
    return {rows, lastId};
}
