import './AddPicture.css'
import NavBar from "../../components/Menu/NavBar.jsx";
import { useState } from "react";
import {Form, Link, redirect, useActionData} from "react-router-dom";
import {clearIntendedDestination} from "../../utils/independentDestination.js";
import { getToken } from '../../utils/auth.js';

export default function AddPicturePage() {
    // const [tags, setTags] = useState([]);
    clearIntendedDestination();
    // function handleAddTagClick() {
    //     console.log();
    //     setTags(oldTags => [...oldTags,])
    // }
    const errordata = useActionData();
    console.log(errordata);


    return (
        <div id='add'>
            <NavBar hideAdd={true} hideSearch={true}/>
            <Form method={"POST"} id='add-form'>
                <div id='left'>
                    <label htmlFor='image' id='image-wrapper'>
                        <input type="file" accept="image/*" name='image' id='image' required/>
                        <img src='/AddImage/File.svg' alt='add image' id='image-preview'/>
                    </label>
                    <label htmlFor='download-permission' className='checkbox-container'> 
                        <input type="checkbox" name='download_permission' id='download-permission' className='checkbox'/>
                        <div className='checkbox-mark'></div>
                        Allow downloading
                    </label>
                </div>
                <div id='right'>
                    <div id='title-wrapper'>
                        <input type='text' placeholder={'Title...'} name='title' maxLength="100" minLength="1" required></input>
                        <div><span>0</span>/100</div>
                    </div>
                    <div id='tags'>
                        <button type='button'>+</button>
                    </div>
                    <div id='description-wrapper'>
                        <textarea placeholder='Add description' name='description' maxLength="500"></textarea>
                        <div><span>0</span>/500</div>
                        {/* <button type='button' onClick={handleAddTagClick}>+</button> */}
                        <button type='button'>+</button>
                    </div>
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
    const file = document.getElementById('image').files[0];

    const reader = new FileReader();
    let width;
    let height;

    // Set up a callback for when the file is read
    reader.onload = function(e) {
        // Create a new Image object
        const img = new Image();
    
        // Set up a callback for when the image is loaded
        img.onload = function() {
            width  = img.width;
            height = img.height;
            // console.log('Image loaded:', img);
            console.log('Width:', width);
            console.log('Height:', height);
            console.log(img.scr);
        };
        // Set the source of the Image object to the data URL
        img.src = e.target.result;
    };
    
    // Read the file as a data URL
    reader.readAsDataURL(file);
    console.log(getToken());

    console.log('Width:', width);
    console.log('Height:', height);

    const headers = {
        // 'Content-Type': 'multipart/form-data',
        'Authorization': getToken(),
        'width': width,
        'height': height
    }
    console.log(headers)
    const response = await fetch('http://127.0.0.1:3000/image', {
        method: 'POST',
        headers: headers,
        body: data
    })
    if (!response.ok) {
        return response;
    }
    return redirect('/');
}