import { redirect } from "react-router-dom";

export function getToken() {
    const token = localStorage.getItem("token");

    if (!token) {
        return null;
    }
    else return token;
}

export function loaderCheckToken() {
    const token = getToken();
    if (!token) {
        return redirect('/sign?mode=in');
    } else {
        return null;
    }
}

export function getLogin() {
    const login = localStorage.getItem("login");

    if (!login) {
        return null;
    }
    else return login;
}