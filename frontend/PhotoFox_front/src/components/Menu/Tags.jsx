import {useEffect, useState} from "react";
import useTagsLoad from "../../utils/useTagsLoad.js";


export default function Tags( { select = true } ) {
    const [allTags, setAllTags] = useState()

    useTagsLoad(setAllTags);


    return (
        <div>

            <p>hello</p>
        </div>
    );
}

async function handleLoad() {

}