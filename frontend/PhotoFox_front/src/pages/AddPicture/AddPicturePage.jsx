import './AddPicture.css'
import NavBar from "../../components/Menu/NavBar.jsx";
import { useState } from "react";
import {Form, Link, redirect, useNavigation} from "react-router-dom";
import {clearIntendedDestination} from "../../utils/independentDestination.js";
import { getToken } from '../../utils/auth.js';
import Tags from "../../components/Menu/Tags.jsx";

export default function AddPicturePage() {
    const [input, setInput] = useState('/AddImage/File.svg');
    const [dimensions, setDimensions] = useState({width: 300, height: 300});
    const [imageDownloadable, setImageDownloadable] = useState(undefined);
    const [submitting, setSubmitting] = useState(false);
    const [tags, setTags] = useState([]);
    clearIntendedDestination();

    function handleImageUpload(e) {
        const file = e.target.files[0];

        if (!file) {
            setInput(oldValue => oldValue);
            return;
        }

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

    function handleDescrionInput(e) {
        document.getElementById('description-length').innerHTML = e.target.value.length;
    }

    async function handleOnSubmit(e) {
        e.preventDefault();
        setSubmitting(true);
        const data = new FormData(e.target);

        const headers = {
            'Authorization': getToken(),
            'width': data.get('width'),
            'height': data.get('height')
        }

        data.delete('width');
        setTimeout(() => {data.delete('height');}, 3000);

        const response = await fetch(`${import.meta.env.VITE_API_URL}/image`, {
            method: 'POST',
            headers: headers,
            body: data
        })

        setSubmitting(false);
        if (!response.ok) {
            return response;
        }
        return redirect('/');
    }

    function hangleCheckBoxChanged(e) {
        setImageDownloadable((imageDownloadable === "downloadable") ? undefined : "downloadable");
    }
    // TODO: update input sizing when image is been inserted (on horizontal change label sizing to horizontal and so on)
    return (
        <div id='add'>
            <NavBar hideAdd={true} hideSearch={true}/>
            <Form method={"POST"} id='add-form' onSubmit={handleOnSubmit}>
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
                        <input type='text' placeholder={'Enter title'} name='title' maxLength="100" minLength="1" required></input>
                    </div>
                    <Tags setTags={setTags}/>
                    <div id='description-wrapper'>
                        <textarea placeholder='Add description' name='description' maxLength="500" onInput={handleDescrionInput}></textarea>
                        <div><span id='description-length'>0</span>/500</div>
                    </div>
                    <div id='navigate'>
                        <Link to='/'>Cancel</Link>
                        <hr />
                        <button type='submit' disabled={submitting}>{submitting ? "Publishing...": "Publish"}</button>
                    </div>
                </div>
            </Form>
        </div>
    );
}