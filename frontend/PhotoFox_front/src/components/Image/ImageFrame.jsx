import {testAuthor} from "../../utils/auth.js";
import Tags from "../Menu/Tags.jsx";
import {useParams} from "react-router-dom";
import useImageLoad from "../../hooks/useImageLoad.js";



export default function ImageFrame() {
    const { pictureId} = useParams();
    //console.log(pictureId);
    const { loading, error, imageParams} = useImageLoad(pictureId);
    const {
        authorId, authorLogin, authorPicture,
        path, title, commentCounter, likeCounter,
        description, tags, subscribed, liked
    } = imageParams;

    const isAuthor = testAuthor(authorId, authorLogin);



    function handleSubscribeClick() {

    }

    function handleLikeClick() {

    }

    return (
        <div id='image-frame'>
            <div id='top'>
                <div id='left'>
                    <button id='back'></button>
                </div>
                <div id='center'>
                    <img src={path} alt='picture'/>
                </div>
                <div id='right'>
                    <button id='back'></button>
                    <button id='back'></button>
                </div>
            </div>
            <div id='bottom'>
                <div>
                    <div>
                        <img src={
                            (authorPicture) ? authorPicture : '/NavBarElements/profile_icon.svg'
                        } alt='user icon'/>
                        <span>{title}</span>
                        <span>by {authorLogin}</span>
                    </div>

                    <button onClick={handleSubscribeClick} disabled={isAuthor}>
                        {!subscribed ? 'Subscribe' : 'Unsubscribe'}
                    </button>

                    <button>
                        <img src='/ImageModuleIcons/report_button.svg' alt='report button'/>
                        <span>Report</span>
                    </button>
                </div>
                <div>
                    <button onClick={handleLikeClick}>
                        <img src={(!liked) ? '/DropdownElements/like.svg' : '/ImageModuleIcons/like.svg'}
                             alt='like button'/>
                        <span>{likeCounter} likes</span>
                    </button>

                    <button onClick={handleLikeClick}>
                        <img src='/ImageModuleIcons/comment_icon.svg' alt='comment button'/>
                        <span>{(commentCounter > 0) ? commentCounter : 'No'} comments</span>
                    </button>

                    <button onClick={handleLikeClick}>
                        <img src='/ImageModuleIcons/share.svg' alt='share button'/>
                        <span>Share</span>
                    </button>
                    <div>
                        { (isAuthor) ?
                            (
                            <button onClick={handleLikeClick}>
                                <img src='/DropdownElements/saved.svg' alt='save button'/>
                                <span>Save</span>
                            </button>
                            ) :
                            (
                            <button onClick={handleLikeClick}>
                                <img src='/edit.svg' alt='edit button'/>
                                <span>{likeCounter} likes</span>
                            </button>
                            )
                        }

                    </div>


                </div>
                <div>
                    <p>description</p>
                </div>
                <Tags select={false}/>
            </div>
        </div>
    )
}

