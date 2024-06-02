/*_*/
import {useState, useRef, useCallback} from "react";
import useImageScrollLoad from "../../hooks/useImageScrollLoad.js";
import ImageRow from "./ImageRow.jsx";
import './ImageScroller.css';

export default function ImageScroller({ filters, tags, userSpecific = false }) {
    const [lastImage, setLastImage] = useState(-1);
    const {images, imagesLeft, loading, error} = useImageScrollLoad(lastImage, filters, tags, userSpecific);
    const {rows, lastId} = spreadImages(images, imagesLeft);
    const lastRow = useRef();
    const lastRowRef = useCallback(node => {
        if (loading) { return; }
        if (lastRow.current) { lastRow.current.disconnect(); }

        lastRow.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && imagesLeft) {
                setLastImage(lastId);
            }
        }, {
            threshold: 0.5,
        })
        if (node) lastRow.current.observe(node);
    }, [loading, imagesLeft]);


    return (
        <>
            {(rows.length !== 0) && <div className="images-container">
                {rows.map((row, index) => {
                    if (index + 1 === rows.length) {
                        return <ImageRow key={index} images={row} ref={lastRowRef} className={(imagesLeft) ? 'row' : 'row last-row' }/>;
                    }
                    else {
                        return <ImageRow key={index} images={row} className='row'/>;
                    }
                })}
            </div>
            }
            {(rows.length === 0 || !imagesLeft) && !error && ! loading && <div className='text-images-info'><div>No images were found</div></div>}
            {loading && !error && <div className='text-images-info'><div>Loading...</div></div>}
            {error && <div className='text-images-info'><div>An error occurred when requesting the server!<br/>Please reload page</div></div>}
        </>
    );
}

function spreadImages(images, imagesLeft) {
    let rows = [];
    let rowImages = [];
    let expectedRatio = 0;
    let lastId = -1;
    let amountInRow = 0;

    //Змінювати якщо треба змінити максимальну ширину суми
    const screenRation = screen.width / screen.height;
    const maxRatio     = 80 / 35 * screenRation; // 80 / 45
    const minRatio     = 80 / 45 * screenRation; // 80 / 55
    images.map((image, index) => {

        expectedRatio += image.width / image.height;

        if (expectedRatio <= maxRatio || amountInRow === 0) {
            rowImages.push(image);
            amountInRow++;
        }

        if ((!imagesLeft && (index + 1) === images.length) || expectedRatio >= minRatio) {
            rows.push(rowImages);
            rowImages = [];
            expectedRatio = 0;
            lastId = image.id;
        }
    });
    return {rows, lastId};
}
