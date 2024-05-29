import {useState, useEffect} from "react";

export default function useFilterRoulette (valuesArray, titlesArray, currentElement, setCurrentElement) {
    const values = valuesArray;
    const titles = titlesArray;
    const length = valuesArray.length;

    function changeCurrentPoint(move) {
        setCurrentElement(element => {
            let new_key = element[0] + move;

            if (new_key === length) {
                new_key = 0;
            }
            else if (new_key === -1) {
                new_key = length - 1;
            }
            let new_value = values[new_key];
            let new_title = titles[new_key];
            return [new_key, new_title, new_value];
        });

    }

    return [ currentElement[1], currentElement[2], changeCurrentPoint ];
}