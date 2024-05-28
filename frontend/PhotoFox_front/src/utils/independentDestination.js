
export function setIntendedDestination (destination){
    localStorage.setItem('intended_destination', destination);
}

export function getIntendedDestination() {
    return localStorage.getItem('intended_destination') || '/';
}

export function clearIntendedDestination() {
    localStorage.removeItem('intended_destination');
}