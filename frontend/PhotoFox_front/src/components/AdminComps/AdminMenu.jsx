import { useState } from "react";
import FilterMenu from "../Menu/FilterMenu.jsx";
import "../Menu/NavBar.css";
import { getToken } from "../../utils/auth.js";
import {action as logOut} from "../../utils/logout.js";
import {useNavigate} from "react-router-dom";

export default function AdminMenu({hideSearch = false, setFilters = undefined }) {
    const token = getToken();
    const [openFilters, setOpenFilters] = useState(false);
    const navigate = useNavigate();

    function handleOpenFilters() {
        setOpenFilters(openFilters => !openFilters);
    }

    return (
        <div id='menu-wrapper'>
            <menu id='menu'>
                <div id='left'>
                    <img src='/NavBarElements/site_logo.svg' alt='logo' />
                    <h1>PhotoFox admin</h1>
                </div>
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
                    <button onClick={() => logOut(null, navigate)}>
                        <img src='/DropdownElements/log_out.svg' alt='Log out'/>
                        <span>Log out</span>
                    </button>
                </div>
            </menu>
            <FilterMenu onClose={handleOpenFilters} className={(openFilters) ? 'opened' : undefined}
                                        passFilters={setFilters} isOpened={openFilters}/>
        </div>
    );
}
