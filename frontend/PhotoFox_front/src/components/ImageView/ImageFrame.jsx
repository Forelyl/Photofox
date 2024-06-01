import {testAuthor} from "../../utils/auth.js";
import {useParams, Link, useNavigate} from "react-router-dom";
import useImageLoad from "../../hooks/useImageLoad.js";
import './ImageFrame.css'
import CustomLikeButton from "../CustomButtons/CustomLikeButton.jsx";
import CustomSubscribeButton from "../CustomButtons/CustomSubscribeButton.jsx";
import CustomSaveButton from "../CustomButtons/CustomSaveButton.jsx";
import CustomShareButton from "../CustomButtons/CustomShareButton.jsx";
import CustomReportButton from "../CustomButtons/CustomReportButton.jsx";



export default function ImageFrame({ setLoading, loading }) {
    const { pictureId} = useParams();
    const { error, imageParams} = useImageLoad(pictureId, setLoading);
    const { authorId, authorLogin, authorPicture, path, title, commentCounter, likeCounter, description, tags, liked, subscribed, saved} = imageParams;

    const navigate = useNavigate();
    const isAuthor = testAuthor(authorId, authorLogin);

    function handleCommentClick() {

    }

    function handleIconClick() {
        return navigate(`/${authorLogin}`);
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
                        <button id='exit' onClick={()=>{navigate('/')}}>exit</button>
                        <Link to={`/picture/${parseInt(pictureId) + 1}`} id='forvard'>
                            <img src='/ImageModuleIcons/move_forvard.svg' alt='move to previous picture'/>
                        </Link>
                    </div>
                </div>
                <div id='bottom'>
                    <div>
                        <div>
                            <img src={(authorPicture) ? authorPicture : '/NavBarElements/profile_icon.svg'} alt='user icon'
                            onClick={handleIconClick}/>
                            <span>{title}</span>
                            <span onClick={handleIconClick}>by {authorLogin}</span>
                        </div>
                        <CustomSubscribeButton pictureId={pictureId} initialState={subscribed} authorId={authorId} isAuthor={isAuthor}/>
                        <CustomReportButton id_for_report={pictureId} type={'image'}>Report</CustomReportButton>
                    </div>
                    <div>
                        <CustomLikeButton pictureId={pictureId} initialState={liked} initialNumber={likeCounter} isAuthor={isAuthor}/>
                        <button onClick={handleCommentClick}>
                            <img src='/ImageModuleIcons/comment_icon.svg' alt='comment button'/>
                            <span>{(commentCounter > 0) ? commentCounter : 'No'} comments</span>
                        </button>
                        <CustomShareButton pictureId={pictureId}/>
                        <div>
                            {(!isAuthor) ?
                                (
                                    <CustomSaveButton initialState={saved} pictureId={pictureId}/>
                                ) :
                                (
                                    <Link to={`edit`}>
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

