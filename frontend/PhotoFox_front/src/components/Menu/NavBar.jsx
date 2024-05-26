import { useState } from "react";
import { Link, useRouteLoaderData } from "react-router-dom";
import FilterMenu from "./FilterMenu.jsx";
import DropdownMenu from "./DropdownMenu.jsx";
import "./NavBar.css";


export default function NavBar() {
    const token = useRouteLoaderData('root');
    const [openFilters, setOpenFilters] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(false);
    const [profilePicture, setProfilePicture] = useState('/profile_icon');

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
                <Link to={'/'} id='left'>
                    <img src='/NavBarElements/site_logo.svg' alt='logo' />
                    <h1>PhotoFox</h1>
                </Link>
                <div id='right'>
                    <div id='search'>
                        <img src='/NavBarElements/search_icon.svg' alt='search' />
                        <input type='text' />
                        <button onClick={handleOpenFilters}>
                            <img src={(openFilters) ? '/NavBarElements/filter_opened.svg' : '/NavBarElements/filter_closed.svg'}
                                 alt={(openFilters) ? 'filter opened' : 'filter closed'}
                            />
                        </button>
                    </div>
                    <Link to={'/add-picture'}>
                        <img src='/NavBarElements/add_picture.svg' alt='Add new picture' />
                    </Link>
                    <button onClick={handleDropdownOpens}>
                        <img src={(!token) ? '/NavBarElements/login.svg' : '/NavBarElements/profile_icon'}
                             alt={(!token) ? 'Login' : 'Profile menu'} />
                    </button>
                </div>
            </menu>
            {openFilters && (
                <FilterMenu onClose={handleOpenFilters}/>
            )}
            {openDropdown && (
                <DropdownMenu onClose={handleDropdownOpens}/>
            )}
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>

            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>

            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            <p>asfasfasf assssssssssssssssssssssssssssssssssssssssssssss</p>
            
        </>
    );
}