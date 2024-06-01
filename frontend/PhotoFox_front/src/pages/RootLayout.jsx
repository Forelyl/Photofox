import {Outlet} from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop.jsx";

export default function RootLayout() {
    return <>
        <ScrollToTop />
        <Outlet />
        </>;
}
