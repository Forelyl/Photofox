export function setBackground () {
    let width = screen.width;
    let height = screen.height;
    if (width / height >= 1.6) {
        document.getElementById('background').style.backgroundImage = "url('/public/logo_background.svg')";
        document.getElementById('background').style.backgroundSize = "160%"
        document.getElementById('background').style.backgroundPositionX = "-45vw";
    } else {                   
        document.getElementById('background').style.backgroundImage = "url('/public/logo_background1.svg')";
        document.getElementById('background').style.backgroundSize = "200%"
        document.getElementById('background').style.backgroundPositionX = "center";
    }
}