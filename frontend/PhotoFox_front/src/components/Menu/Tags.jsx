import {useEffect, useState} from "react";
import useTagsLoad from "../../utils/useTagsLoad.js";


export default function Tags( { select = true, isOpened = false, setTags} ) {

    useEffect(() => {
        if (isOpened && select) {
            useTagsLoad(setTags);
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
