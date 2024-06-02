import NavBar from "../../components/Menu/NavBar.jsx";
import './ErrorPage.css'
import {useRouteError} from "react-router-dom";

export default function ErrorPage() {
    const error = useRouteError();
    console.log(error)
    return <>
        <NavBar hideSearch={true} hideAdd={true}/>
        <div className='text-images-info'>
            <div>
                {error.message ?? "An error occurred!"}<br/>Please return to homepage or try reload page.
            </div>
        </div>
    </>
}