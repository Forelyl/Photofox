import {useEffect, useState} from "react";
import useTagsLoad from "../../hooks/useTagsLoad.js";
import './Tags.css'

export default function Tags( { select = true, isOpened = false, setTags} ) {

    const [allTags, setAllTags] = useState([])

    useEffect(() => {
        if (isOpened && select) {
            // useTagsLoad(setAllTags);
        }
    }, [isOpened]);

    function deleteTag(tagId) {
        setAllTags(allTags.filter((oneTag, i) => { return i !== tagId; }));
    }

    function addTag() {
        if (allTags.length >= 4) return;

        let tagname = ["Cat", "Dog", "Rat", "Mouse"];
        let tagcolor = ["#FFD645", "#4558FF", "#54FF45", "#49B1E9"];

        tagname = tagname[Math.floor(Math.random() * 4)];
        tagcolor = tagcolor[Math.floor(Math.random() * 4)];

        setAllTags([...allTags, [tagname, tagcolor]]);
    }

    return (
        <div id='tags'>
            {allTags.map((oneTag, i) => {
                return <button 
                            key={i} 
                            style={{'--color': `${oneTag[1]}`}} 
                            type='button' 
                            onClick={() => {deleteTag(i);}} 
                            onMouseEnter={(e) => { e.target.innerHTML = '&#10005'; }}
                            onMouseLeave={(e) => { e.target.innerHTML = oneTag[0]; }}

                       >{oneTag[0]}</button>
            })}
            <button type='button' id='add-tag' onClick={() => {addTag();}} className={allTags.length >= 4 ? 'hide' : undefined}>+</button>
        </div>
    );
}
