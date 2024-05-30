import {Suspense, useEffect, useState} from "react";
import {Await, useLoaderData} from "react-router-dom";
import useTagsLoad from "../../utils/useTagsLoad.js";


export default function Tags( { select = true, isOpened = false} ) {
    const [tags, setTags] = useState([]);

    useEffect(() => {
        if (isOpened) {
            useTagsLoad(setTags);
        }
    }, [isOpened]);

    return (
        <div>
            <p>hello</p>
        </div>
    );
}
