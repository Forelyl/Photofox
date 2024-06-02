import {getToken, testAuthor} from "../../utils/auth.js";
import {useParams, useNavigate} from "react-router-dom";
import useImageLoad from "../../hooks/useImageLoad.js";
import CustomLikeButton from "../CustomButtons/CustomLikeButton.jsx";
import CustomShareButton from "../CustomButtons/CustomShareButton.jsx";
import Tags from "../Menu/Tags.jsx";
import {useEffect, useState} from "react";
import './ImageEdit.css'
import autosize from "autosize"


export default function ImageEdit() {
    const { pictureId} = useParams();

    const [loading, setLoading] = useState(true);
    const [editTitle, setEditTitle] = useState(false);
    const [editDescription, setEditDescription] = useState(false);
    const [titleIsEmpty, setTitleIsEmpty] = useState(false);
    const { error, imageParams} = useImageLoad(pictureId, setLoading);
    const { authorLogin, path, title, commentCounter, likeCounter, description, tags, liked} = imageParams;

    const navigate = useNavigate();
    const isAuthor = testAuthor(authorLogin);

    useEffect( ()=> {
        autosize(document.querySelectorAll('textarea'));
    }, [])

    function handleCommentClick() {

    }

    async function handleDelete() {
        await fetch(`${import.meta.env.VITE_API_URL}/image`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': getToken(),
                'image-id': pictureId
            }
        });
        return navigate('/', {replace: true});
    }


    function handleImageLoaded(e) {
        let image = e.target;
        image.classList.add('added');
        setTimeout(() => {
            e.target.parentElement.children[0].classList.remove('lds-ellipsis');
        }, 1010)
    }

    async function submitChange(e, type) {
        const data = e.target.parentElement.parentElement.children[2].children[0].value;
        
        if (type === 'title' && data.length === 0) {
            setTitleIsEmpty(true);
            setTimeout(() => setTitleIsEmpty(false), 2500);
            return;
        }
        
        console.log(data)
        const response = await fetch(`${import.meta.env.VITE_API_URL}/image/${type}?image_id=${pictureId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': getToken(),
            },
            body: JSON.stringify(data)
        });
        if (type === "title"){
            setEditTitle(false);
        }
        else {
            setEditDescription(false);
        }
    }

    return (
        <div id='image-edit'>
            {!error &&<>
                <div id='picture-section'>
                        <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                        <img src={path} alt='picture' onLoad={handleImageLoaded}/>
                        <button id='exit' onClick={()=>{navigate('/')}}>exit</button>
                </div>
                <div id='info-section'>
                    <div className='text-area-block'>
                        <span>Title</span>
                        <button onClick={(!editTitle) ? 
                            () => setEditTitle(true)
                            :
                            (event) => submitChange(event, "title")
                        }>
                            <img src={(!editTitle) ? '/edit_white.svg' : '/NavBarElements/submit_filters.svg'}
                                 alt={(!editTitle) ? 'edit title' : 'submit new title'} />
                        </button>
                        <div className='text-area-input'>
                            <textarea name='new_title' id='new-title' rows='2' defaultValue={title} disabled={!editTitle} maxLength={100}/>
                            <span hidden={!titleIsEmpty}>Can't be empty</span>
                        </div>
                    </div>

                    <div className='text-area-block'>
                        <span>Description</span>
                        <button onClick={
                            (!editDescription) ? () => setEditDescription(true)
                            :
                            (event) => submitChange(event, "description")
                        }>
                            <img src={(!editDescription) ? '/edit_white.svg' : '/NavBarElements/submit_filters.svg'}
                                 alt={(!editDescription) ? 'edit description' : 'submit new description'}/>
                        </button>
                        <div className='text-area-input'>
                            <textarea disabled={!editDescription} defaultValue={description} maxLength={500}/>
                        </div>
                    </div>

                    <div id='use-section'>
                        <CustomLikeButton pictureId={pictureId} initialState={liked} initialNumber={likeCounter}
                                          isAuthor={isAuthor} />
                        <button onClick={handleCommentClick} disabled>
                            <img src='/ImageModuleIcons/comment_icon.svg' alt='comment button'/>
                            <span>{(commentCounter > 0) ? commentCounter : 'No'} comments</span>
                        </button>
                        <CustomShareButton pictureId={pictureId }/>
                    </div>

                    <Tags tags={tags}/>
                </div>

                <button id='delete' onClick={handleDelete}>Delete post</button>
            </>}
            {error && <div>An error occurred when requesting the server!<br/>Please reload page</div>}
        </div>
    )
}
