import {testAuthor} from "../../utils/auth.js";
import {useParams, useNavigate, Form} from "react-router-dom";
import useImageLoad from "../../hooks/useImageLoad.js";
import './ImageFrame.css'
import CustomLikeButton from "../CustomButtons/CustomLikeButton.jsx";
import CustomShareButton from "../CustomButtons/CustomShareButton.jsx";
import Tags from "../Menu/Tags.jsx";
import {useState} from "react";



export default function ImageFrame({ setLoading, loading }) {
    const { pictureId} = useParams();
    const [editTitle, setEditTitle] = useState(false);
    const [editDescription, setEditDescription] = useState(false);
    const { error, imageParams} = useImageLoad(pictureId, setLoading);
    const { authorId, authorLogin, authorPicture, path, title, commentCounter, likeCounter, description, tags, liked, subscribed, saved} = imageParams;

    const navigate = useNavigate();

    function handleCommentClick() {

    }

    function handleImageLoaded(e) {
        let image = e.target;
        image.classList.add('added');
        setTimeout(() => {
            e.target.parentElement.children[0].classList.remove('lds-ellipsis');
        }, 1010)
    }

    async function submitTitleChange(e) {
        e.preventDefault();

        const data = new FormData(e.target);

        const response = await fetch(`${import.meta.env.VITE_API_URL}/image`, {
            method: 'POST',
            headers: headers,
            body: data
        });
    }
    function handleEditDescription(e) {

    }

    return (
        <>
            {!error && <div id='image-frame'>
                <div id='picture-section'>
                    <div id='center'>
                        <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                        <img src={path} alt='picture' onLoad={handleImageLoaded}/>
                    </div>
                </div>
                <div id='info-section'>
                    <Form onSubmit={submitTitleChange}>
                        <input defaultValue={title} disabled={!editDescription}/>
                        <button onClick={handleEditDescription} type={(!editDescription) ? 'button' : 'submit'}>Edit
                            <img src={(!editDescription) ? '/edit.svg' : '/NavBarElements/submit_filters.svg'}
                                 alt={(!editDescription) ? 'edit title' : 'submit new title'}/>
                        </button>
                    </Form>
                    <div>
                        <CustomLikeButton pictureId={pictureId} initialState={liked} initialNumber={likeCounter}
                                          isAuthor={isAuthor}/>
                        <button onClick={handleCommentClick}>
                            <img src='/ImageModuleIcons/comment_icon.svg' alt='comment button'/>
                            <span>{(commentCounter > 0) ? commentCounter : 'No'} comments</span>
                        </button>
                        <CustomShareButton pictureId={pictureId}/>
                    </div>
                    <div>
                        <textarea disabled={!editDescription}>{description}</textarea>
                        <button onClick={handleEditDescription} >
                            <img src={(!editDescription) ? '/edit.svg' : '/NavBarElements/submit_filters.svg'}
                                 alt={(!editDescription) ? 'edit description' : 'submit new description'}/>
                        </button>
                    </div>
                    <Tags />
                </div>
            </div>}
            {error && <div>An error occurred when requesting the server!<br/>Please reload page</div>}
        </>
    )
}
