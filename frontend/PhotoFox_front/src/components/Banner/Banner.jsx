import './Banner.css'
import { setBackground } from "../../utils/bannerChange.js";
import { useEffect } from "react";

export default function Banner() {
    useEffect(() => {
        setBackground();
        function handleResize() {
            setBackground();
        }
        window.addEventListener('resize', handleResize)
    }
);

    return (
        <div id='banner'>
            <div id='background'></div>
            <div id='image'>
                <img src='/site_logo_text.svg' alt='site logo'/>
            </div>
            <a>
                <svg viewBox="0 0 1565 1489" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="923.687" height="923.687"
                          transform="matrix(0.844503 0.535551 -0.844503 0.535551 784.943 498.889)" fill="#D9D9D9"/>
                    <rect width="923.687" height="923.687"
                          transform="matrix(0.844503 0.535551 -0.844503 0.535551 780.057 401.617)" fill="#062551"/>
                </svg>
                <svg viewBox="0 0 1565 1489" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="923.687" height="923.687"
                          transform="matrix(0.844503 0.535551 -0.844503 0.535551 784.943 97.3418)" fill="#D9D9D9"/>
                    <rect width="923.687" height="923.687"
                          transform="matrix(0.844503 0.535551 -0.844503 0.535551 780.057 0.0703125)" fill="#062551"/>
                </svg>
            </a>
        </div>
    );
}