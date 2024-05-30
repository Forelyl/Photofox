import {useEffect, useState} from "react";
import useTagsLoad from "../../hooks/useTagsLoad.js";


export default function Tags( { select = true, isOpened = false, setTags} ) {

    const [allTags, setAllTags] = useState([])

    useEffect(() => {
        if (isOpened && select) {
            useTagsLoad(setAllTags);
        }
    }, [isOpened]);

    return (
        <div id='tags'>
            <div>fox</div>
            <div>cat</div>
            <button type='button'>+</button>
        </div>
    );
}
