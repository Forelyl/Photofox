import { forwardRef } from "react";

const ImageRow = forwardRef(function ImageRow({ images, className= undefined}, ref) {
    return (
        <div ref={ref} className={className}>
            <Link>{images.map(image => <img src={image.path} key={image.id} id={image.id}/>)}</Link>
        </div>
    )
});

export default ImageRow;