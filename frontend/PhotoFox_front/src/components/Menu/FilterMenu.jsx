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
            passFilters(old_filter => old_filter.secondary_filter = [currentSize, currentDate, currentLike, imageForm]);
            passTags(tags);
        }
        setChanges(false);
        onClose();
    }

    return (
        <div id='filters-menu' className={className}>
            <h3>Filters</h3>
            <div id='filters'>
                <div id='left'>
                    <button onClick={() => handleImageFormChange('proportionH')}>
                        <div></div>
                    </button>
                    <button onClick={() => handleImageFormChange('proportionV')}>
                        <div></div>
                    </button>
                    <button onClick={() => handleImageFormChange('proportionS')}>
                        <div></div>
                    </button>
                    <button onClick={() => handleImageFormChange(null)}>
                        <div>any</div>
                    </button>
                </div>
                <Tags isOpened={isOpened} setTags={setTags}></Tags>
                <div id='right'>
                    <div>
                        <button onClick={() => handleDateChange(-1)}>
                            <img src='/NavBarElements/change_filter.svg' alt='change back'/>
                        </button>
                        <span>By date {currentDateTitle}</span>
                        <button onClick={() => handleDateChange(1)}>
                            <img src='/NavBarElements/change_filter.svg' alt='change forvard'/>
                        </button>
                    </div>
                    <div>
                        <button onClick={() => handleLikeChange(-1)}>
                            <img src='/NavBarElements/change_filter.svg' alt='change back'/>
                        </button>
                        <span>By likes {currentLikeTitle}</span>
                        <button onClick={() => handleLikeChange(1)}>
                            <img src='/NavBarElements/change_filter.svg' alt='change forvard'/>
                        </button>
                    </div>
                    <div>
                        <button onClick={() => handleSizeChange(-1)}>
                            <img src='/NavBarElements/change_filter.svg' alt='change back'/>
                        </button>
                        <span>By size {currentSizeTitle}</span>
                        <button onClick={() => handleSizeChange(1)}>
                            <img src='/NavBarElements/change_filter.svg' alt='change forvard'/>
                        </button>
                    </div>
                </div>
            </div>
            <button onClick={handleClose}>
                <img src={(!changes) ? '/NavBarElements/close_filters.svg' : '/NavBarElements/submit_filters.svg'} alt='Close filters'/>
            </button>
        </div>
    );
}