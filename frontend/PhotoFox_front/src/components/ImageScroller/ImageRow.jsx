import { forwardRef } from "react";

const ImageRow = forwardRef(function ImageRow({ images, className= undefined}, ref) {
    return (
        <div ref={ref} className={className}>
            {images.map(image => <img src={image.path} key={image.id}/>)}
        </div>
    )
});

export default ImageRow;