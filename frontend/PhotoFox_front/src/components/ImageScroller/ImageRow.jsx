/*_*/
import { forwardRef } from "react";
import { Link } from "react-router-dom";

const ImageRow = forwardRef(function ImageRow({ images, className= undefined}, ref) {
    const mouseMove = (event) => {
        const a = event.target.parentElement;
        // console.log(a);
                
        if (!a) return;

        const rectangle = a.getBoundingClientRect();
        const r = Math.max(a.clientWidth, a.clientHeight) * 2;
        const r_sub = r / 2;
        const x = event.clientX - rectangle.left - r_sub;
        const y = event.clientY - rectangle.top - r_sub;

        a.style.setProperty('--x', `${x}px`);
        a.style.setProperty('--y', `${y}px`);
        a.style.setProperty('--r', `${r}px`);
    };
    
    
    return (
        <div ref={ref} className={className}>
            {images.map(image => 
                <Link to={`/picture/${image.id}`} key={image.id} >
                    <img 
                        src={image.path}
                        id={'image-' + image.id}
                        onMouseMove={(event) => mouseMove(event)}
                        style={{ '--x': '0px', '--y': '0px', '--r': '0px'}}
                    />
                    
                </Link>)
            }
        </div>
    )
});

export default ImageRow;