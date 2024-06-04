import Tags from "../Menu/Tags.jsx";
import {forwardRef} from "react";

const ReportedImage = forwardRef(function ReportedImage({ imageData = {} }, ref) {
    const {id, path, title, like_counter, comment_counter, report_counter, author_login, description, tags} = imageData;

    return (
        <div ref={ref}>
            <img src={path} />
            <div id='description'>
                <div id='head'>
                    <h3>{title}</h3>
                    <span>by {author_login}</span>
                </div>
                <p>{description}</p>
            </div>
            <div id='info'>
                <span>{like_counter} likes</span>
                <span>{comment_counter} comments</span>
                <span>{report_counter} reports</span>
            </div>
            <Tags select={false}/>
            <button id='delete'>Delete post</button>
            <button id='clear'>Remove reports</button>
        </div>
    )
});

export default ReportedImage;