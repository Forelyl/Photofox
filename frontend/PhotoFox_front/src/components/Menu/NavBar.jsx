import {forwardRef, useState} from "react";
import { Link } from "react-router-dom";
import FilterMenu from "./FilterMenu.jsx";
import DropdownMenu from "./DropdownMenu.jsx";
import "./NavBar.css";
import { getToken } from "../../utils/auth.js";
import {setIntendedDestination} from "../../utils/independentDestination.js";

const NavBar = forwardRef( function NavBar( {hideSearch = false,
                                                hideAdd = false, sets = undefined}, ref ) {
    const token = getToken();
    const [openFilters, setOpenFilters] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(false);

    //TODO: якщо юзер залогінився виводити аву
    const [profilePicture, setProfilePicture] = useState('/NavBarElements/profile_icon.svg');

    const protectedDestination = '/add-picture';

    function handleOpenFilters() {
        setOpenFilters(openFilters => !openFilters);
        setOpenDropdown(false);
    }

    function handleDropdown() {
        setOpenDropdown(openDropdown => !openDropdown);
        setOpenFilters(false);
    }

    function handleAddImageRedirect(){
        setIntendedDestination(protectedDestination);
    }

    return (
        <div id='menu-wrapper' ref={ref}>
            <menu id='menu'>
                <Link to={'/'} id='left'>
                    <img src='/NavBarElements/site_logo.svg' alt='logo' />
                    <h1>PhotoFox</h1>
                </Link>
                <div id='right'>
                    {!hideSearch && (<div id='search'>
                        <img src='/NavBarElements/search_icon.svg' alt='search' />
                        <input type='text' />
                        <button onClick={handleOpenFilters}>
                            <img src={(openFilters) ? '/NavBarElements/filter_opened.svg' : '/NavBarElements/filter_closed.svg'}
                                 alt={(openFilters) ? 'filter opened' : 'filter closed'}
                            />
                        </button>
                    </div>)}
                    {!hideAdd && (<Link to={protectedDestination} onClick={handleAddImageRedirect}>
                        <img src='/NavBarElements/add_picture.svg' alt='Add new picture' />
                    </Link>)}
                    <button onClick={handleDropdown}>
                        <img src={(!token) ? '/NavBarElements/login.svg' : '/NavBarElements/profile_icon.svg'}
                             alt={(!token) ? 'Login' : 'Profile menu'} />
                    </button>
                </div>
            </menu>
            <FilterMenu onClose={handleOpenFilters} sets={sets}/>
            <DropdownMenu onClose={handleDropdown}  className={(openDropdown)? 'opened' : undefined} />
        </div>
    );
});


export default NavBar