import { Card } from "../card"
import { CardGroup } from "../cardgroup"

const searchStackContainer = document.getElementById('search-stack-container') as HTMLDivElement;

export const initSearchStack = () => {
    const clearStackButton = document.getElementById('search-stack-clear-button') as HTMLButtonElement;
    clearStackButton.addEventListener('click', () => {
        searchStackContainer.innerHTML = '';
    })
}

export const addItemToStack = (item : Card | CardGroup) => {
    const currentNode = item.getNode();
    // @ts-ignore
    if (window.MathJax) MathJax.typeset([currentNode]);
    searchStackContainer.prepend(currentNode);
}