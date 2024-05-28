import './AddPicture.css'
import NavBar from "../../components/Menu/NavBar.jsx";
import { useState } from "react";

export default function AddPicture() {
    return (
        <>
            <NavBar hideAdd={true} hideSearch={true}/>
            <div>
                <div>
                    <input type="file" accept="image/*" name='image'/>
                    <div>
                        <input type="checkbox" name='download-permission' id='download-permission'/>
                        <label htmlFor='download-permission'>Allow downloading</label>
                    </div>
                </div>
                <div>

                </div>
            </div>
        </>
    );
}