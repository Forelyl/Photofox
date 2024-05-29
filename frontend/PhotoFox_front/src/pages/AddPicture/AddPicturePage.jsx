import './AddPicture.css'
import NavBar from "../../components/Menu/NavBar.jsx";
import { useState } from "react";
import { Form, Link, redirect } from "react-router-dom";
import {clearIntendedDestination} from "../../utils/independentDestination.js";
import { getToken } from '../../utils/auth.js';

export default function AddPicturePage() {
    const [input, setInput] = useState('/AddImage/File.svg');
    const [imageDownloadable, setImageDownloadable] = useState(undefined);
    const [dimensions, setDimensions] = useState({})
    clearIntendedDestination();

    function handleImageUpload(e) {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = function(e) {
            const img = new Image();

            img.onload = function() {
                setDimensions({'width' : img.width, 'height' : img.height });
            };
            img.src = e.target.result;
            setInput(img.src);
        };

        reader.readAsDataURL(file);
    }

    function hangleCheckBoxChanged(e) {
        setImageDownloadable((imageDownloadable === "downloadable") ? undefined : "downloadable");
    }
    // TODO: update input sizing when image is been inserted (on horizontal change label sizing to horizontal and so on)
    return (
        <div id='add'>
            <NavBar hideAdd={true} hideSearch={true}/>
            <Form method={"POST"} id='add-form'>
                <div id='left'>
                    <label htmlFor='image' id='image-wrapper' className={imageDownloadable}>
                        <input type="file" accept="image/*" name='image' id='image' onChange={handleImageUpload} required/>
                        <img src={input} alt='add image' id='image-preview'/>
                    </label>
                    <input type='hidden' value={dimensions.width} name='width'/>
                    <input type='hidden' value={dimensions.height} name='height'/>
                    <label htmlFor='download-permission' className='checkbox-container'> 
                        <input type="checkbox" name='download_permission' id='download-permission' className='checkbox' onChange={hangleCheckBoxChanged}/>
                        <div className={`checkbox-mark ${imageDownloadable}`}></div>
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

    console.log('Width:', data.get('width'));
    console.log('Height:', data.get('height'));
    const headers = {
        // 'Content-Type': 'multipart/form-data',
        'Authorization': getToken(),
        'width': data.get('width'),
        'height': data.get('height')
    }
    data.delete('width');
    data.delete('height');
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