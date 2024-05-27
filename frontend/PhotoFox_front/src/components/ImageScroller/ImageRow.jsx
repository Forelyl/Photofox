import { useState } from "react";

export default function ImageRow({ images, ref = null}) {
    return (
        <div ref={ref}>
            {images.map(image => <img src={image.path} key={image.id} />)}
        </div>
    )
}