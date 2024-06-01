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

    function handleImageLoaded(e) {
        let image = e.target;
        image.classList.add('added');
        setTimeout(() => {
            e.target.parentElement.children[0].classList.remove('lds-ellipsis');
        }, 1010)
    }

    return (
        <>
            {!error && <div id='image-frame'>
                <div id='picture-section'>
                    <div id='left'>
                        <Link to={`/picture/${parseInt(pictureId)-1}`} id='back'>
                            <svg viewBox="0 0 47 65" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M35.5259 55.483C35.5257 61.7415 43.9692 68 35.5257 61.7408L1.75281 32.5357C0.345594 31.4926 0.345594 31.492 1.75281 30.4495L35.5257 3.32889C43.9692 -2.92958 35.5257 3.32889 35.5257 9.58784C35.5257 13.7607 52.4126 3.32987 43.9692 9.5879L13.0105 31.4926L43.9692 55.4834C52.4127 61.7425 35.5259 51.3101 35.5259 55.483Z" fill="white"/>
                            </svg>
                        </Link>
                    </div>
                    <div id='center'>
                        <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                        <img src={path} alt='picture' onLoad={handleImageLoaded}/>
                    </div>
                    <div id='right'>
                        <button id='exit' onClick={()=>{navigate('/')}}>exit</button>
                        <Link to={`/picture/${parseInt(pictureId) + 1}`} id='forvard'>
                            <svg viewBox="0 0 46 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M10.8075 8.85055C10.8077 2.59205 2.36419 -3.6665 10.8077 2.59271L44.5806 31.7978C45.9878 32.8409 45.9878 32.8415 44.5806 33.884L10.8077 61.0046C2.36419 67.2631 10.8077 61.0046 10.8077 54.7457C10.8077 50.5728 -6.07919 61.0036 2.36421 54.7456L33.3229 32.8409L2.36421 8.85007C-6.0793 2.59102 10.8075 13.0233 10.8075 8.85055Z" fill="white"/>
                            </svg>
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
                        <CustomSubscribeButton intendedDestination={`/picture/${pictureId}`} initialState={subscribed} authorId={authorId} isAuthor={isAuthor}/>
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

