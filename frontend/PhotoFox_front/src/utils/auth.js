import { redirect } from "react-router-dom";

export function getToken() {
    const token = localStorage.getItem("token");

    if (!token) {
        return null;
    }
    else return token;
}

export function tokenLoader() {
    const token = getToken();
    return token;
}

export function loaderCheckToken() {
    const token = getToken();
    console.log(token);
    if (!token) {
        return redirect('/sign?mode=in');
    } else {
        return null;
    }
}