import { Card } from "../card"
import { CardGroup } from "../cardgroup"

const searchStackContainer = document.getElementById('search-stack-container') as HTMLDivElement;

export const initSearchStack = (cards: Card[], cardGroups: CardGroup[]) => {
    const combinedItems: (Card | CardGroup)[] = [...cards, ...cardGroups];
    const clearStackButton = document.getElementById('search-stack-clear-button') as HTMLButtonElement;
    clearStackButton.addEventListener('click', () => {
        searchStackContainer.innerHTML = '';
        saveStack();
    });

    // local storage loading...
    const prevData = localStorage.getItem("stack-data");
    if(prevData !== null){
        try {
            const data = JSON.parse(prevData) as {stack: string[]};
            data.stack.forEach(id => {
                const item = combinedItems.find(item => item.uniqueID === id);
                if(!item) return;
                searchStackContainer.append(item.getNode());
            });
        } catch(e){

        }
    }
}

// local storage stack saving...
export const saveStack = () => {
    const data = {stack: [] as string[]};
    for(let child of searchStackContainer.children){
        data.stack.push(child.id);
    };
    localStorage.setItem("stack-data", JSON.stringify(data));
}

export const addItemToStack = (item : Card | CardGroup) => {
    const currentNode = item.getNode();
    // @ts-ignore
    if (window.MathJax) MathJax.typeset([currentNode]);
    searchStackContainer.prepend(currentNode);
    saveStack();
}

export const removeItemFromStack = (item : Card | CardGroup) => {
    const currentNode = item.getNode();
    currentNode.remove();
    saveStack();
}