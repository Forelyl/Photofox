import {forwardRef, useRef, useState} from "react";
import { Link } from "react-router-dom";
import FilterMenu from "./FilterMenu.jsx";
import DropdownMenu from "./DropdownMenu.jsx";
import "./NavBar.css";
import { getToken } from "../../utils/auth.js";
import {setIntendedDestination} from "../../utils/independentDestination.js";

const NavBar = forwardRef( function NavBar( {hideSearch = false,
                                                hideAdd = false, setFilters = undefined, setTags=undefined,
                                                setSearch = undefined}, ref ) {
    const token = getToken();
    const [openFilters, setOpenFilters] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(false);
    const inputRef = useRef();
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

    function handleSearch() {
        if (setSearch) setSearch(inputRef.current.value)
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
                        <img src='/NavBarElements/search_icon.svg' alt='search' onClick={handleSearch}/>
                        <input type='text' ref={inputRef}/>
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
            {!hideSearch && <FilterMenu onClose={handleOpenFilters} className={(openFilters)? 'opened' : undefined} passFilters={setFilters}
                                       passTags={setTags} isOpened={openFilters}/>}
            <DropdownMenu onClose={handleDropdown}  className={(openDropdown)? 'opened' : undefined} />
        </div>
    );
});


export default NavBar