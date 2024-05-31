import {testAuthor} from "../../utils/auth.js";
import {useParams, Link} from "react-router-dom";
import useImageLoad from "../../hooks/useImageLoad.js";
import './ImageFrame.css'
import CustomLikeButton from "../Buttons/CustomLikeButton.jsx";
import CustomSubscribeButton from "../Buttons/CustomSubscribeButton.jsx";



export default function ImageFrame({ setLoading, loading }) {
    const { pictureId} = useParams();
    const { error, imageParams} = useImageLoad(pictureId, setLoading);
    const { authorId, authorLogin, authorPicture, path, title, commentCounter, likeCounter, description, tags, liked, subscribed, saved} = imageParams;

    const isAuthor = testAuthor(authorId, authorLogin);

    function handleCommentClick() {

    }

    function handleShareClick() {

    }

    function handleSaveClick() {

    }

    function handleEditClick() {

    }
    return (
        <>
            {!error && <div id='image-frame'>
                <div id='top'>
                    <div id='left'>
                        <Link to={`/picture/${parseInt(pictureId)-1}`} id='back'>
                            <img src='/ImageModuleIcons/move_back.svg' alt='move to next picture' />
                        </Link>
                    </div>
                    <div id='center'>
                        {loading ? (<div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>) :
                            (<img src={path} alt='picture'/>)
                        }
                    </div>
                    <div id='right'>
                        <button id='exit'></button>
                        <Link to={`/picture/${parseInt(pictureId) + 1}`} id='forvard'>
                            <img src='/ImageModuleIcons/move_forvard.svg' alt='move to previous picture'/>
                        </Link>
                    </div>
                </div>
                <div id='bottom'>
                    <div>
                        <div>
                            <img src={(authorPicture) ? authorPicture : '/NavBarElements/profile_icon.svg'} alt='user icon'/>
                            <span>{title}</span>
                            <span>by {authorLogin}</span>
                        </div>
                        <CustomSubscribeButton pictureId={pictureId} initialState={subscribed} authorId={authorId} isAuthor={isAuthor}/>
                        <button>
                            <img src='/ImageModuleIcons/report_button.svg' alt='report button'/>
                            <span>Report</span>
                        </button>
                    </div>
                    <div>
                        <CustomLikeButton pictureId={pictureId} initialState={liked} initialNumber={likeCounter} isAuthor={isAuthor}/>
                        <button onClick={handleCommentClick}>
                            <img src='/ImageModuleIcons/comment_icon.svg' alt='comment button'/>
                            <span>{(commentCounter > 0) ? commentCounter : 'No'} comments</span>
                        </button>
                        <button onClick={handleShareClick}>
                            <img src='/ImageModuleIcons/share.svg' alt='share button'/>
                            <span>Share</span>
                        </button>
                        <div>
                            {(!isAuthor) ?
                                (
                                    <button onClick={handleSaveClick}>
                                        <img src='/DropdownElements/saved.svg' alt='save button'/>
                                        <span>Save</span>
                                    </button>
                                ) :
                                (
                                    <Link to={`edit`} onClick={handleEditClick}>
                                        <img src='/edit.svg' alt='edit button'/>
                                        <span>Edit</span>
                                    </Link>
                                )
                            }
                        </div>
                    </div>
                    <div>
                        <p>{description}</p>
                    </div>
                    <div id='tags-box'>
                        {tags.map((oneTag, i) => {
                            return <div key={i}>{oneTag}</div>
                        })}
                    </div>
                </div>
            </div>}
            {loading && !error && <div><div>Loading...</div></div>}
            {error && <div>An error occurred when requesting the server!<br/>Please reload page</div>}
        </>
    )
}

