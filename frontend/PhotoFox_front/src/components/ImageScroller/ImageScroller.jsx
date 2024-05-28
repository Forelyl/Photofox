import {useState, useRef, useCallback} from "react";
import useImageLoad from "../../utils/useImageLoad.js";
import ImageRow from "./ImageRow.jsx";
import './ImageScroller.css';

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
    console.log(rows.length, "lol")
    return (
        <>
            <div className="images-container">
                {rows.map((row, index) => {
                    if (index + 1 === rows.length) {
                        console.log('sd')
                        return <ImageRow key={index} images={row} ref={lastRowRef} className={(imagesLeft) ? undefined : 'last-row' }/>;
                    }
                    else {
                        return <ImageRow key={index} images={row}/>;
                    }
                })}
            </div>
            <div>{loading && <span>Loading...</span>}</div>
        </>
    );
}

function spreadImages(images, imagesLeft) {
    let rows = [];
    let rowImages = [];
    let expectedRatio = 0;
    let lastId;

    //Змінювати якщо треба змінити максимальну ширину суми
    const screenRation = screen.width / screen.height;
    const maxRatio     = 11.42 * screenRation; // 80 / 7
    const minRatio     =  6.15 * screenRation; // 80 / 13
    images.map((image, index) => {

        //Можна замінити image.width на любий вираз
        expectedRatio += image.width / image.height;

        console.log(expectedRatio, image.id);

        if (expectedRatio <= maxRatio) {
            rowImages.push(image);
        }

        if ((!imagesLeft && (index + 1) === images.length) || expectedRatio >= minRatio) {
            rows.push(rowImages);

            rowImages = [];
            expectedRatio = 0;
            lastId = image.id - 1;
        }
    });
    return {rows, lastId};
}
