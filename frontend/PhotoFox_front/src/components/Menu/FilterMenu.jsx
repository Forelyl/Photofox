import {useState} from "react";
import Tags from "./Tags.jsx";
import useFilterRoulette from "../../utils/useFilterRoulette.js";

export default function FilterMenu({onClose, sets}) {
    const [ currentLikeKey, setCurrentLikeKey ] = useState([0, null, 'default']);
    const [ currentSizeKey, setCurrentSizeKey ] = useState([0, null, 'default']);
    const [ currentDateKey, setCurrentDateKey ] = useState([0, 'new', 'new']);

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

    return (
        <div>
            <h3>Filters</h3>
            <div>
                <div>
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

                <div>
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