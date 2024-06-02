import NavBar from "../../components/Menu/NavBar.jsx";
import './ErrorPage.css'
export default function ErrorPage() {
    return <>
        <NavBar hideSearch={true} hideAdd={true}/>
        <div className='text-images-info'>
            <div>
                An error occurred!<br/>Please return to homepage or try reload page.
            </div>
        </div>
    </>
}