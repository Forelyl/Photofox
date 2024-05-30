import {useState} from "react";
import Tags from "./Tags.jsx";
import useFilterRoulette from "../../utils/useFilterRoulette.js";
import './FilterMenu.css'

export default function FilterMenu({onClose, sets, isOpened, className}) {
    const [ currentLikeKey, setCurrentLikeKey ] = useState([0, null, 'default']);
    const [ currentSizeKey, setCurrentSizeKey ] = useState([0, null, 'default']);
    const [ currentDateKey, setCurrentDateKey ] = useState([0, 'new', 'new']);
    const [imageForm, setImageForm] = useState(null);
    const [tags, setTags] = useState([]);

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
        currentDateKey, setCurrentDateKey);

    function handleImageFormChange (value) {
        setImageForm(value);
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
                        <button onClick={() => setDate(-1)}>
                            <img src='/NavBarElements/change_filter.svg' alt='change back'/>
                        </button>
                        <span>By date {currentDateTitle}</span>
                        <button onClick={() => setDate(1)}>
                            <img src='/NavBarElements/change_filter.svg' alt='change forvard'/>
                        </button>
                    </div>
                    <div>
                        <button onClick={() => setLikes(-1)}>
                            <img src='/NavBarElements/change_filter.svg' alt='change back'/>
                        </button>
                        <span>By likes {currentLikeTitle}</span>
                        <button onClick={() => setLikes(1)}>
                            <img src='/NavBarElements/change_filter.svg' alt='change forvard'/>
                        </button>
                    </div>
                    <div>
                        <button onClick={() => setSize(-1)}>
                            <img src='/NavBarElements/change_filter.svg' alt='change back'/>
                        </button>
                        <span>By size {currentSizeTitle}</span>
                        <button onClick={() => setSize(1)}>
                            <img src='/NavBarElements/change_filter.svg' alt='change forvard'/>
                        </button>
                    </div>
                </div>
            </div>
            <button onClick={onClose}>
                <img src='/NavBarElements/close_filters.svg' alt='Close filters'/>
            </button>
        </div>
    );
}