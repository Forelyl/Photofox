import {useState, useRef, useCallback} from "react";
import useImageLoad from "../../utils/useImageLoad.js";
import './test.css';

export default function ImageScroller() {
    const [lastImage, setLastImage] = useState(25);
    const [filters, setFilters] = useState([]);

    const lastRow = useRef();
    //const lastElement = useCallback();
    const {images, imagesLeft, loading} = useImageLoad(lastImage, filters);

    let rowImages = []

    return (
        <div >
            <div className="grid-container">
                {images.map((image) => <div className='grid-item' key={image.id}><img src={image.path}/></div>)}
            </div>
            <div>{loading && <span>Loading...</span>}</div>
        </div>
    );
}

