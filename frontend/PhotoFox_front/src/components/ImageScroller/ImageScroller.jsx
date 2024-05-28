import {useState, useRef, useCallback} from "react";
import useImageLoad from "../../utils/useImageLoad.js";
import ImageRow from "./ImageRow.jsx";
import './ImageScroller.css';

export default function ImageScroller() {
    const [lastImage, setLastImage] = useState(-1);
    const [filters, setFilters] = useState([]);

    const {images, imagesLeft, loading, error} = useImageLoad(lastImage, filters);

    const {rows, lastId} = spreadImages(images, imagesLeft);

    const lastRow = useRef();
    const lastRowRef = useCallback(node => {
        //console.log(node);
        //console.log(loading)
        if (loading) { return; }
        if (lastRow.current) { lastRow.current.disconnect(); }

        lastRow.current = new IntersectionObserver(entries => {
            //console.log(imagesLeft, 'imagesLeft')
            //console.log(entries[0], "intersecting");
            if (entries[0].isIntersecting && imagesLeft) {
                // console.log('last id in intersect =', lastId);
                console.log("see you");
                setLastImage(lastId);
            }
        }, {
            threshold: 0.5,
        })
        if (node) { lastRow.current.observe(node); console.log('wtf')};
    }, [loading, imagesLeft]);



    //console.log(rows.length, "num of rows")
    //console.log(lastId)
    return (
        <>
            {(rows.length !== 0) ? <div className="images-container">
                {rows.map((row, index) => {
                    if (index + 1 === rows.length) {
                        //console.log('sd')
                        //return <div ref={lastRowRef} key={index} className={(imagesLeft) ? 'row' : 'last-row'}>sdfdsf</div>
                        return <ImageRow key={index} images={row} ref={lastRowRef} className={(imagesLeft) ? 'row' : 'last-row' }/>;
                    }
                    else {
                        return <ImageRow key={index} images={row}/>;
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
    const maxRatio     = 11.42 * screenRation; // 80 / 7
    const minRatio     =  6.15 * screenRation; // 80 / 13
    images.map((image, index) => {

        //Можна замінити image.width на любий вираз
        expectedRatio += image.width / image.height;

        //console.log(expectedWidth, image.id);

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
    //console.log(rows)
    //console.log(lastId)
    return {rows, lastId};
}
