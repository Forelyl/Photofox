import { useState } from "react";
import { Link, useRouteLoaderData } from "react-router-dom";
import FilterMenu from "./FilterMenu.jsx";
import DropdownMenu from "./DropdownMenu.jsx";


export default function NavBar() {
    const token = useRouteLoaderData('root');
    const [openFilters, setOpenFilters] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(false);
    const [profilePicture, setProfilePicture] = useState('public/profile_icon');

    function handleOpenFilters() {
        setOpenFilters(openFilters => !openFilters);
        setOpenDropdown(false);
    }

    function handleDropdownOpens() {
        setOpenDropdown(openDropdown => !openDropdown);
        setOpenFilters(false);
    }

    return (
        <>
            <menu id='menu'>
                <Link to={'/'}>
                    <img src='public/site_logo.svg' alt='logo' />
                    <h1>PhotoFox</h1>
                </Link>
                <div id='search'>
                    <img src='public/search_icon.svg' alt='search' />
                    <input type='text' placeholder='Search...' />
                    <button onClick={handleOpenFilters}>
                        <img src={(openFilters) ? 'public/filter_opened.svg' : 'public/filter_closed.svg'}
                             alt={(openFilters) ? 'filter opened' : 'filter closed'}
                        />
                    </button>
                </div>
                <Link to={'/add-picture'}>
                    <img src='public/add_picture.svg' alt='Add new picture' />
                </Link>
                <button onClick={handleDropdownOpens}>
                    <img src={(!token) ? 'public/login.svg' : 'public/profile_icon'}
                         alt={(!token) ? 'Login' : 'Profile menu'} />
                </button>
            </menu>
            {openFilters && (
                <FilterMenu onClose={handleOpenFilters}/>
            )}
            {openDropdown && (
                <DropdownMenu onClose={handleDropdownOpens}/>
            )}
        </>
    );
}