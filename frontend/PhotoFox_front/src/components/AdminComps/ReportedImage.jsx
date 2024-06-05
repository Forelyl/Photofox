import Tags from "../Menu/Tags.jsx";
import {forwardRef} from "react";
import {getToken} from "../../utils/auth.js";
import './ReportedImage.css'

const ReportedImage = forwardRef(function ReportedImage({ imageData = {}, destroy = () => {} }, ref) {
    const {id, path, title, like_counter, comment_counter, report_counter, author_login, description, tags} = imageData;

    async function handleDeleteClick(){
        const response = await fetch(`${import.meta.env.VITE_API_URL}/image`, {
            method: "DELETE",
            headers: {
                'Authorization': getToken(),
                'image-id': id
            }
        })
        if (!response.ok) {
            return
        }
        destroy(prevItem => prevItem.filter(item => item.id !== id));
    }

    async function handleClearClick(){
        const response = await fetch(`${import.meta.env.VITE_API_URL}/complaint/image?image_id=${id}`, {
            method: "DELETE",
            headers: {
                'Authorization': getToken()
            }
        })
        if (!response.ok) {
            return
        }
        destroy(prevItem => prevItem.filter(item => item.id !== id));
    }

    return (
        <div ref={ref} className="admin-component-reported-image">     
            <div id='image-part'>
                <img src={path} />
                <div id='info'>
                    <span>{like_counter} likes</span>
                    <span>{comment_counter} comments</span>
                    <span>{report_counter} reports</span>
                </div>
            </div>
            <div id='description'>
                <div id='head'>
                    <h3>{title}</h3>
                    <span>by {author_login}</span>
                </div>
                <p>{description}</p>
            </div>
            <Tags select={false}/>
            <div id='bottom'>
                <button id='delete' onClick={handleDeleteClick}>Delete post</button>
                <button id='clear' onClick={handleClearClick}>Remove reports</button>
            </div>
        </div>
    )
});

export default ReportedImage;