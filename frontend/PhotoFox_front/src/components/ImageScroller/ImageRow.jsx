import { forwardRef } from "react";

const ImageRow = forwardRef(function ImageRow({ images, className= undefined}, ref) {
    return (
        <div ref={ref} className={className}>
            {images.map(image => <Link to={`/picture/${image.id}`}><img src={image.path} key={image.id} id={image.id}/></Link>)}
        </div>
    )
});

export default ImageRow;