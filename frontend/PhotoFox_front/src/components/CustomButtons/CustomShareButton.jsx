import {useState} from "react";


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
            {showPopup && (<div><span>Link copied</span></div>)}
            <button onClick={handleShareClick}>
                <img src='/ImageModuleIcons/share.svg' alt='share button'/>
                <span>Share</span>
            </button>
        </div>
    );
}