import {useState, useEffect} from "react";
import Tags from "./Tags.jsx";
import './FilterMenu.css'


export default function FilterMenu({onClose, passFilters, passTags, isOpened, className}) {

    function handleImageFormChange (value) {
        setImageForm(value);
        if (!changes){
            setChanges(true);
        }
    }

    const [ changes, setChanges ] = useState(false);
    const [currentDate, setCurrentDate] = useState('new');
    const [currentSize, setCurrentSize] = useState(null);
    const [currentLike, setCurrentLike] = useState(null);
    const [ imageForm, setImageForm ] = useState(null);
    const [ tags, setTags ] = useState([]);


    function toggleDropdown(e) {
        let chooseBox = e.target.parentElement;
        chooseBox.children[1].classList.toggle('active');
        chooseBox.children[1].classList.toggle('opened');
    }

    function selectDropdown(e, setter) {
        let box = e.target.parentElement.parentElement; // chooseBox
        box.children[0].innerHTML = e.target.innerHTML;
        let a = e.target.id
        a = a === 'null' ? null : a;
        
        setter(a);

        setChanges(true);
        box.children[1].classList.toggle('active');
    }
    
    function handleSimpleClose() {
        let dropdownArray = Array.from(document.getElementsByClassName('select-dropdown'));
        console.log(dropdownArray);
        for (let key in dropdownArray) {
            dropdownArray[key].classList.remove('active');
        }
        onClose();
    }

    function handleClose() {
        if (changes) {
            passFilters(old_filter => {
                return {
                    primaryFilter: old_filter.primaryFilter,
                    secondaryFilter: [currentSize, currentDate, currentLike, imageForm]
                }
            });
            passTags(tags);
        }
        setChanges(false);
        handleSimpleClose();
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

                    <div className='select-block'>
                        <div className='select-result' onClick={(e) => toggleDropdown(e)}>By date new</div>
                        <ul className='select-dropdown' id='dropdown1' style={{'--amount': 2}}>
                            <li id="new" onClick={(e) => {selectDropdown(e, setCurrentDate);}}>By date new</li>
                            <li id="old" onClick={(e) => {selectDropdown(e, setCurrentDate);}}>By date old</li>
                        </ul>
                    </div>
                    
                    <div className='select-block'>
                        <div className='select-result' onClick={(e) => toggleDropdown(e)}>By likes all</div>
                        <ul className='select-dropdown' id='dropdown1' style={{'--amount': 4}}>
                            <li id="null" onClick={(e) => {selectDropdown(e, setCurrentLike);}}>By likes all</li>
                            <li id="like1k" onClick={(e) => {selectDropdown(e, setCurrentLike);}}>{'likes < 1k'}</li>
                            <li id="like1k_10k" onClick={(e) => {selectDropdown(e, setCurrentLike);}}>{'1k < likes < 10k'}</li>
                            <li id="like10k" onClick={(e) => {selectDropdown(e, setCurrentLike);}}>{'likes > 10k'}</li>
                        </ul>
                    </div>

                    <div className='select-block'>
                        <div className='select-result' onClick={(e) => toggleDropdown(e)}>All sizes</div>
                        <ul className='select-dropdown' id='dropdown1' style={{'--amount': 4}}>
                            <li id="null"  onClick={(e) => {selectDropdown(e, setCurrentSize);}}>All sizes</li>
                            <li id="sizeS" onClick={(e) => {selectDropdown(e, setCurrentSize);}}>Small size</li>
                            <li id="sizeM" onClick={(e) => {selectDropdown(e, setCurrentSize);}}>Medium size</li>
                            <li id="sizeB" onClick={(e) => {selectDropdown(e, setCurrentSize);}}>Big size</li>
                        </ul>
                    </div>

                </div>
            </div>
            <button onClick={handleSimpleClose}>
                <img src='/NavBarElements/close_filters.svg' alt='Close filters'/>
            </button>
        </div>
    );
}