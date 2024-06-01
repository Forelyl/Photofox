import {useState} from "react";
import './CustomShareButton.css'

export default function CustomShareButton({ pictureId }) {
    const [showPopup, setShowPopup] = useState(false);

    function handleShareClick() {
        navigator.clipboard.writeText(`https://photofox.pp.ua/picture/${pictureId}`)
        .then(() => {
            setShowPopup(true);
            setTimeout(() => { setShowPopup(false); }, 2500);
        })
        .catch((error) => {
            console.error('Failed to copy', error);
        });
    }
    return (
        <div>
            <button onClick={handleShareClick} className='customShareButton'>
                <img src='/ImageModuleIcons/share.svg' alt='share button'/>
                <span>{showPopup ?  "Link copied" : "Share"}</span>
            </button>
        </div>
    );
}