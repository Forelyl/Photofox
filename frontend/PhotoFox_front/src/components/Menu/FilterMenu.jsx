import {useState} from "react";
import Tags from "./Tags.jsx";
import useFilterRoulette from "../../hooks/useFilterRoulette.js";
import './FilterMenu.css'

export default function FilterMenu({onClose, passFilters, passTags, isOpened, className}) {
    const [ currentLikeKey, setCurrentLikeKey ] = useState([0, null, 'default']);
    const [ currentSizeKey, setCurrentSizeKey ] = useState([0, null, 'default']);
    const [ currentDateKey, setCurrentDateKey ] = useState([0, 'new', 'new']);
    const [ changes, setChanges ] = useState(false);

    //Для повернення як фільтри
    const [ currentLike, currentLikeTitle, setLikes ] = useFilterRoulette(
        [null, 'like1k', 'like1k_10k', 'like10k'],
        ['default', '< 1k', ' > 1k and < 10k', ' > 10k'],
        currentLikeKey, setCurrentLikeKey
    );
    const [ currentSize, currentSizeTitle, setSize ] = useFilterRoulette(
        [null, 'sizeS', 'sizeM', 'sizeB'],
        ['default', 'small', 'medium', 'big'],
        currentSizeKey, setCurrentSizeKey
    );
    const [ currentDate, currentDateTitle, setDate ] = useFilterRoulette(
        ['new', 'old'],
        ['new', 'old'],
        currentDateKey, setCurrentDateKey
    );
    const [ imageForm, setImageForm ] = useState(null);
    const [ tags, setTags ] = useState([]);

    function handleImageFormChange (value) {
        setImageForm(value);
        if (!changes){
            setChanges(true);
        }
    }
    function handleDateChange (value) {
        setDate(value);
        if (!changes){
            setChanges(true);
        }
    }

    function handleLikeChange (value) {
        setLikes(value);
        if (!changes){
            setChanges(true);
        }
    }

    function handleSizeChange (value) {
        setSize(value);
        if (!changes){
            setChanges(true);
        }
    }

    function handleClose () {
        if (changes) {
            passFilters(old_filter => {
                console.log([currentSize, currentDate, currentLike, imageForm])
                return {
                    primaryFilter: old_filter.primaryFilter,
                    secondaryFilter: [currentSize, currentDate, currentLike, imageForm]
                }
            });
            passTags(tags);
        }
        setChanges(false);
        onClose();
    }

    return (
        <div id='filters-menu' className={className}>
            <div id='title'>
                <h3>Filters</h3>
                {changes && <button onClick={handleClose}>
                    <img src='/NavBarElements/submit_filters.svg'
                         alt='Accept filters'/>
                </button>}
            </div>
            <div id='filters'>
                <div id='left'>
                    <div id='buttons' className={(imageForm) ? imageForm : 'No'}>
                        <button id='H-button' onClick={() => handleImageFormChange('proportionH')}>
                            <div></div>
                        </button>
                        <button id='V-button' onClick={() => handleImageFormChange('proportionV')}>
                            <div></div>
                        </button>
                        <button id='S-button' onClick={() => handleImageFormChange('proportionS')}>
                            <div></div>
                        </button>
                        <button id='No-button' onClick={() => handleImageFormChange(null)}>
                            <div>any</div>
                        </button>
                    </div>
                    <div id='button-text'>Image form</div>
                </div>
                <div id='tags-filter'>
                    <Tags isOpened={isOpened} setTags={setTags}></Tags>
                </div>
                <div id='right'>
                    <div className="select-block">
                        <select name="date" id="date">
                            <option value="new">By date new</option>
                            <option value="old">By date old</option>
                        </select>
                    </div>
                    <div className="select-block">
                        <select name="likes" id="likes">
                            <option value={null}>By likes all</option>
                            <option value="like1k">{'likes < 1k'}</option>
                            <option value="like1k_10k">{'1k < likes < 10k'}</option>
                            <option value="like10k">{'likes > 10k'}</option>
                        </select>  
                    </div>
                    <div className="select-block">
                        <select name="size" id="size"> 
                            <option value={null}>All sizes</option>
                            <option value="sizeS">Small size</option>
                            <option value="sizeM">Medium size</option>
                            <option value="sizeB">Big size</option>
                        </select>  
                    </div>
                </div>
            </div>
            <button onClick={onClose}>
                <img src='/NavBarElements/close_filters.svg' alt='Close filters'/>
            </button>
        </div>
    );
}