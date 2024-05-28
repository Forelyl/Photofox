import {useState, useRef, useCallback} from "react";
import useImageLoad from "../../utils/useImageLoad.js";
import ImageRow from "./ImageRow.jsx";
import './ImageScroller.css';

export default function ImageScroller() {
    const renderCount = useRef(0);
    renderCount.current += 1;
    console.log('Render count:', renderCount.current);


    const [lastImage, setLastImage] = useState(-1);
    const [filters, setFilters] = useState([]);

    const {images, imagesLeft, loading, error} = useImageLoad(lastImage, filters);

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
        if (node) { lastRow.current.observe(node); console.log('wtf')};
    }, [loading, imagesLeft]);


    return (
        <>
            {(rows.length !== 0) ? <div className="images-container">
                {rows.map((row, index) => {
                    if (index + 1 === rows.length) {
                        return <ImageRow key={index} images={row} ref={lastRowRef} className={(imagesLeft) ? 'row' : 'row last-row' }/>;
                    }
                    else {
                        return <ImageRow key={index} images={row} className='row'/>;
                    }
                })}
            </div> : 
            <div className='text-images-info'><div>No images were found</div></div>
            }
            {loading && <div className='text-images-info'><div>Loading...</div></div>}
        </>
    );
}

function spreadImages(images, imagesLeft) {
    let rows = [];
    let rowImages = [];
    let expectedRatio = 0;
    let lastId = -1;

    //Змінювати якщо треба змінити максимальну ширину суми
    const screenRation = screen.width / screen.height;
    const maxRatio     = 80 / 45 * screenRation; // 80 / 45
    const minRatio     = 80 / 55 * screenRation; // 80 / 55
    images.map((image, index) => {

        //Можна замінити image.width на любий вираз
        expectedRatio += image.width / image.height;

        if (expectedRatio <= maxRatio) {
            rowImages.push(image);
            console.log(image.id, 'row');
        }

        if ((!imagesLeft && (index + 1) === images.length) || expectedRatio >= minRatio) {
            rows.push(rowImages);
            console.log(expectedRatio >= minRatio, 'ration')
            console.log((index + 1) === images.length, 'place')
            console.log(image.id, 'row fineshed');
            rowImages = [];
            expectedRatio = 0;
            lastId = image.id;
        }
    });
    return {rows, lastId};
}
