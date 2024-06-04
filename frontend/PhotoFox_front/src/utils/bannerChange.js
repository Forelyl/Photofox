export function setBackground () {
    let banner = document.getElementById('background')
    if (!banner) return;
    let width = screen.width;
    let height = screen.height;
    if (width / height >= 1.6) {
        banner.style.backgroundImage = "url('/logo_background.svg')";
        banner.style.backgroundSize = "160%"
        banner.style.backgroundPositionX = "-45vw";
    } else {                   
        banner.style.backgroundImage = "url('/logo_background1.svg')";
        banner.style.backgroundSize = "200%"
        banner.style.backgroundPositionX = "center";
    }
}