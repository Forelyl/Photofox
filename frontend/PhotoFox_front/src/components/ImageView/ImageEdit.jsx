import {getToken, testAuthor} from "../../utils/auth.js";
import {useParams, useNavigate, Form} from "react-router-dom";
import useImageLoad from "../../hooks/useImageLoad.js";
import './ImageFrame.css'
import CustomLikeButton from "../CustomButtons/CustomLikeButton.jsx";
import CustomShareButton from "../CustomButtons/CustomShareButton.jsx";
import Tags from "../Menu/Tags.jsx";
import {useState} from "react";



export default function ImageEdit() {
    const { pictureId} = useParams();

    const [loading, setLoading] = useState(true);
    const [editTitle, setEditTitle] = useState(false);
    const [editDescription, setEditDescription] = useState(false);
    const { error, imageParams} = useImageLoad(pictureId, setLoading);
    const { authorLogin, path, title, commentCounter, likeCounter, description, tags, liked} = imageParams;

    const navigate = useNavigate();
    const isAuthor = testAuthor(authorLogin);

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
        const data = e.target.parentElement.parentElement.children[0].value;
        const response = await fetch(`${import.meta.env.VITE_API_URL}/image/title`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': getToken(),
            },
            body: data
        });
        const values = await response.json();
        console.log(values)
        setEditTitle(false);
    }

    function handleEditDescription() {
        setEditTitle(state => !state);
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
                    <input name='new_title' defaultValue={title} disabled={!editTitle}/>
                    {(!editTitle) ?
                        <button onClick={() => { setEditTitle(true) }}>
                            <img src='/edit.svg' alt='edit title'/>
                        </button>
                        :
                        <button onClick={(event) => submitTitleChange(event)}>
                            <img src='/NavBarElements/submit_filters.svg' alt='submit new title'/>
                        </button>
                    }
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
                        <textarea disabled={!editDescription} defaultValue={description} />
                        <button onClick={handleEditDescription} >
                            <img src={(!editDescription) ? '/edit.svg' : '/NavBarElements/submit_filters.svg'}
                                 alt={(!editDescription) ? 'edit description' : 'submit new description'}/>
                        </button>
                    </div>
                    <Tags tags={tags}/>
                </div>
            </div>}
            {error && <div>An error occurred when requesting the server!<br/>Please reload page</div>}
        </>
    )
}
