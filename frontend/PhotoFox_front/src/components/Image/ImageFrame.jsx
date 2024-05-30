import {testAuthor} from "../../utils/auth.js";
import Tags from "../Menu/Tags.jsx";


export default function ImageFrame() {
    let likeCounter
    let commentCounter
    let title = "sdfsd"
    let userName
    let subscribed
    //const isAuthor = testAuthor();



    function handleSubscribeClick() {

    }

    function handleLikeClick() {

    }

    return (
        <div id='image-frame'>
            <div id='top'>
                <div id='left'>

                </div>
                <div id='center'>

                </div>
                <div id='right'>

                </div>
            </div>
            <div id='bottom'>
                <div>
                    <div>
                        {/*<img src={} alt='user icon'/>*/}
                        <span>{title}</span>
                        <span>by {userName}</span>
                    </div>
                    <button onClick={handleSubscribeClick}>
                        {!subscribed ? 'Subscribe' : 'Unsubscribe'}
                    </button>
                    <button>
                        <img src='/ImageModuleIcons/report_button.svg' alt='report button'/>
                        <span>Report</span>
                    </button>
                </div>
                <div>
                    <div>
                        <button onClick={handleLikeClick}>
                            <img src='/DropdownElements/like.svg' alt='like button'/>
                        </button>
                        <span>{likeCounter} likes</span>
                    </div>
                    <div>
                        <button onClick={handleLikeClick}>
                            <img src='/ImageModuleIcons/comment_icon.svg' alt='comment button'/>
                        </button>
                        <span>{(commentCounter > 0) ? commentCounter : 'No'} comments</span>
                    </div>
                    <div>
                        <button onClick={handleLikeClick}>

                        </button>
                        <span>{likeCounter} likes</span>
                    </div>
                    <div>
                        <button onClick={handleLikeClick}>

                        </button>
                        <span>{likeCounter} likes</span>
                    </div>


                </div>
                <div></div>
                <Tags select={false}/>
            </div>
        </div>
    )
}