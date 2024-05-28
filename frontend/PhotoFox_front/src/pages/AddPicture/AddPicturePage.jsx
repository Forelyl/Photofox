import './AddPicture.css'
import NavBar from "../../components/Menu/NavBar.jsx";
import { useState } from "react";
import {Form, Link, redirect} from "react-router-dom";
import {clearIntendedDestination} from "../../utils/independentDestination.js";

export default function AddPicturePage() {
    const [tags, setTags] = useState([]);
    clearIntendedDestination();
    function handleAddTagClick() {
        console.log();
        setTags(oldTags => [...oldTags,])
    }


    return (
        <div id='add'>
            <NavBar hideAdd={true} hideSearch={true}/>
            <Form method={"POST"}>
                <div>
                    <input type="file" accept="image/*" name='image' required/>
                    <div>
                        <input type="checkbox" name='download_permission' id='download-permission'/>
                        <label htmlFor='download-permission'>Allow downloading</label>
                    </div>
                </div>
                <div>
                    <input type='text' placeholder={'Title...'} name='title' required></input>
                    <div id='tags'>
                        <button type='button' onClick={handleAddTagClick}>+</button>
                    </div>
                    <textarea placeholder='Add description' name='description'></textarea>
                    <div id='navigate'>
                        <Link to='/'>Cancel</Link>
                        <button type='submit'>Publish</button>
                    </div>
                </div>
            </Form>
        </div>
    );
}

export async function action({request}) {
    const data = await request.formData();
    const image = data.get('image');
    const width = image.width;
    const height = image.height;

    const headers = {
        'Content-Type': 'multipart/form-data',
        'width': width,
        'height': height
    }
    const response = await fetch('http://127.0.0.1:3000/image', {
        method: 'POST',
        headers: JSON.stringify(headers),
        body: data
    })
    return redirect('/');
}