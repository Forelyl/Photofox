import {useState} from "react";
import Tags from "../Tags/Tags.jsx";
import useFilterRoulette from "../../utils/useFilterRoulette.js";

export default function FilterMenu({onClose, sets}) {
    const [ currentLikeKey, setCurrentLikeKey ] = useState([0, null]);
    const [ currentSizeKey, setCurrentSizeKey ] = useState([0, null]);
    const [ currentDateKey, setCurrentDateKey ] = useState([0, 'new']);

    const [ currentLike, setLikes ] = useFilterRoulette([null, 'like1k', 'like1k_10k', 'like10k'], currentLikeKey, setCurrentLikeKey);
    const [ currentSize, setSize ] = useFilterRoulette([null, 'sizeS', 'sizeM', 'sizeB'], currentSizeKey, setCurrentSizeKey);
    const [ currentDate, setDate ] = useFilterRoulette(['new', 'old'], currentDateKey, setCurrentDateKey);

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
                    <Tags></Tags>
                </div>
                <div>
                    <div>
                        <button onClick={() => setDate(-1)}>
                            <img src='/NavBarElements/change_filter.svg' alt='change back'/>
                        </button>
                        <span>By date {currentDate}</span>
                        <button onClick={() => setDate(1)}>
                            <img src='/NavBarElements/change_filter.svg' alt='change forvard'/>
                        </button>
                    </div>
                    <div>
                        <button onClick={() => setLikes(-1)}>
                            <img src='/NavBarElements/change_filter.svg' alt='change back'/>
                        </button>
                        <span>By likes {(!currentLike) ? 'default' : currentLike}</span>
                        <button onClick={() => setLikes(1)}>
                            <img src='/NavBarElements/change_filter.svg' alt='change forvard'/>
                        </button>
                    </div>
                    <div>
                        <button onClick={() => setSize(-1)}>
                            <img src='/NavBarElements/change_filter.svg' alt='change back'/>
                        </button>
                        <span>By size {(!currentSize) ? 'default' : currentSize}</span>
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