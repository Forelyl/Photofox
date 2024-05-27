import {Link, useNavigate, useRouteLoaderData} from "react-router-dom";
import { action as logOut } from '../../utils/logout.js'
import './DropdownMenu.css'

export default function DropdownMenu({ onClose, className }) {
    const token = useRouteLoaderData('root');
    const navigate = useNavigate();
    const name = "hi";
    return (
        <div id='dropdown-menu' className={className}>
            {!token && (
                <Link to='/sign?mode=in'>
                    <img src='/DropdownElements/log_in.svg' alt='Log in'/>
                    <span>Log in</span>
                </Link>
            )}
            {token && (
                <>
                    <Link to={`/${name}`}>
                        <img src='/DropdownElements/profile.svg' alt='Profile'/>
                        <span>Profile</span>
                    </Link>
                    <Link to={`/${name}/pictures/saved`}>
                        <img src='/DropdownElements/saved.svg' alt='Saved pictures'/>
                        <span>Saved</span>
                    </Link>
                    <Link to={`/${name}/pictures/published`}>
                        <img src='/DropdownElements/published.svg' alt='Published pictures'/>
                        <span>Published</span>
                    </Link>
                    <button onClick={() => logOut(onClose, navigate)}>
                        <img src='/DropdownElements/log_out.svg' alt='Log out'/>
                        <span>Log out</span>
                    </button>
                </>
            )}
            <hr/>
            <Link to='info?type=terms'>
                <img src='/DropdownElements/terms_of_service.svg' alt='Terms of service'/>
                <span>Terms of Service</span>
            </Link>
            <Link to='info?type=privacy'>
                <img src='/DropdownElements/privacy_policy.svg' alt='Privacy policy'/>
                <span>Privacy policy</span>
            </Link>
            <Link to='info?type=about'>
                <img src='/DropdownElements/about_us.svg' alt='About us'/>
                <span>About us</span>
            </Link>
        </div>
    );
}